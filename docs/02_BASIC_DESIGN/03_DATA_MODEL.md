# 03_DATA_MODEL (データモデル設計)

## 1. 概要
本ドキュメントは、Cocobaシステムにおけるデータの永続化設計を定義する。
低コスト・スケーラビリティを重視し、データベースには **Amazon DynamoDB**、非構造化データには **Amazon S3** を採用する。

---

## 2. Amazon DynamoDB 設計

### 2.1. SystemConfig テーブル
システムの動作定数やスケジュールを管理する。
*   **Partition Key:** `device_id` (String)

| 属性名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `schedule` | Map | 稼働日・開始/終了時刻 | `{"mode": "weekdays", "start": "09:00"}` |
| `safety` | Map | 温度しきい値・移動速度 | `{"cpu_limit": 75, "speed": "standard"}` |
| `notifications` | Map | LINE通知の各ON/OFF | `{"on_poop": true, "on_pose": true}` |
| `shooter` | Map | おやつ排出設定 | `{"amount": 1, "interval": 60}` |
| `inference` | Map | 信頼度しきい値等 | `{"conf": 0.75, "fps": 10}` |
| `updated_at` | Number | 最終更新タイムスタンプ | `1710892800` |

### 2.2. ActivityLogs テーブル
全稼働履歴を保存する。
*   **Partition Key:** `device_id` (String)
*   **Sort Key:** `timestamp` (Number)

| 属性名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `type` | String | POOP, SNACK, SAFETY, SYSTEM, MAINT | `MAINT` |
| `sub_type` | String | MODEL_UPDATE, DIAG, REBOOT等 | `MODEL_UPDATE` |
| `title` | String | ログのタイトル | `近接警告: 自動停止` |
| `detail` | String | 詳細な説明文 | `0.5m以内に接近したため...` |
| `has_image` | Boolean | 画像の有無 | `true` |
| `image_s3_key` | String | S3内のオブジェクトキー | `images/20260319_1420.jpg` |

### 2.3. Statistics テーブル
グラフ描画用の時間帯別集計データ。
*   **Partition Key:** `device_id#type` (String) - 例: `robot_01#ACTIVITY`
*   **Sort Key:** `date_hour` (String) - 例: `2026-03-19#14`

| 属性名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `data` | Map | グラフ用の数値セット | `{"active": 20, "sleep": 70, "poop": 10}` |
| `unit` | String | 単位 | `%` or `minutes` |

---

## 3. Amazon S3 バケット設計

### 3.1. バケット名: `cocoba-assets-{account_id}`

| ディレクトリパス | 内容 | 保存期間 (TTL) |
| :--- | :--- | :--- |
| `images/{date}/{device_id}/` | 検知時のスナップショット画像 | 30日間 |
| `models/latest/` | 最新の学習済みAIモデル (ONNX/OpenVINO) | 無期限 |
| `models/archive/` | 過去のAIモデルのバックアップ | 90日間 |

---

## 4. エッジPC ローカルデータ (キャッシュ)
クラウド遮断時の継続稼働および低レイテンシ動作のため、以下のデータをエッジPC内で保持する。

*   **config.json**: 最新の設定値。起動時およびMQTTでの変更通知時に更新。
*   **current_model.onnx**: 現在推論に使用しているAIモデル。
*   **upload_queue/**: オフライン時に一時的に画像を保持するディレクトリ。再接続時に一括アップロード。

---

## 5. データ整合性・セキュリティ
*   **TTL (Time To Live):** `ActivityLogs` にはTTLを設定し、古いログを自動削除してDBコストを抑制する。
*   **署名付きURL:** S3上の画像およびAIモデルへのアクセスは、すべてAPI Gateway経由で発行される「有効期限付き署名付きURL」を使用する。バケット自体は非公開とする。
