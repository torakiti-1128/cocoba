# 02_WEB_FRONTEND (Webフロントエンド設計)

## 1. 概要
飼い主が外出先から確認・操作するための Web アプリケーションの実装詳細を定義する。
Vercel上にホストされ、Next.js 14 (App Router) と React を用いて構築する。

## 2. アーキテクチャ

### 2.1. 状態管理 (Zustand)
Reactコンポーネント間で共有すべき以下のグローバルステートは、軽量な `Zustand` を用いて一元管理する。
*   **`useSystemStore`:**
    *   `systemState`: 現在のロボットのステータス (STANDBY, DEPLOYING等)
    *   `lastImage`: 最新のスナップショットURL
    *   `lastUpdated`: 最新画像取得時刻
    *   `connection`: AWS IoT Core との接続状態 (ONLINE / OFFLINE)

### 2.2. リアルタイム通信 (MQTT over WebSocket)
*   **ライブラリ:** `mqtt` (npmパッケージ) を使用。
*   **接続:** AWS IoT Core のエンドポイントに対し、Cognito から取得した一時的な AWS 認証情報（STS）を用いて署名付きWebSocket URLを生成し接続する。
*   **処理:** 
    *   アプリ起動時 (`useEffect`) に接続を確立。
    *   `cocoba/cloud/status` を Subscribe し、受信するたびに Zustand のストアを更新。これにより、UIがリアクティブに最新状態へ書き換わる。

## 3. コンポーネント設計 (Component Tree)

UI/UX設計（01_UI_UX.md）に基づき、以下の階層でコンポーネントを分割する。

*   `app/page.tsx` (ホーム画面)
    *   `DashboardHeader`: 現在時刻、天気、気温、オンライン状態を表示。
    *   `SnapshotViewer`: 
        *   `LiveSnapshot`: 緑枠（犬）と青枠（ロボット）が重畳された最新画像を表示。
        *   `UpdateImageButton`: クリックで `SYNC_IMAGE` コマンドを発行。
        *   `TimestampDisplay`: 右上に `lastUpdated` を表示。
    *   `StatusSummaryCard`: 犬の状態（活動/睡眠）、室温、ロボット状態（待機/稼働/緊急停止/Responseなし）。
    *   `MetricGrid`: 
        *   `ActivityMetricCard`: 本日の活動率と昨日比（±%）。
        *   `RobotMetricCard`: ルンバ稼働時間と昨日比。
        *   `PoopMetricCard`: ウンチ回数と昨日比。
    *   `ChartSection`: 活動率推移、稼働時間推移、1ヶ月トレンド。
*   `app/control/page.tsx` (操作画面)
    *   `EmergencyKillSwitch`: 最重要コンポーネント。赤色の大きなスワイプUI。
    *   `IndividualControlPanel`: 各機能（AI、カメラ等）の個別停止ボタン。

## 4. 通信の堅牢性 (フェイルセーフUI)

*   **オフライン時の保護:**
    *   WebSocketの `close` または `offline` イベントを検知した場合、Zustandの `connection` ステートを OFFLINE に変更。
    *   UI層でこれを受け取り、`EmergencyKillSwitch` 以外のすべての操作ボタンを `disabled` にし、画面全体に「再接続中...」のオーバーレイを表示する。
*   **オプティミスティック更新の禁止:**
    *   例えば「設定保存」ボタンを押した際、ローカルのUIを先に書き換えることはしない。必ずREST APIの `200 OK` を待ってから、またはMQTT経由で更新イベントが返ってきてから、UIのトグルスイッチや値を変更する。

## 5. 認証 (Authentication)
*   **Amazon Cognito:** 飼い主と開発者（私）のみがアクセスできるよう、Cognito User Pools によるログイン画面を実装。
*   **MFA:** シニア犬の安全を守るため、多要素認証の有効化を推奨。
