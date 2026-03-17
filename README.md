# Cocoba(ここば): 老犬を守る自律型排泄物シールドロボット

## プロジェクト概要
**Cocoba (ここば)** は、14歳の老犬「ここちゃん」が留守中に排泄物を踏み散らかしてしまう問題を解決するための、AI搭載型・自律移動ロボットです。
プロジェクト名は、**「ここちゃん (Coco)」** と **「ルンバ (Roomba)」** を掛け合わせて名付けました。

### 背景と目的
ここちゃんにとって、新しいトイレトレーニングは困難です。飼い主が不在の際、排泄物を踏んで床全体が汚れてしまう事故が発生しており、帰宅後の清掃負担と愛ここちゃんへの衛生面での懸念が課題となっていました。

Cocobaは、AIによる排泄検知、おやつによるここちゃんの誘導、そして物理的なドーム（シールド）による排泄物の隔離を自動で行うことで、「踏み散らかし事故をゼロ」にし、飼い主の負担を劇的に削減することを目指しています。

---

## 解決アプローチ

1.  **AI検知:**
    ネットワークカメラの映像から「ここちゃん」「排泄ポーズ」「排泄物」をリアルタイムでAIが識別。排泄場所を特定します。
2.  **誘引・退避:**
    排泄直後、おやつシューターを稼働させてここちゃんを安全な領域へ誘導。ロボットとの接触リスクを最小化します。
3.  **隔離・シールド:**
    自律移動ロボットが排泄箇所へ移動し、物理的なドームを投下して「覆う」ことで、ここちゃんの踏み散らかしを防止します

---

## システムアーキテクチャ

### 構成図（作成中）
```mermaid
graph TB
    subgraph "自宅 (Edge Environment)"
        Camera[ネットワークカメラ] -- "映像ストリーム (RTSP)" --> EdgePC[エッジPC: 推論・ハード制御]
        EdgePC -- "誘導指示 (ローカルMQTT)" --> ESP32_A[ESP32: おやつシューター]
        EdgePC -- "移動指示 (ローカルMQTT)" --> ESP32_B[ESP32: ルンバ]
        EdgePC -- "シールド指示 (ローカルMQTT)" --> ESP32_C[ESP32: シールドロボット]
    end

    subgraph "Amazon Web Service"
        IoTCore[AWS IoT Core]
        AppRunner[AWS App Runner: FastAPI]
        RDS[(Amazon RDS: PostgreSQL)]
        TrainJob[AWS SageMaker / ECS: 学習バッチジョブ]
        subgraph "Amazon S3"
            S3_Img[Images: スナップショット画像]
            S3_Model[Models: 学習済みAIモデル]
        end
    end

    subgraph "スマホ／PC"
        WebUI[Web UI: Next.js PWA / Amplify]
    end

    subgraph "外部連携"
        LINE[LINE Messaging API]
    end

    %% 通信経路 (遠隔操作と状態同期)
    WebUI -- "遠隔操作/緊急停止 (MQTT over WS)" --> IoTCore
    IoTCore -- "コマンド送信・更新通知 (MQTT over TLS)" ---> EdgePC
    EdgePC -- "状態同期・ログ・メトリクス (HTTPS)" --> AppRunner
    WebUI -- "ログ閲覧・設定 (HTTPS)" --> AppRunner
    AppRunner -- "データ保存" --> RDS
    AppRunner -- "プッシュ通知 (HTTPS)" --> LINE

    %% S3直接通信 (Presigned URLパターン)
    AppRunner -. "署名付きURL発行" .-> EdgePC
    EdgePC -- "画像UP (S3直接通信)" --> S3_Img
    EdgePC -- "新モデルDL (S3直接通信)" --> S3_Model

    %% 学習サイクル (非同期)
    AppRunner -- "学習ジョブ非同期キック" --> TrainJob
    S3_Img -- "学習データ読込" --> TrainJob
    TrainJob -- "学習済みモデル出力" --> S3_Model
    TrainJob -- "モデル更新をIoT Coreへ通知" --> IoTCore
```
※遠隔操作コマンド：緊急停止（キルスイッチ）、手動介入など

### 1. エッジ・推論レイヤー (Intel N100 / Python)
*   **役割:** YOLOv8を用いた物体検知、ロボットへの座標計算・移動指示。
*   **技術:** Python 3.11+, ONNX Runtime (INT8量子化), OpenCV, MQTT。
*   **熱対策:** N100のサーマルスロットリングを防ぐため、OpenVINOによる最適化とCPU負荷の徹底抑制。

### 2. フィジカル・制御レイヤー (ESP32 / C++)
*   **役割:** モーターの精密駆動、おやつ排出機構の制御、センサー監視、フェイルセーフ。
*   **技術:** C++17 (PlatformIO/Arduino), FreeRTOS (デュアルコア活用), MQTT
*   **安全性:** ネットワーク切断時や障害物接近時の自動停止機能を搭載。

### 3. クラウド・監視レイヤー (Next.js / FastAPI)
*   **役割:** 外出先からのステータス確認、検知時の通知、緊急停止（キルスイッチ）。
*   **技術:** AWS, Next.js, TypeScript, FastAPI, Tailwind CSS, MQTT, LINE Messaging API

---

## ディレクトリ構成

```text
├── data/                  # AI学習用データセット（画像・アノテーション）
├── docs/                  # 要件定義・設計・開発ルール等の仕様書一式
├── hardware/              # 3Dモデル(.stl), 回路図, 部品表(BOM)
├── infrastructure/        # docker-compose (Backend/MQTT)
├── models/                # 学習済みAIモデル (.onnx, OpenVINO IR)
├── scripts/               # 汎用スクリプト (ISSUE追加、セットアップ)
└── src/
    ├── inference/         # エッジAI推論エンジン (Python)
    ├── firmware/          # ESP32ファームウェア (C++)
    ├── backend/           # 状態同期・通信ブローカー (Python/FastAPI)
    └── frontend/          # 遠隔監視ダッシュボード (Next.js/TypeScript)
```

---

## 安全性への最優先事項
*   **近接停止 (Proximity Stop):** ロボット稼働中にここちゃんが1.0m以内に接近した場合、1秒以内に強制停止。
*   **遠隔キルスイッチ:** WebUIから瞬時にロボットの全機能を停止可能。
*   **フェイルセーフ:** 通信断絶時にはモーター出力を自動的にゼロにします。