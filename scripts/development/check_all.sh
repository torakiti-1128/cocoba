#!/bin/bash

# cocoba プロジェクト 全体チェックスクリプト
# CI/CDの実行前にローカルで動作を確認するためのものです。

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== 全体チェックを開始します ===${NC}"

# 1. フロントエンドのチェック
echo -e "\n${YELLOW}[1/4] フロントエンド (Next.js) チェック中...${NC}"
if [ -d "src/frontend" ]; then
    cd src/frontend
    npm run lint
    npm run build
    cd ../..
    echo -e "  - フロントエンド: OK"
fi

# 2. インフラ (AWS SAM) のチェック
echo -e "\n${YELLOW}[2/4] インフラ (AWS SAM) チェック中...${NC}"
if [ -d "infrastructure/aws" ]; then
    cd infrastructure/aws
    sam validate
    cd ../..
    echo -e "  - インフラ: OK"
fi

# 3. エッジ (Python) のチェック
echo -e "\n${YELLOW}[3/4] エッジ (Python/Flake8) チェック中...${NC}"
if command -v flake8 &> /dev/null; then
    flake8 src/edge --count --select=E9,F63,F7,F82 --show-source --statistics
    echo -e "  - エッジ: OK"
else
    echo -e "  - 警告: flake8 が見つかりません。エッジのチェックをスキップします。"
fi

# 4. ファームウェア (PlatformIO) のチェック
echo -e "\n${YELLOW}[4/4] ファームウェア (PlatformIO) チェック中...${NC}"
if [ -d "src/firmware" ] && [ -f "src/firmware/platformio.ini" ]; then
    cd src/firmware
    pio run
    cd ../..
    echo -e "  - ファームウェア: OK"
else
    echo -e "  - 警告: ファームウェア環境が未構築のためスキップします。"
fi

echo -e "\n${GREEN}=== 全てのチェックがパスしました！ ===${NC}"
