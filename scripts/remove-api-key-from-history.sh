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

# Check if git-filter-repo is available
if command -v git-filter-repo &> /dev/null; then
    echo "Using git-filter-repo..."
    git filter-repo --replace-text <(echo "${API_KEY}==>${REPLACEMENT}")
elif command -v java &> /dev/null; then
    echo "git-filter-repo not found. Please install it for best results:"
    echo "  pip install git-filter-repo"
    echo "  or"
    echo "  brew install git-filter-repo"
    echo ""
    echo "Alternatively, see docs/SECURITY.md for manual instructions."
    exit 1
else
    echo "Please install git-filter-repo or see docs/SECURITY.md for alternatives."
    exit 1
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

