#!/bin/bash
# Script to remove API key from git history
# WARNING: This rewrites git history. Coordinate with your team before running.

set -e

API_KEY="ba8cd30c0f2c6d86e840e2d9fe95f82c"
REPLACEMENT="REDACTED_API_KEY"

echo "⚠️  WARNING: This script will rewrite git history!"
echo "All commit hashes will change."
echo "Make sure you coordinate with your team before proceeding."
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Removing API key from git history..."

# Check if git-filter-repo is available (multiple ways)
GIT_FILTER_REPO_CMD=""
if command -v git-filter-repo &> /dev/null; then
    GIT_FILTER_REPO_CMD="git-filter-repo"
elif python3 -m git_filter_repo --version &> /dev/null; then
    GIT_FILTER_REPO_CMD="python3 -m git_filter_repo"
elif [ -f ~/.local/bin/git-filter-repo ]; then
    GIT_FILTER_REPO_CMD="$HOME/.local/bin/git-filter-repo"
fi

if [ -n "$GIT_FILTER_REPO_CMD" ]; then
    echo "Using git-filter-repo (recommended)..."
    # Create a temporary file with the replacement text
    REPLACE_FILE=$(mktemp)
    echo "${API_KEY}==>${REPLACEMENT}" > "$REPLACE_FILE"
    $GIT_FILTER_REPO_CMD --replace-text "$REPLACE_FILE"
    rm -f "$REPLACE_FILE"
else
    echo "git-filter-repo not found."
    echo ""
    echo "Option 1: Install git-filter-repo (recommended)"
    echo "  pip install git-filter-repo"
    echo "  or"
    echo "  brew install git-filter-repo"
    echo ""
    echo "Option 2: Use built-in git filter-branch (slower, but works)"
    read -p "Do you want to use git filter-branch instead? (yes/no): " use_filter_branch
    
    if [ "$use_filter_branch" != "yes" ]; then
        echo "Aborted. Please install git-filter-repo or see docs/SECURITY.md for alternatives."
        exit 1
    fi
    
    echo ""
    echo "Using git filter-branch (this may take a while)..."
    echo "⚠️  This is a slower method but uses built-in git commands."
    
    # Use git filter-branch to replace the API key in all files
    git filter-branch --force --tree-filter \
        "find . -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './android/*' -not -path './ios/*' -exec sed -i 's|${API_KEY}|${REPLACEMENT}|g' {} + 2>/dev/null || true" \
        --prune-empty --tag-name-filter cat -- --all
    
    # Clean up backup refs
    git for-each-ref --format="delete %(refname)" refs/original 2>/dev/null | git update-ref --stdin 2>/dev/null || true
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
fi

echo ""
echo "✅ API key removed from history."
echo ""
echo "Next steps:"
echo "1. Force push to update remote:"
echo "   git push origin --force --all"
echo "   git push origin --force --tags"
echo ""
echo "2. Coordinate with your team - everyone needs to re-clone"
echo ""
echo "3. Rotate the API key at https://www.themoviedb.org/settings/api"

