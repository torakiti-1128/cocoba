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

## 技術スタック

### 構成図
```mermaid
graph TB
    subgraph "自宅 (ローカル環境)"
        Camera[ネットワークカメラ]
        
        subgraph "エッジPC"
            Logic[AWS連携・AI推論・デバイス制御: Python]
            LocalBroker[ローカルブローカー: Mosquitto]
        end
        
        ESP32_A[ESP32: Cocobaロボット群]
    end

    subgraph "Amazon Web Service"
        IoTCore[AWS IoT Core: コマンド中継]
        APIGW[API Gateway: ルーティング]
        Lambda[AWS Lambda: バックエンドロジック]
        Database[(Amazon DynamoDB: データベース)]
        subgraph "Amazon S3"
            S3_Model[Models: AIモデル]
            S3_Img[Images: スナップショット]
        end
    end

    subgraph "ユーザー"
        terminal[スマートフォン・PC]
    end

    subgraph "Web (Vercel)"
        WebUI[Web UI: Next.js PWA]
    end

    subgraph "開発環境"    
        DevPC[開発者PC: ローカル学習]
    end

    subgraph "外部連携"
        Line[LINE Messaging API]
    end

    %% ユーザー操作
    terminal -- "操作" --> WebUI

    %% エッジ内部連携
    Camera -- "映像 (RTSP)" --> Logic
    Logic -- "制御コマンド Publish" --> LocalBroker
    LocalBroker -- "コマンド Subscribe" --> ESP32_A
    ESP32_A -- "メトリクス/状態 Publish" --> LocalBroker
    LocalBroker -- "状態 Subscribe" --> Logic

    %% エッジPCとAWS連携
    Logic -- "メトリクス・ログ・温度送信 (HTTPS)" --> APIGW
    Logic -- "署名付きURLの要求 (HTTPS)" --> APIGW
    Logic -- "最新画像UP (HTTPS)" --> S3_Img
    Logic -- "新モデルDL (HTTPS)" --> S3_Model
    APIGW -. "署名付きURLを返却 (HTTPS)" .-> Logic
    IoTCore -- "遠隔操作・DL通知・設定反映"--> Logic

    %% AWS内部連携
    APIGW -- "処理委譲" --> Lambda
    Lambda -- "データ読み書き (HTTPS)" --> Database
    WebUI -- "データ閲覧・設定変更 (HTTPS)" --> APIGW
    Lambda -- "設定変更の反映 (MQTT over TLS)" --> IoTCore

    %% WEBと外部連携
    WebUI -- "遠隔操作 (MQTT over WS)" --> IoTCore
    Lambda -- "PUSH通知 (HTTPS) " --> Line

    %% 開発パイプライン (Local Training)
    DevPC -- "学習元データ取得 (HTTPS)" --> S3_Img
    DevPC -- "新モデルUP (HTTPS)" --> S3_Model
    DevPC -- "モデル更新通知 (MQTT over TLS)" --> IoTCore
```

### 1. エッジ・推論レイヤー (Intel N100 / Python)
*   **役割:** YOLOv8を用いた物体検知、ロボットへの座標計算・移動指示。
*   **技術:** Python 3.11+, ONNX Runtime (INT8量子化), OpenCV, MQTT。
*   **熱対策:** N100のサーマルスロットリングを防ぐため、OpenVINOによる最適化とCPU負荷の徹底抑制。

### 2. フィジカル・制御レイヤー (ESP32 / C++)
*   **役割:** モーターの精密駆動、おやつ排出機構の制御、センサー監視、フェイルセーフ。
*   **技術:** C++17 (PlatformIO/Arduino), FreeRTOS (デュアルコア活用), MQTT
*   **安全性:** ネットワーク切断時や障害物接近時の自動停止機能を搭載。

### 3. クラウド・監視レイヤー (Next.js / AWS Lambda)
*   **役割:** 外出先からのステータス確認、検知時のスナップショット閲覧、緊急停止（キルスイッチ）。
*   **技術:** Vercel (Next.js 14), AWS Lambda (Python), Amazon API Gateway, Amazon DynamoDB, AWS IoT Core (MQTT), LINE Messaging API。
*   **特性:** サーバーレス構成による低コスト運用と、MQTT over WebSocket による低レイテンシな緊急停止コマンドの送信。

---

## ディレクトリ構成

```text
├── data/                  # AI学習用データセット（画像・アノテーション）
├── docs/                  # 要件定義・設計・開発ルール等の仕様書一式
├── hardware/              # 3Dモデル(.stl), 回路図, 部品表(BOM)
├── infrastructure/        # Terraform/CloudFormation (AWSリソース定義)
├── models/                # 学習済みAIモデル (.onnx)
├── scripts/               # 汎用スクリプト (Issue追加、セットアップ)
└── src/
    ├── inference/         # エッジAI推論・制御ロジック (Python)
    ├── firmware/          # ESP32ファームウェア (C++)
    ├── backend/           # AWS Lambda バックエンド関数 (Python)
    └── frontend/          # Vercel 遠隔監視ダッシュボード (Next.js/TypeScript)
```

---

## 安全性への最優先事項
*   **近接停止 (Proximity Stop):** ロボット稼働中にここちゃんが1.0m以内に接近した場合、1秒以内に強制停止。
*   **遠隔キルスイッチ:** WebUIから瞬時にロボットの全機能を停止可能。
*   **フェイルセーフ:** 通信断絶時にはモーター出力を自動的にゼロにします。