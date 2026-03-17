#!/bin/bash
# ==============================================================================
# 全モジュール静的解析・テスト一括実行スクリプト
# 実行: bash scripts/development/check_all.sh
# ==============================================================================

echo "🔍 [1/4] Inference (Python) の静的解析を実行..."
ruff check src/inference/ || exit 1
mypy --strict src/inference/ || exit 1

echo "🔍 [2/4] Backend (Python/FastAPI) の静的解析を実行..."
ruff check src/backend/ || exit 1
mypy --strict src/backend/ || exit 1

echo "🔍 [3/4] Frontend (Next.js) の型チェックとLintを実行..."
npm run lint --prefix src/frontend/ || exit 1
npm run tsc --prefix src/frontend/ || exit 1

echo "🔍 [4/4] Firmware (C++) のビルドチェックを実行..."
pio run -d src/firmware/ || exit 1

echo "すべてのモジュール（4/4）の静的解析・ビルドチェックを通過しました。"