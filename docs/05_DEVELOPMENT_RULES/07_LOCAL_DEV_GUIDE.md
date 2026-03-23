# 07_LOCAL_DEV_GUIDE (ローカル開発・検証ガイド)

本ドキュメントでは、AWSなどのクラウド環境にデプロイする前に、自分のPC（ローカル）で各機能を検証する方法を説明します。

## 1. ローカル基盤の起動 (Docker)

エッジPCの通信（MQTT）やクラウドのエミュレーション（LocalStack）を起動します。

```bash
cd infrastructure/docker
docker-compose up -d
```

*   **mosquitto:** 1883番ポートでMQTTブローカーが起動。
*   **localstack:** 4566番ポートでS3/DynamoDBの擬似サーバーが起動。

---

## 2. クラウド機能のローカル検証

### 2.1. ローカルAWSの初期化
LocalStackを起動した後、一度だけ以下のスクリプトを実行して、S3バケットとDynamoDBテーブルを作成してください。

```bash
./scripts/dev/init_local_aws.sh
```

### 2.2. APIサーバーの擬似起動
AWS SAMを使用して、自分のPC内でAPIサーバーを立ち上げます。

```bash
cd infrastructure/aws
sam local start-api
```
これにより、`http://localhost:3000` でAPIが叩けるようになります。

---

## 3. 通信（MQTT）のテスト

エッジPCとロボット（ESP32）の間の通信をテストするには、MQTTクライアント（`mosquitto_pub` 等）を使用します。

```bash
# コマンドの受信待機 (Subscribe)
mosquitto_sub -h localhost -t "cocoba/device/control"

# コマンドの送信 (Publish)
mosquitto_pub -h localhost -t "cocoba/device/control" -m '{"action": "stop"}'
```

---

## 4. エッジロジックの実行

エッジPC上のPythonロジックをテストします。

```bash
cd src/edge
source .venv/bin/activate
python main.py
```
※ 必要に応じて、コード内で `endpoint_url="http://localhost:4566"` (S3) や `broker="localhost"` (MQTT) に向けて実行するように設定してください。

---

## 5. フロントエンドの実行

管理画面のUIを確認します。

```bash
cd src/frontend
npm run dev
```
ブラウザで `http://localhost:3000` にアクセスして確認します。

---

## 6. コミット前の最終確認

自分の作業が完了したら、必ず以下の点検スクリプトを実行して、全体が壊れていないことを確認してください。

```bash
./scripts/dev/check_all.sh
```

---

## 逆引き辞典：困ったときは

*   **「S3の中身を確認したい」**
    → `awslocal s3 ls s3://cocoba-assets-local`
*   **「Lambdaのログを見たい」**
    → `sam local start-api` を実行しているターミナルに出力されます。
*   **「MQTTのメッセージが届かない」**
    → `docker-compose logs -f mosquitto` でブローカーのログを確認してください。
