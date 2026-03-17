#!/bin/bash

# ==============================================================================
# Cocoba Issue自動起票＆ブランチ作成スクリプト
# 実行要件: GitHub CLI (gh) がインストールされ、ログイン済であること
# 使用法: bash scripts/github/create_issue.sh docs/06_ISSUES/xxx.md
# ==============================================================================

if [ -z "$1" ]; then
  echo "エラー: IssueのMarkdownファイルパスを指定してください。"
  echo "使用法: bash $0 docs/06_ISSUES/xxx.md"
  exit 1
fi

FILE_PATH=$1

if [ ! -f "$FILE_PATH" ]; then
  echo "エラー: ファイルが見つかりません -> $FILE_PATH"
  exit 1
fi

# 1行目からタイトルを抽出（"# タイトル: " の部分を削る）
ISSUE_TITLE=$(head -n 1 "$FILE_PATH" | sed 's/^# タイトル: //')
# 2行目以降を本文として抽出
ISSUE_BODY=$(tail -n +2 "$FILE_PATH")

if [ -z "$ISSUE_TITLE" ] || [[ "$ISSUE_TITLE" == "# "* ]]; then
  echo "エラー: ファイルの1行目は '# タイトル: プレフィックス(スコープ): 内容' の形式である必要があります。"
  exit 1
fi

echo "以下の内容でGitHubにIssueを作成します..."
echo "タイトル: $ISSUE_TITLE"
echo "----------------------------------------"

# GitHub CLI でIssueを作成し、URLを取得
ISSUE_URL=$(gh issue create --title "$ISSUE_TITLE" --body "$ISSUE_BODY")

if [ $? -ne 0 ]; then
  echo "Issueの作成に失敗しました。gh CLIのログイン状態 (gh auth login) を確認してください。"
  exit 1
fi

# URLの末尾からIssue番号を抽出 (例: https://github.com/user/repo/issues/12 -> 12)
ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')

echo "Issueの作成に成功しました！"
echo "URL: $ISSUE_URL"
echo "Issue番号: #$ISSUE_NUMBER"
echo "----------------------------------------"

# タイトルからプレフィックスとスコープを抽出 (正規表現)
# 例: "feat(inference): YOLO推論の実装" -> PREFIX="feat", SCOPE="inference"
if [[ "$ISSUE_TITLE" =~ ^([a-zA-Z]+)\(([a-zA-Z_-]+)\):\ (.*)$ ]]; then
  PREFIX="${BASH_REMATCH[1]}"
  SCOPE="${BASH_REMATCH[2]}"
  
  echo "続いて、作業ブランチとファイルのリネームを行います。"
  echo "タスクの内容を表す「小文字のケバブケース（ハイフン区切り）」を入力してください。"
  echo "（例: yolo-setup, motor-torque-fix）"
  read -p "> " TASK_NAME

  if [ -n "$TASK_NAME" ]; then
    # ブランチ名の生成と移動 (例: feat/inference/12-yolo-setup)
    BRANCH_NAME="${PREFIX}/${SCOPE}/${ISSUE_NUMBER}-${TASK_NAME}"
    
    # Markdownファイルのリネーム (例: docs/06_ISSUES/12-yolo-setup.md)
    DIR_NAME=$(dirname "$FILE_PATH")
    NEW_FILE="${DIR_NAME}/${ISSUE_NUMBER}-${TASK_NAME}.md"
    
    mv "$FILE_PATH" "$NEW_FILE"
    echo "ファイルをリネームしました: $NEW_FILE"
    
    git checkout -b "$BRANCH_NAME"
    echo "ブランチを作成し、移動しました: $BRANCH_NAME"
    echo "----------------------------------------"
  else
    echo "タスク名が入力されなかったため、ブランチ作成とリネームをスキップしました。"
  fi
else
  echo "タイトルのフォーマットが 'プレフィックス(スコープ): 内容' に完全一致しませんでした。"
  echo "自動ブランチ作成をスキップします。手動でブランチを作成してください。"
fi