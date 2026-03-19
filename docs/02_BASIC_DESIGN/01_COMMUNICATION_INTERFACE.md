# 01_COMMUNICATION_INTERFACE（通信インターフェース設計）

## 1. 通信プロトコルの全体像
本システムは、リアルタイム性が求められる「制御・状態同期」と、確実性が求められる「データ永続化・通知」でプロトコルを使い分ける。

| 経路 | プロトコル | 用途 | 備考 |
| :--- | :--- | :--- | :--- |
| **エッジPC ⇔ AWS IoT Core** | MQTT over TLS | 遠隔操作、状態同期、設定反映 | QoS 1 |
| **WebUI ⇔ AWS IoT Core** | MQTT over WS | 緊急停止、監視 | 低レイテンシ |
| **エッジPC ⇔ ESP32** | MQTT (TCP) | デバイス制御・物理状態取得 | ローカルMosquitto |
| **エッジPC → API Gateway** | HTTPS | 署名付きURL要求、ログ保存 | REST API |

---

## 2. MQTT トピック構成 (Pub/Sub)

### 2.1. クラウド・遠隔監視用 (AWS IoT Core)
| トピック名 | 方向 | ペイロード | 用途 |
| :--- | :--- | :--- | :--- |
| `cocoba/cloud/status` | Edge → Cloud | [StatusPayload](#31) | 全体の稼働状態同期 |
| `cocoba/cloud/command` | Web → Edge | `{"command": "string"}` | KILL, RECOVER, HOME, SLEEP |
| `cocoba/cloud/config` | Web → Edge | `{"config": { ... }}` | 推論しきい値等の設定反映 |

### 2.2. ローカル制御用 (Local Mosquitto)
エッジPCと、各デバイス（ロボット、シューター）間の物理制御。

| トピック名 | 方向 | ペイロード | 用途 |
| :--- | :--- | :--- | :--- |
| `cocoba/local/robot/move` | Edge → Robot | [MovePayload](#32) | 移動指示(速度ベクトル) |
| `cocoba/local/robot/action` | Edge → Robot | `{"action": "string"}` | DEPLOY_DOME, EMERGENCY_STOP |
| `cocoba/local/robot/feedback` | Robot → Edge | [FeedbackPayload](#33) | 投下完了通知、スタック詰まり等のエラー |
| `cocoba/local/shooter/push` | Edge → Shooter | `{"count": 1}` | おやつ排出指示 |
| `cocoba/local/heartbeat` | Both | `{"id": "string", "uptime": 120}` | デバイスの生存確認 |

---

## 3. メッセージペイロード詳細

### 3.1. StatusPayload (Cloud同期)
```json
{
  "timestamp": 1710892800,
  "system_state": "DEPLOYING",  // IDLE, DETECTED, DECOYING, MOVING, DEPLOYING, RETURNING, ERROR
  "dome_remaining": 4,          // 現在のドーム残弾
  "cpu_temp": 52.5,
  "fps": 10.0,
  "robot_pos": {"x": 1.2, "y": 0.8}, // カメラ座標系でのメートル座標
  "error_code": "NONE"          // NONE, TIMEOUT, OBSTACLE_NEAR, MARKER_LOST, JAMMED
}
```

### 3.2. MovePayload (ロボット移動指示)
```json
{
  "linear_velocity": 0.15,   // 前進速度 [m/s]
  "angular_velocity": 0.52   // 旋回速度 [rad/s] (左旋回+)
}
```

### 3.3. FeedbackPayload (物理動作結果)
物理的な動作が「完了」したことをエッジへ通知し、状態遷移（帰還への移行など）をトリガーする。
```json
{
  "device_id": "robot_01",
  "action_completed": "DEPLOY_DOME",
  "result": "SUCCESS",       // SUCCESS, FAILED_JAMMED, FAILED_EMPTY
  "battery_voltage": 11.8
}
```

---

## 4. 物理アクション・シーケンス

### 4.1. ドーム投下シーケンス (完全版)
1. **[Edge]** ロボットが目標座標に到達（誤差5cm以内をカメラで確認）。
2. **[Edge]** `cocoba/local/robot/action` に `{"action": "DEPLOY_DOME"}` を送信。
3. **[Robot]** サーボを駆動し、ドームを1つ切り離す。
4. **[Robot]** リミットスイッチまたは電流検知で「切り離し完了」を確認。
5. **[Robot]** `cocoba/local/robot/feedback` に `{"action_completed": "DEPLOY_DOME", "result": "SUCCESS"}` を返信。
6. **[Edge]** フィードバック受信後、内部の `dome_remaining` を1減算し、クラウドへ最新ステータスを同期。
7. **[Edge]** ステートを `RETURNING` (帰還) へ遷移させる。

### 4.2. おやつ誘導シーケンス
1. **[Edge]** 排泄検知。
2. **[Edge]** `cocoba/local/shooter/push` に `{"count": 1}` を送信。
3. **[Shooter]** モーターを1回転させ、おやつを排出。
4. **[Edge]** カメラ映像で犬が退避（1.5m以上）したことを確認するまで待機。
5. **[Edge]** 15秒経過しても退避しない場合は `cocoba/local/robot/action` は送らず、異常ステータスを通知。

### 4.3. フェイルセーフ（安全停止）
*   **通信タイムアウト:** ESP32は `cocoba/local/robot/move` を **500ms** 受信しなかった場合、自律的にモーターを停止させる（暴走防止）。
*   **物理キル:** WebUIからの `KILL` コマンド受信時、エッジPCは `cocoba/local/robot/action` に `EMERGENCY_STOP` を送信し、全出力を遮断する。
