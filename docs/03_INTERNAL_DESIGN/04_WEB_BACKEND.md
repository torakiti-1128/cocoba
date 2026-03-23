# 01_WEB_BACKEND (Webバックエンド設計)

## 1. 概要
AWS環境上に構築される、サーバーレス・バックエンドの実装詳細を定義する。
インフラ管理は AWS SAM (Serverless Application Model) で一元管理し、ロジックは Python で記述する。

## 2. アーキテクチャとコンポーネント

### 2.1. API Gateway + Lambda (REST API)
*   **役割:** Web UI からのデータ取得リクエスト（ログ、設定、統計）を処理する。
*   **認証:** API Gateway の Cognito Authorizer によって、有効な JWT トークンを持つリクエストのみを Lambda へルーティングする。
*   **Lambda 実装 (Python):**
    *   `boto3` を使用して DynamoDB からデータを取得。
    *   S3へのアップロード・ダウンロードが必要な場合、`generate_presigned_url` を用いて有効期限（5分）付きの URL を発行して UI へ返す。

### 2.2. AWS IoT Core (MQTT)
*   **役割:** Web UI と エッジPC 間の低レイテンシな双方向通信。
*   **ルールエンジン (IoT Rules):**
    *   エッジPCから送信された `cocoba/cloud/status` メッセージをフックし、自動的に DynamoDB の `SystemConfig` テーブル（現在状態）を更新する。
    *   特定の条件（例: 排泄検知、エラー発生）を満たした場合、Lambda をトリガーして飼い主の LINE へプッシュ通知を送信する。

## 3. データアクセス・パターン (DynamoDB)

DynamoDBはNoSQLであるため、Web UI が必要とする画面表示に合わせてクエリを最適化する。

*   **直近のログ一覧取得:**
    *   テーブル: `ActivityLogs`
    *   Query: `PartitionKey = {device_id}`
    *   Sort: `SortKey (timestamp) DESC`
    *   Limit: 20件
*   **日次グラフデータの取得:**
    *   テーブル: `Statistics`
    *   Query: `PartitionKey = {device_id}#ACTIVITY` かつ `SortKey BEGINS_WITH {YYYY-MM-DD}`

## 4. Lambda 関数設計

主要な Lambda 関数の処理フロー。

*   **`GetPresignedUrlFunction`**:
    1.  UIから拡張子情報を受け取る。
    2.  UUIDで一意のファイル名を生成: `images/20260323/{uuid}.jpg`。
    3.  書き込み専用のS3署名付きURLを生成して返す。
*   **`NotifyAlertFunction` (IoT Rule トリガー)**:
    1.  IoT Core からエラーペイロードを受信。
    2.  Systems Manager Parameter Store から LINE Channel Access Token を取得。
    3.  LINE Messaging API を叩き、ユーザーへ警告メッセージを送信。

## 5. 統計集計と外部連携ロジック

### 5.1. 昨日比・トレンド集計
*   **計算タイミング:** 毎日 00:00 (JST) に Lambda (EventBridgeトリガー) が実行。
*   **処理:**
    1.  前日分の `ActivityLogs` から「ウンチ回数」「稼働時間」をカウント。
    2.  `Statistics` テーブルから前々日の値を読み込み、差分（プラスマイナス）を算出。
    3.  当日の `initial_stats` として保存。WebUI はこれを `GET /stats` で取得して表示する。

### 5.2. 天気・気温の取得
*   **外部サービス:** OpenWeatherMap API を使用。
*   **キャッシュ戦略:** 
    *   30分に1回、Lambda が現在の天気と気温を取得し、DynamoDB の `SystemConfig` (または専用の `WeatherCache` テーブル) に保存。
    *   WebUI は Lambda を直接叩かず、DynamoDB からキャッシュされた天気を取得することで、API制限の回避と低レイテンシを実現する。
