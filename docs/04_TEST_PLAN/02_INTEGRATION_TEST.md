# 02_INTEGRATION_TEST (結合テスト計画：再定義)

## 1. ネットワーク・プロトコル (MQTT / WebSocket)

### 1.1. QoS 1 達達保証テスト
*   **テスト内容:** MQTTブローカーを一時停止させた状態でエッジPCから `DEPLOYED` イベントを送信。ブローカー再開後に DynamoDB へデータが届いていることを確認。
*   **判定基準:** メッセージの欠落が 0 件であること。

### 1.2. LWT (Last Will and Testament) 
*   **テスト内容:** エッジPCのLANケーブルを物理的に抜去。
*   **判定基準:** 10秒以内に AWS IoT Core が `cocoba/cloud/health` に `OFFLINE` メッセージを流し、WebUI が「接続切断」表示になること。

---

## 2. クラウド・インフラ統合 (AWS Integration)

### 2.1. IoT Core Rule ⇔ DynamoDB 連携
*   **テスト内容:** `awslocal iot publish` で `cocoba/cloud/status` へダミーペイロードを送信。
*   **判定基準:** `SystemConfigTable` の該当 `device_id` レコードが即座に更新されること。

### 2.2. Cognito 認証 ⇔ API Gateway
*   **テスト内容:** 有効な JWT トークンを持たないリクエストを `/config` に送信。
*   **判定基準:** `401 Unauthorized` または `403 Forbidden` が返されること。

---

## 3. エッジ ⇔ ローカル制御統合

### 3.1. ビジュアルサーボ・フィードバックループ
*   **テスト内容:** ロボットを移動させつつ、カメラ映像から得られる現在座標 $(X_r, Y_r)$ の変化量と、送信した速度指令 $v$ の積分値の整合性を確認。
*   **判定基準:** 30秒間の走行で、推測座標と実座標のズレが $10cm$ 以内であること。

### 3.2. おやつシューター連携
*   **テスト内容:** `GUIDING` 状態への遷移に伴う MQTT 発行。
*   **判定基準:** `cocoba/local/shooter/push` メッセージ受信から $500ms$ 以内にステッピングモーターが回転を開始すること。
