#!/bin/bash

# cocoba プロジェクト セットアップスクリプト
# 実行環境: Linux / macOS

set -e

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== cocoba プロジェクトのセットアップを開始します ===${NC}"

# 1. 必須ツールのチェック
echo -e "\n${YELLOW}[1/5] 依存ツールの確認中...${NC}"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}エラー: $1 がインストールされていません。$2 を参照してインストールしてください。${NC}"
        return 1
    else
        echo -e "  - $1: OK"
        return 0
    fi
}

check_command "node" "Node.js (v20+)"
check_command "npm" "npm"
check_command "python3" "Python (3.11+)"
check_command "docker" "Docker"
check_command "sam" "AWS SAM CLI"

# 2. ディレクトリの作成
echo -e "\n${YELLOW}[2/5] 必要なディレクトリの作成中...${NC}"
mkdir -p data/raw data/processed models/yolo models/onnx
echo "  - data/, models/ ディレクトリを作成しました。"

# 3. フロントエンドのセットアップ
echo -e "\n${YELLOW}[3/5] フロントエンドの依存関係をインストール中...${NC}"
if [ -d "src/frontend" ]; then
    cd src/frontend
    npm install
    cd ../..
    echo "  - フロントエンド: 完了"
else
    echo -e "${RED}  - 警告: src/frontend が見つかりません。${NC}"
fi

# 4. Python 仮想環境と依存関係のセットアップ
echo -e "\n${YELLOW}[4/5] Python 仮想環境の構築中...${NC}"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "  - 仮想環境 (.venv) を作成しました。"
fi

source .venv/bin/activate
pip install --upgrade pip
# プロジェクト全体の共通ライブラリがあればここでインストール
# pip install -r requirements.txt (将来用)

# エッジ側の依存関係
if [ -f "src/edge/requirements.txt" ]; then
    pip install -r src/edge/requirements.txt
fi
echo "  - Python 仮想環境: 完了"

# 5. PlatformIO (ファームウェア用) の確認
echo -e "\n${YELLOW}[5/5] PlatformIO の確認中...${NC}"
if ! command -v pio &> /dev/null; then
    echo -e "  - PlatformIO Core を仮想環境内にインストールします..."
    pip install platformio
else
    echo "  - PlatformIO: OK"
fi

echo -e "\n${GREEN}=== セットアップが完了しました！ ===${NC}"
echo -e "開発を始めるには以下のコマンドを実行してください："
echo -e "  source .venv/bin/activate"
echo -e "  cd src/frontend && npm run dev"
