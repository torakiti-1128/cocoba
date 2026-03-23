# 02_STATE_MACHINE (ステートマシン内部設計)

## 1. 概要
本ドキュメントは、エッジPC（Python）上で稼働する Cocoba システムの「核」となるステートマシンの実装詳細を定義する。
システムの信頼性を担保するため、状態遷移は一元管理され、全ての物理操作はステートマシンの許可を得て実行される。

---

## 2. 実装アーキテクチャ

### 2.1. クラス構造
ステートマシンは、デザインパターンの **Stateパターン** または **遷移テーブル形式** を採用し、拡張性と保守性を確保する。

*   **`CocobaStateMachine` クラス:**
    *   現在の状態 (`current_state`) の保持。
    *   イベント（検知、タイムアウト、エラー）の受信と遷移判定。
    *   MQTTクライアント、AI推論、クラウド連携クラスへの参照。

### 2.2. 非同期イベント処理
`asyncio` を使用し、以下のイベントをノンブロッキングで待機・処理する。
1.  **AI推論ループ:** フレームごとの検知結果（犬の座標、排泄物検知）。
2.  **MQTTサブスクライバ:** WebUIからの「緊急停止」や「強制帰還」。
3.  **タイマーイベント:** 誘導タイムアウトなどの時間監視。

---

## 3. 状態定義と遷移ロジック

### 3.1. 状態一覧 (Enum)
```python
class State(Enum):
    STANDBY   = "STANDBY"   # 待機・監視
    DETECTED  = "DETECTED"  # 排泄検知・座標確定
    GUIDING   = "GUIDING"   # おやつ誘導・退避待ち
    DEPLOYING = "DEPLOYING" # ロボット出動・シールド投下
    RETURNING = "RETURNING" # ロボット帰還
    EMERGENCY = "EMERGENCY" # 緊急停止・手動介入待ち
```

### 3.2. 遷移テーブル (要約)
| 現在の状態 | イベント | 次の状態 | 実行されるアクション |
| :--- | :--- | :--- | :--- |
| `STANDBY` | 排泄物を検知 | `DETECTED` | 座標保存、画像保存、クラウド通知 |
| `DETECTED` | 自動遷移 | `GUIDING` | おやつ排出命令 (MQTT) 送信 |
| `GUIDING` | 犬が離脱成功 | `DEPLOYING` | ロボット出動命令 送信 |
| `GUIDING` | 15秒経過(E1) | `STANDBY` | 誘導失敗ログ、待機へ |
| `DEPLOYING` | 投下完了 | `RETURNING` | 帰還命令 送信、プッシュ通知 |
| `DEPLOYING` | 犬が接近(E2) | `EMERGENCY` | ロボット即時停止、アラート |
| `*` (任意) | キルスイッチ | `EMERGENCY` | 全出力停止、システムロック |

---

## 4. 物理デバイスとの連携

### 4.1. MQTT命令発行 (Action Dispatcher)
状態が遷移した際、`on_enter_state` メソッドにより各デバイスへ MQTT メッセージを Publish する。

*   **`on_enter_GUIDING`:** `cocoba/local/shooter/push` へ `{"rotations": 1}` を送信。
*   **`on_enter_DEPLOYING`:** `cocoba/local/robot/move` へ目標座標を送信。
*   **`on_enter_EMERGENCY`:** `cocoba/local/robot/action` へ `"STOP_ALL"` を送信。

### 4.2. ハートビート監視
ステートマシンは 1秒周期で `cocoba/local/heartbeat` を監視する。
ロボットまたはシューターからの応答が 3秒以上途絶えた場合、自律的に `EMERGENCY` 状態へ遷移し、安全を確保する。

---

## 5. エラーハンドリングとリカバリ

### 5.1. 近接検知 (E2: Proximity Alert)
AI推論クラスから `dog_distance < 1.0m` のイベントを受信した場合、ステートマシンは現在の処理を中断し、以下の処理を行う：
1.  ロボットへの停止命令送信。
2.  クラウドへの「接近警告」ログ送信。
3.  安全距離（> 1.5m）が確保されるまで待機、またはタイムアウトで `EMERGENCY` 遷移。

### 5.2. マーカー喪失 (E3: Marker Lost)
ロボット出動中に ArUco マーカーを 3秒以上見失った場合：
1.  ロボットをその場で停止。
2.  `RETURNING` への再試行または手動介入を促す通知。

---

## 6. クラウド同期 (Cloud Mirroring)

ステートマシンが状態を変化させるたびに、`cocoba/cloud/status` トピックへ最新の `system_state` を送信し、WebUIとの同期を維持する。
これにより、ユーザーは「今どのフェーズ（誘導中、出動中など）」なのかをリアルタイムに把握できる。
