#!/bin/bash
# 【学習パイプライン開発用】セットアップ
set -e
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== 学習パイプライン (src/training) セットアップ ===${NC}"

cd src/training
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "  - 仮想環境 (src/training/.venv) を作成しました。"
fi

source .venv/bin/activate
pip install --upgrade pip
pip install ultralytics opencv-python matplotlib
if [ -f "requirements.txt" ]; then pip install -r requirements.txt; fi

echo -e "${GREEN}完了。使いかた: cd src/training && source .venv/bin/activate${NC}"
