# 06_ENVIRONMENT_SETUP (環境構築手順)

本プロジェクトの開発を始めるために必要な、ツール群のインストールおよびセットアップ手順を説明します。

## 1. 必須ツール (Prerequisites)

各プラットフォーム（Linux / macOS / Windows WSL2）に応じて、以下のツールを事前にインストールしてください。

| ツール | 推奨バージョン | 用途 |
| :--- | :--- | :--- |
| **Node.js** | v20.x (LTS) | フロントエンド (Next.js) の開発・ビルド |
| **Python** | 3.11.x | AI学習、エッジロジック、AWS Lambdaの開発 |
| **Docker** | 最新版 (Compose v2対応) | ローカルMQTTブローカー、LocalStackの実行 |
| **AWS SAM CLI** | 最新版 | サーバーレスインフラの検証・デプロイ |
| **PlatformIO** | 最新版 | ESP32マイコンのビルド・書き込み |

---

## 2. 初回一括セットアップ (Quick Start)

プロジェクトをクローンした後、以下のスクリプトを実行することで、全てのサブシステムの準備が一度に完了します。

```bash
./scripts/setup/full_setup.sh
```

このスクリプトは内部で以下の処理を行います：
1.  各ディレクトリ（`src/edge`, `src/functions` 等）に Python 仮想環境 (`.venv`) を作成。
2.  必要なライブラリ（YOLO, MQTT, Boto3等）のインストール。
3.  フロントエンドの `npm install`。

---

## 3. スコープ別セットアップ (Scoped Setup)

特定の領域のみを開発する場合、個別のセットアップスクリプトを使用して、最小限の環境だけを構築できます。

| コマンド | 対象スコープ | 主なインストール内容 |
| :--- | :--- | :--- |
| `./scripts/setup/training.sh` | AI学習 | Ultralytics (YOLOv8), OpenCV |
| `./scripts/setup/backend.sh` | クラウドAPI | Boto3, awscli-local |
| `./scripts/setup/edge.sh` | エッジPC | paho-mqtt, opencv-python |
| `./scripts/setup/firmware.sh` | 組み込み | PlatformIO Core |
| `./scripts/setup/frontend.sh` | フロントエンド | Next.js 依存パッケージ |

---

## 4. 仮想環境の有効化 (Activation)

各ディレクトリ配下に `.venv` が作成されます。Pythonの開発を行う際は、各ディレクトリに移動して仮想環境を有効化してください。

```bash
# 例: エッジPCロジックの開発
cd src/edge
source .venv/bin/activate
```

---

## 5. 構築の確認

セットアップが正しく完了したか確認するには、点検スクリプトを実行してください。

```bash
./scripts/dev/check_all.sh
```
全ての項目が「OK」または「スキップ（警告）」であれば、開発準備は完了です。
