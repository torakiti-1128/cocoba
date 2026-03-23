#!/bin/bash
# cocoba プロジェクト 全括セットアップ
set -e
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== cocoba プロジェクト 全括セットアップを開始します ===${NC}"

# 各個別セットアップを実行
./scripts/setup/training.sh
./scripts/setup/backend.sh
./scripts/setup/edge.sh
./scripts/setup/firmware.sh
./scripts/setup/frontend.sh

echo -e "\n${GREEN}=== 全てのセットアップが完了しました！ ===${NC}"
