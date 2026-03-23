#!/bin/bash
# LocalStack（ローカルAWS）の初期化スクリプト
set -e

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== LocalStack (S3/DynamoDB) の初期化中... ===${NC}"

# AWS CLI Local (awslocal) が必要です
if ! command -v awslocal &> /dev/null; then
    echo "awslocal が見つかりません。pip install awscli-local を実行してください。"
    exit 1
fi

# S3 バケットの作成
echo "1. S3 バケット 'cocoba-assets-local' を作成します..."
awslocal s3 mb s3://cocoba-assets-local

# DynamoDB テーブルの作成
echo "2. DynamoDB テーブル 'cocoba-data-local' を作成します..."
awslocal dynamodb create-table \
    --table-name cocoba-data-local \
    --key-schema AttributeName=id,KeyType=HASH \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

echo -e "\n${GREEN}初期化完了しました。${NC}"
