#!/bin/bash
# 【エッジPCロジック開発用】セットアップ
set -e
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== エッジPC (src/edge) セットアップ ===${NC}"

cd src/edge
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "  - 仮想環境 (src/edge/.venv) を作成しました。"
fi

source .venv/bin/activate
pip install --upgrade pip
pip install paho-mqtt opencv-python ultralytics requests
if [ -f "requirements.txt" ]; then pip install -r requirements.txt; fi

echo -e "${GREEN}完了。使いかた: cd src/edge && source .venv/bin/activate${NC}"
