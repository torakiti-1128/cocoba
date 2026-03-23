# インフラ構成 (Infrastructure)

このディレクトリには、cocobaプロジェクトのInfrastructure-as-Code (IaC) およびコンテナ化設定が含まれています。

## ディレクトリ構造

- `aws/`: AWS SAMを使用したサーバーレスインフラ定義。
  - `template.yaml`: S3、DynamoDB、API Gateway、Cognito、およびLambda関数のメインテンプレート。
- `docker/`: エッジ環境向けのコンテナ設定。
  - `docker-compose.yml`: エッジPCで動作するローカルサービスの管理。
  - `mosquitto/`: ローカルMQTTブローカー (Eclipse Mosquitto) の設定。

## デプロイ方法

### AWS インフラ
以下のコマンドを使用して、SAMテンプレートをデプロイします：
```bash
cd aws
sam build
sam deploy --guided
```

### ローカルサービス (エッジPC)
Docker Composeを使用してローカルサービスを起動します：
```bash
cd docker
docker-compose up -d
```
