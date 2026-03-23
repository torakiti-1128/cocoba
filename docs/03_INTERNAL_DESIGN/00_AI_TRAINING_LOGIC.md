# 03_TRAINING_LOGIC (AI学習パイプライン設計)

## 1. 概要
本プロジェクトでは、「ここちゃん固有の排泄ポーズ」や「特定の床材における排泄物」を極めて高い精度（False Positiveゼロ目標）で検出するため、プレトレーニング済みのYOLOv8をベースとしたファインチューニング（追加学習）を行う。

## 2. データセット構成

### 2.1. クラス定義 (Classes)
`classes: [0: 'dog', 1: 'poop', 2: 'poop_pose']`
*   **dog:** ここちゃんの通常状態。
*   **poop:** 排泄物（形状や色にバリエーションを持たせる）。
*   **poop_pose:** 排泄する直前〜最中の「背中を丸めた特有のポーズ」。これを検知することで、事後ではなく「真っ最中」に処理シーケンスの準備を開始する。

### 2.2. データ収集とアノテーション
*   **収集方法:** 既存のネットワークカメラの録画映像から、フレーム（画像）を切り出す。
*   **アノテーションツール:** `CVAT` または `Roboflow` を使用。
*   **データ拡張 (Data Augmentation):**
    *   **Brightness/Contrast:** 昼夜の採光変化に対応するためランダムに変更。
    *   **Flip:** 左右反転。
    *   **Mosaic/MixUp:** ロバスト性向上のために採用。

## 3. 学習パイプライン (Train)

開発PC（またはクラウドのGPUインスタンス）で実行するプロセス。

### 3.1. モデルアーキテクチャ
*   ベースモデル: `yolov8n.pt` (nano)
*   エッジデバイス (Intel N100) の制約により、これ以上のサイズのモデル（s, m, l）は使用しない。

### 3.2. ハイパーパラメータ
*   Epochs: 100〜300 (Early Stopping監視)
*   Batch Size: 16 (VRAM依存)
*   Image Size: 640x640

## 4. エッジ最適化・量子化パイプライン (Export)

学習が完了した PyTorch モデル (`.pt`) を、N100 上で最速動作するように OpenVINO 形式へ変換し、INT8 量子化を施す。

### 4.1. NNCF (Neural Network Compression Framework) を用いた量子化
FP32（32ビット浮動小数点）の重みを、精度劣化を最小限に抑えつつ INT8（8ビット整数）へ圧縮する。これにより、メモリ帯域幅がボトルネックとなるエッジCPUでのFPSが劇的に向上（2倍〜3倍）する。

```python
# 変換スクリプトの概念
from ultralytics import YOLO

model = YOLO('runs/detect/train/weights/best.pt')
# OpenVINO 形式へのエクスポートと INT8 量子化
model.export(format='openvino', int8=True, data='data.yaml')
```

### 4.2. モデル配布
変換された `best_openvino_model/` は S3 の `models/latest/` パスにアップロードされ、エッジPCは起動時にそれをダウンロードして使用する。
