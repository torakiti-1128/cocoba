# 01_COMMUNICATION_INTERFACE（通信インターフェース設計）

## 1. 通信プロトコルの全体像
本システムは、リアルタイム性が求められる「制御・状態同期」と、確実性が求められる「データ永続化・通知」でプロトコルを使い分ける。

| 経路 | プロトコル | 用途 | 備考 |
| :--- | :--- | :--- | :--- |
| **エッジPC ⇔ AWS IoT Core** | MQTT over TLS | 遠隔操作、状態同期、設定反映 | QoS 1 |
| **WebUI ⇔ AWS IoT Core** | MQTT over WS | 緊急停止、監視 | 低レイテンシ |
| **エッジPC ⇔ ESP32** | MQTT (TCP) | デバイス制御・物理状態取得 | ローカルMosquitto |
| **WebUI ⇔ API Gateway** | HTTPS | 履歴データ取得、設定保存 | REST API |
| **エッジPC → API Gateway** | HTTPS | 署名付きURL要求、ログ保存 | REST API |

---

## 2. MQTT トピック構成 (Pub/Sub)

### 2.1. クラウド・遠隔監視用 (AWS IoT Core)
| トピック名 | 方向 | ペイロード | 用途 |
| :--- | :--- | :--- | :--- |
| `cocoba/cloud/status` | Edge → Cloud | [StatusPayload](#31) | 全体の稼働状態・メトリクス同期 |
| `cocoba/cloud/command` | Web → Edge | `{"command": "string"}` | [CommandSet](#34) |
| `cocoba/cloud/config` | Web → Edge | `{"config": { ... }}` | 推論しきい値等の設定反映 |

### 2.2. ローカル制御用 (Local Mosquitto)
| トピック名 | 方向 | ペイロード | 用途 |
| :--- | :--- | :--- | :--- |
| `cocoba/local/robot/move` | Edge → Robot | [MovePayload](#32) | 移動指示(速度ベクトル) |
| `cocoba/local/robot/action` | Edge → Robot | `{"action": "string"}` | 投下、個別停止、リセット等 |
| `cocoba/local/robot/feedback` | Robot → Edge | [FeedbackPayload](#33) | 動作結果、バッテリー、温度 |
| `cocoba/local/shooter/push` | Edge → Shooter | `{"count": 1}` | おやつ排出指示 |
| `cocoba/local/heartbeat` | Both | `{"id": "string", "uptime": 120}` | 生存確認 |

---

## 3. メッセージペイロード詳細

### 3.1. StatusPayload (Cloud同期)
UI上のダッシュボード、グラフ、メトリクスをすべて満たす全データセット。
```json
{
  "timestamp": 1710892800,
  "system_state": "DEPLOYING",  // IDLE, DETECTED, DECOYING, MOVING, DEPLOYING, RETURNING, ERROR
  "metrics": {
    "dome_remaining": 4,        // ドーム残弾
    "cpu_temp": 52.5,           // エッジPC温度
    "robot_temp": 38.5,         // ルンバ温度
    "fps": 10.2,                // 推論速度
    "wifi_signal": 92,          // Wi-Fi強度 [%]
    "uptime_days": 12,          // 連続稼働日数
    "dog_activity_rate": 42,    // 直近1時間の活動率 [%]
    "steps_today": 1200         // 本日の推定歩数
  },
  "robot_pos": {"x": 1.2, "y": 0.8},
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
```json
{
  "device_id": "robot_01",
  "action_completed": "DEPLOY_DOME",
  "result": "SUCCESS",       // SUCCESS, FAILED_JAMMED, FAILED_EMPTY
  "battery_voltage": 11.8,
  "internal_temp": 38.5      // ルンバ内部温度をエッジへフィードバック
}
```

### 3.4. CommandSet (操作コマンド)
UI上の「コマンドセンター」の全ボタンに対応。
*   **基本アクション:** `SHOOT` (おやつ), `DEPLOY` (シールド), `HOME` (帰還), `SCAN` (再検知)
*   **個別停止:** `STOP_ROBOT`, `STOP_SHIELD`, `STOP_SHOOTER`, `STOP_INFERENCE`, `STOP_CAMERA`, `KILL` (全停止)
*   **メンテナンス:** `RESTART_INF` (推論再起動), `RESET_ESP` (マイコンリセット), `PING` (通信テスト), `CHECK_STORAGE` (診断), `CLEAR_LOGS` (ログ消去)

---

## 4. REST API 定義 (API Gateway)

### 4.1. 履歴データ取得
グラフ（今日・1ヶ月）を描画するための統計データを取得する。
*   **Endpoint:** `GET /stats/activity`
*   **Query Params:** `range=today | monthly`
*   **Response:**
    ```json
    [
      {"time": "08:00", "rate": 20},
      {"time": "09:00", "rate": 45},
      ...
    ]
    ```

### 4.2. 画像・通知関連
*   **`POST /request-upload-url`**: S3署名付きURLの取得。
*   **`POST /notify-detection`**: LINE通知のトリガー。
*   **`GET /logs`**: ログ一覧の取得。
