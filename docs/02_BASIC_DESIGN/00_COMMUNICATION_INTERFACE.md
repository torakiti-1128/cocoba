# 00_COMMUNICATION_INTERFACE (通信インターフェース定義)

## 1. 概要
本ドキュメントは、Cocobaシステムにおける各コンポーネント間（Web UI、AWS、エッジPC、マイコン）の通信インターフェースを包括的に定義する。
通信プロトコルとして、非同期・統計データ取得用の **REST API** と、リアルタイム制御・状態同期用の **MQTT** を併用する。

---

## 2. REST API 定義 (Web UI ⇔ AWS)
主に統計データの取得、永続的な設定の保存、デバイス詳細情報の取得に使用する。

### 2.1. エンドポイント一覧
| パス | メソッド | 用途 | 説明 |
| :--- | :--- | :--- | :--- |
| `/stats/activity` | `GET` | 活動トレンド | 時間帯別の状態（寝ている・動いている・うんち）の割合を取得 |
| `/stats/work-duration`| `GET` | 稼働時間 | ルンバの時間帯別走行時間（分）を取得 |
| `/stats/health-trend` | `GET` | 長期トレンド | 直近1ヶ月の活動率推移を取得 |
| `/logs` | `GET` | ログ一覧 | フィルタを指定して履歴を取得。画像URLを含む |
| `/config` | `GET/POST` | システム設定 | 稼働スケジュール、安全しきい値、通知設定等の取得・保存 |
| `/device/details` | `GET` | デバイス詳細 | エッジPCのOS、IP、シリアル番号等の静的情報を取得 |

---

## 3. MQTT 定義 (Edge ⇔ Cloud ⇔ ESP32)
低レイテンシが要求される緊急停止、状態同期、およびデバイス制御に使用する。

### 3.1. クラウド通信 (AWS IoT Core)
| トピック名 | 方向 | ペイロード | 用途 |
| :--- | :--- | : :--- | :--- |
| `cocoba/cloud/status` | Edge → Cloud | [StatusPayload](#41) | 全体の稼働状態・詳細メトリクス同期 |
| `cocoba/cloud/command` | Web → Edge | `{"command": "str"}` | [CommandSet](#43) (KILL, HOME, RESTART等) |
| `cocoba/cloud/health` | Edge → Cloud | [HealthPayload](#44) | 各種サービス・デバイスの死活監視 |

### 3.2. ローカル通信 (Local Mosquitto)
| トピック名 | 方向 | ペイロード | 用途 |
| :--- | :--- | :--- | :--- |
| `cocoba/local/robot/move` | Edge → Robot | `{"v": x, "w": z}` | 移動指示 (速度ベクトル) |
| `cocoba/local/robot/action` | Edge → Robot | `{"action": "str"}` | 個別機能停止 (STOP_SHIELD等) |
| `cocoba/local/shooter/push` | Edge → Shooter | `{"rotations": n}` | おやつ排出指示 (回転数指定) |
| `cocoba/local/heartbeat` | Device → Edge | `{"module": "str"}` | 機能単位の生存確認 (ONLINE/OFFLINE) |

---

## 4. データ構造詳細 (JSON)

### 4.1. StatusPayload (リアルタイム状態同期)
```json
{
  "timestamp": 1710892800,
  "system_state": "MOVING",
  "dog_status": "ACTIVE",    // SLEEP | ACTIVE | POOPING
  "decision_support": {
    "distance": 0.8,         // ココちゃんとの距離 (m)
    "coco_pos": {"x": 140, "y": 60},
    "robot_pos": {"x": 60, "y": 100}
  },
  "metrics": {
    "dome_remaining": 4,
    "cpu_temp": 52.5,
    "robot_temp": 38.5,
    "fps": 10.2
  }
}
```

### 4.2. ConfigPayload (システム設定)
```json
{
  "schedule": {
    "mode": "weekdays", 
    "start_time": "09:00",
    "end_time": "19:00"
  },
  "safety": {
    "cpu_temp_limit": 75,
    "robot_temp_limit": 60,
    "move_speed": "standard"
  },
  "notifications": {
    "on_poop": true,
    "on_pose": true,
    "on_deployed": true
  }
}
```

### 4.3. CommandSet (操作コマンド)
*   **緊急停止:** `KILL` (全停止)
*   **個別停止:** `STOP_ROBOT`, `STOP_SHIELD`, `STOP_SHOOTER`, `STOP_INF`, `STOP_CAM`
*   **メンテナンス:** `RESTART_INF`, `RESET_ESP`, `UPDATE_MODEL`, `PING`

### 4.4. HealthPayload (死活監視)
```json
{
  "local": {
    "camera": "ONLINE", "edge_pc": "ONLINE", "robot": "ONLINE",
    "shield": "ONLINE", "shooter": "ONLINE", "broker": "ONLINE"
  },
  "cloud": {
    "iot_core": "ONLINE", "api_gateway": "ONLINE", "lambda": "ONLINE",
    "dynamodb": "ONLINE", "s3": "ONLINE"
  }
}
```
