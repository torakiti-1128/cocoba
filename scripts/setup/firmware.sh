#!/bin/bash
# 【組み込み/ESP32開発用】セットアップ
set -e
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== 組み込み (src/firmware) セットアップ ===${NC}"

cd src/firmware
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "  - 仮想環境 (src/firmware/.venv) を作成しました。"
fi

source .venv/bin/activate
pip install --upgrade pip
pip install platformio

echo -e "${GREEN}完了。使いかた: cd src/firmware && source .venv/bin/activate${NC}"
