#!/bin/bash
# 【フロントエンド開発用】セットアップスクリプト
set -e
GREEN='\033[0;32m'
NC='\033[0m'
echo -e "${GREEN}=== フロントエンド開発環境のセットアップ ===${NC}"
cd src/frontend
npm install
echo -e "${GREEN}完了。使いかた: npm run dev${NC}"
