# マスターIssueリスト (全120件)

本プロジェクト「Cocoba」の全開発タスクを網羅したIssueリストである。
開発時はこのリストから1つずつ着手し、完了（PRマージ）ごとに消込またはステータス更新を行うこと。

---

## 【フェーズ1: 基盤構築・共通設計】 (Issue 1-10)
1. `docs(rule): Issue管理およびGit Flowの厳密な運用ルール策定`
2. `docs(rule): 実機テストにおける物理安全検証チェックリストの策定`
3. `chore(infrastructure): GitHub Actions (CI) のLinter強制および型チェック設定`
4. `chore(infrastructure): 開発用ダミーデータ(Mock JSON)の生成スクリプト作成`
5. `chore(infrastructure): Docker-composeを用いた LocalStack (S3/DynamoDB) の構築`
6. `chore(infrastructure): Docker-composeを用いた Mosquitto (MQTT) ブローカーの構築`
7. `docs(hardware): ESP32およびモータードライバの最終ピンアサイン確定と配線図作成`
8. `docs(hardware): ロジック用(5V)と動力用(12V)の電源分離回路の設計とBOM作成`
9. `docs(hardware): 物理キルスイッチ（大電流遮断リレー）の組み込み設計`
10. `chore(script): ローカル開発環境の1クリック初期化スクリプト (init_local_aws.sh) の拡充`

---

## 【フェーズ2: AWSインフラ・DB設計】 (Issue 11-20)
11. `feat(infrastructure): AWS SAM テンプレートの初期化とベースリソース定義`
12. `feat(infrastructure): DynamoDB SystemConfig テーブルの定義と初期データ投入`
13. `feat(infrastructure): DynamoDB ActivityLogs テーブルの定義（TTL設定含む）`
14. `feat(infrastructure): DynamoDB Statistics テーブルの定義（日次集計用）`
15. `feat(infrastructure): S3 バケット cocoba-assets の定義とCORS/ライフサイクル設定`
16. `feat(infrastructure): API Gateway の REST API 定義と Cognito Authorizer の紐付け`
17. `feat(infrastructure): Amazon Cognito User Pool および Client の構築（MFA設定含む）`
18. `feat(infrastructure): AWS IoT Core のエンドポイント発行とポリシー定義`
19. `feat(infrastructure): IoT Core Rule: ステータス受信時の DynamoDB SystemConfig 自動更新設定`
20. `feat(infrastructure): IoT Core Rule: 特定アラート受信時の Lambda (LINE通知) トリガー設定`

---

## 【フェーズ3: AI学習パイプライン・推論基礎】 (Issue 21-30)
21. `data(training): 「ここちゃん(犬)」の平常時画像1,000枚の収集とCVATアノテーション`
22. `data(training): 「ここちゃん(犬)」の排泄ポーズ（背中丸まり）の特化データセット作成`
23. `data(training): 多様な形状・色・床材における「排泄物」画像の収集とアノテーション`
24. `feat(training): Ultralytics YOLOv8n を用いたベースモデルの学習スクリプト (train.py) 作成`
25. `feat(training): 昼夜対応のための Data Augmentation (明るさ/反転/MixUp) パラメータチューニング`
26. `test(training): 検知精度評価（Recall 98% / Precision 95% のテストデータ検証）`
27. `feat(training): OpenVINO NNCF を用いた学習済み PyTorch モデルの INT8 量子化スクリプト`
28. `test(training): INT8量子化前後のFPSおよび精度劣化率の比較テスト`
29. `feat(backend): 学習済みモデル (.onnx) の S3 自動アップロードパイプライン構築`
30. `feat(edge): エッジPC起動時の最新モデル自動ダウンロード・適用ロジック`

---

## 【フェーズ4: エッジPC - 視覚アルゴリズム】 (Issue 31-40)
31. `feat(inference): RTSPストリームからのフレーム抽出と10FPSへの間引き（Drop）処理`
32. `feat(inference): 昼夜（照度）変化に伴うカメラの赤外線(IR)モード自動判定ロジック`
33. `feat(inference): OpenCVを用いた ArUco マーカー(ロボット天板) の検出と姿勢(Yaw)推定`
34. `feat(inference): 部屋の4隅の座標を指定する Homography 変換のキャリブレーションツール`
35. `feat(inference): Bounding Box (ピクセル座標) から床面2D物理座標(メートル)への変換ロジック`
36. `feat(inference): 犬(X,Y) と ロボット(X,Y) 間のユークリッド距離計算ロジック`
37. `test(inference): Homography変換後の物理距離誤差の計測テスト（許容誤差5cm以内）`
38. `feat(inference): 直近5秒間の変位に基づく「ACTIVE/SLEEP」状態判定ロジック`
39. `feat(inference): 2秒間連続検知に基づく「POOPING (排泄ポーズ)」確定ロジック`
40. `feat(inference): N100サーマルスロットリング監視と推論間隔の自動調整（熱対策セーフティ）`

---

## 【フェーズ5: エッジPC - 状態管理・通信ロジック】 (Issue 41-50)
41. `feat(logic): Stateパターンを用いた CocobaStateMachine クラスの基盤実装`
42. `feat(logic): 「STANDBY → DETECTED → GUIDING」の正常系遷移ロジック`
43. `feat(logic): 「GUIDING → DEPLOYING → RETURNING」の出動・帰還遷移ロジック`
44. `feat(logic): おやつ誘導15秒経過時のタイムアウト（STANDBYへの復帰）エラーハンドリング`
45. `feat(logic): 犬の1.0m以内接近検知(PROXIMITY_ALERT)による強制停止割り込み処理`
46. `feat(logic): ArUcoマーカー喪失(3秒継続)時のエラー検知と一時停止ロジック`
47. `feat(logic): paho-mqtt を用いたローカルブローカー(ESP32向け)との通信クライアント実装`
48. `feat(logic): ESP32からのHeartbeat(1秒周期)監視と通信途絶時の異常検知ロジック`
49. `feat(logic): 状態変化ごとの S3 へのスナップショット画像アップロード処理 (boto3)`
50. `feat(logic): エッジPC ⇔ AWS IoT Core 間の双方向通信と X.509 証明書認証の実装`

---

## 【フェーズ6: AWSバックエンド (Lambda API)】 (Issue 51-60)
51. `feat(backend): Lambda: S3 書き込み用 Presigned URL (有効期限5分) 発行エンドポイント`
52. `feat(backend): Lambda: LINE Messaging API を用いた飼い主へのプッシュ通知実装`
53. `feat(backend): 通知重複防止ロジック（同一種類の通知は3分間ブロック）の実装`
54. `feat(backend): Lambda: フロントエンド向け GET /logs (ActivityLogs取得・ページネーション) 実装`
55. `feat(backend): Lambda: フロントエンド向け GET /stats (統計データ取得) 実装`
56. `feat(backend): EventBridgeトリガーによる「昨日比・トレンドデータ」の深夜0時バッチ集計処理`
57. `feat(backend): バッチ処理: 期限切れ ActivityLogs (TTL) の S3 アーカイブ保存ロジック`
58. `feat(backend): Lambda: OpenWeatherMap API を用いた天気・気温の取得`
59. `feat(backend): 天気APIのレートリミットを考慮した DynamoDB キャッシュ層の構築`
60. `feat(backend): Lambda: フロントエンド向け POST /config (設定保存とIoT CoreへのMQTT連携) 実装`

---

## 【フェーズ7: ファームウェア - モーター・ハードウェア制御】 (Issue 61-70)
61. `feat(firmware): PlatformIO 環境での ESP32 初期セットアップとWi-Fi/MQTT再接続管理`
62. `feat(firmware): FreeRTOS - 通信タスク(Core 0)と制御タスク(Core 1)のキュー通信実装`
63. `feat(firmware): ハードウェア Watchdog Timer (WDT) の実装（1.5秒通信途絶で強制停止）`
64. `feat(firmware): GPIO割り込みを用いた物理キルスイッチ（非常停止ボタン）の実装`
65. `feat(firmware): 逆運動学 (Inverse Kinematics) による (v, ω) から左右タイヤ速度(vL, vR)への変換`
66. `feat(firmware): 左右DCモーターへの PWM 出力とデッドバンド(不感帯)補正ロジック`
67. `feat(firmware): Pure Pursuitアルゴリズムに基づく目標座標への追従・PID制御ループ`
68. `feat(firmware): シールド投下用サーボモーターの角度制御（HOLD/RELEASE）と待機ロジック`
69. `feat(firmware): おやつシューター（ステッピングモーター）の「指定回転数」駆動ロジック`
70. `test(firmware): メモリリーク調査（String排除、ArduinoJson静的メモリプール使用の検証）`

---

## 【フェーズ8: フロントエンド - 認証と基盤UI】 (Issue 71-80)
71. `feat(frontend): Next.js (App Router) + TailwindCSS のプロジェクト初期化とテーマ設定`
72. `feat(frontend): AWS Amplify (Cognito) を用いたログイン画面と認証セッション管理`
73. `feat(frontend): Zustand を用いたグローバルステート(システム状態、メトリクス等)の定義`
74. `feat(frontend): mqtt.js を用いた AWS IoT Core (WebSocket) への接続と自動再接続処理`
75. `feat(frontend): 受信した StatusPayload の Zod による厳密な実行時型バリデーション`
76. `feat(frontend): 通信切断時の「再接続中」全画面グレーアウト表示 (フェイルセーフUI)`
77. `feat(frontend): 共通レイアウト（ナビゲーションバー、ダックスフントテーマ配色）の実装`
78. `feat(frontend): オプティミスティック更新の禁止と、非同期処理中のローディング状態一元管理`
79. `feat(frontend): 「○分前」フォーマッタと現在時刻表示ユーティリティの実装`
80. `test(frontend): Jest + RTL によるコンポーネント単体テスト環境の構築`

---

## 【フェーズ9: フロントエンド - ダッシュボード・操作画面】 (Issue 81-90)
81. `feat(frontend): Home: ダッシュボードヘッダー（現在時刻、天気APIデータ、オンライン状態）の実装`
82. `feat(frontend): Home: 最新スナップショット表示と緑枠(犬)/青枠(ロボット)のSVGオーバーレイ実装`
83. `feat(frontend): Home: SYNC_IMAGE コマンド発行ボタンと画像更新ローディングUI`
84. `feat(frontend): Home: 犬の状態（活動/睡眠/排泄）とロボット状態のサマリーカード実装`
85. `feat(frontend): Home: メトリクスカード（活動率、ルンバ稼働時間、ウンチ回数の昨日比±表示）`
86. `feat(frontend): Home: Rechartsを用いた「時間別活動率（棒グラフ）」の実装`
87. `feat(frontend): Home: Rechartsを用いた「直近1ヶ月の健康トレンド（エリアグラフ）」の実装`
88. `feat(frontend): Control: 誤操作防止（スワイプ式）の「緊急キルスイッチ」コンポーネント`
89. `feat(frontend): Control: 犬とロボットの距離に基づく「近接警告アラート」バナー表示`
90. `feat(frontend): Control: 各モジュール（シールド、シューター、推論）の個別停止ボタン群`

---

## 【フェーズ10: フロントエンド - ログ・管理・設定画面】 (Issue 91-100)
91. `feat(frontend): Log: ログ一覧の表示とカテゴリ（排泄、安全、保守等）ごとのフィルタリング`
92. `feat(frontend): Log: ログ詳細と画像拡大表示用のモーダルコンポーネント`
93. `feat(frontend): Manage: 各デバイス（ローカル/クラウド）の死活監視インジケータ表示`
94. `feat(frontend): Manage: システム負荷（CPU温度、ネットワークRTT、ディスク）の折れ線グラフ表示`
95. `feat(frontend): Manage: システムメンテナンス（AI更新、リセット、通信テスト）コマンド発行ボタン`
96. `feat(frontend): Settings: システム稼働日・開始/終了時刻の設定UIとPOST処理`
97. `feat(frontend): Settings: 推論信頼度、FPS、ロボット移動速度のスライダー・トグル設定UI`
98. `feat(frontend): Settings: おやつ排出量（回転数）の設定UI`
99. `feat(frontend): Settings: LINE通知の個別ON/OFF設定UI`
100. `feat(frontend): API通信モジュール（fetch/SWRベース）のエラーハンドリングと自動リトライ処理`

---

## 【フェーズ11: システム結合テスト・運用検証】 (Issue 101-110)
101. `test(integration): [HIL] MQTTメッセージを毎秒100件送信時のESP32バッファオーバーフロー耐性テスト`
102. `test(integration): [HIL] QoS 1通信下でのブローカー一時停止時のメッセージ到達保証テスト`
103. `test(integration): エッジPC切断時の IoT Core による LWT (OFFLINE) 発行遅延の計測`
104. `test(integration): API Gateway への無効なJWTトークンを用いた不正アクセス遮断テスト`
105. `test(physical): [FIELD] 異なる床材（フローリング・マット）におけるロボットの直進・旋回精度測定`
106. `test(physical): [FIELD] ドームスタック数最大時における自重落下・ジャム発生の限界テスト`
107. `test(scenario): [FIELD] 正常系：模擬排泄物に対する「検知〜おやつ誘導〜投下〜帰還」の通しテスト`
108. `test(scenario): [FIELD] 異常系：複数排泄物（2箇所同時）存在時の連続シールド投下テスト`
109. `test(scenario): [FIELD] 安全系：移動中のロボットに対して犬（ダミー）が1m/sで接近した際の停止遅延計測`
110. `test(scenario): [FIELD] 安全系：WebUIからのキルスイッチ発行からモーター停止までのエンドツーエンド遅延計測`

---

## 【フェーズ12: 最終調整・パフォーマンス・ドキュメント】 (Issue 111-120)
111. `test(non-functional): [STRESS] 72時間連続稼働時のメモリリークおよびFPS低下の有無検証`
112. `test(non-functional): [THERMAL] 室温35℃環境下でのN100サーマルスロットリング発生・耐熱稼働テスト`
113. `test(frontend): Lighthouseを用いたUIのアクセシビリティおよびパフォーマンス計測・改善`
114. `fix(edge): ネットワーク遅延発生時のロボット移動コマンド自動減速ロジックの実装`
115. `fix(firmware): バッテリー低電圧検知時の自動帰還・緊急停止判定ロジックの実装`
116. `fix(frontend): モバイル端末(iOS/Android)におけるPWAインストール対応とレイアウト崩れ修正`
117. `docs(manual): 飼い主向け：日常運用マニュアルおよびトラブルシューティングガイドの作成`
118. `docs(manual): 飼い主向け：緊急時の物理ボタン操作マニュアルの作成`
119. `chore(release): 本番環境（AWS / Vercel）への初期デプロイ実施`
120. `docs(readme): プロジェクト完了に伴うREADME.mdの最終更新と成果物まとめ`
