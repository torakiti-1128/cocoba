#!/bin/bash
# 【API/クラウド開発用】セットアップ
set -e
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== API/バックエンド (src/functions) セットアップ ===${NC}"

cd src/functions
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "  - 仮想環境 (src/functions/.venv) を作成しました。"
fi

source .venv/bin/activate
pip install --upgrade pip
pip install boto3 awscli-local

echo -e "${GREEN}完了。使いかた: cd src/functions && source .venv/bin/activate${NC}"
