# Security Guide

## API Key Management

The TMDB API key is now stored in environment variables for security. The `.env` file is gitignored and should never be committed.

## Removing API Key from Git History

⚠️ **IMPORTANT**: The API key was previously hardcoded in the repository. To remove it from git history, you have two options:

### Option 1: Using git-filter-repo (Recommended)

1. Install git-filter-repo:
   ```bash
   pip install git-filter-repo
   # or
   brew install git-filter-repo  # macOS
   ```

2. Remove the API key from all commits:
   ```bash
   git filter-repo --replace-text <(echo "ba8cd30c0f2c6d86e840e2d9fe95f82c==>REDACTED_API_KEY")
   ```

3. Force push to update remote (⚠️ This rewrites history):
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```

### Option 2: Using BFG Repo-Cleaner

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/

2. Create a replacements file (`replacements.txt`):
   ```
   ba8cd30c0f2c6d86e840e2d9fe95f82c==>REDACTED_API_KEY
   ```

3. Run BFG:
   ```bash
   java -jar bfg.jar --replace-text replacements.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

4. Force push:
   ```bash
   git push origin --force --all
   ```

### Option 3: Using git filter-branch (Built-in, but slower)

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/config/api.js && \
   git add src/config/api.js" \
  --prune-empty --tag-name-filter cat -- --all

# Replace the API key in all files
git filter-branch --force --tree-filter \
  "find . -type f -exec sed -i 's/ba8cd30c0f2c6d86e840e2d9fe95f82c/REDACTED_API_KEY/g' {} \;" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## ⚠️ Warnings

1. **This rewrites git history** - All commit hashes will change
2. **Coordinate with your team** - Everyone needs to re-clone the repository
3. **Update remote branches** - All branches need to be force-pushed
4. **Consider rotating the API key** - Even after removing from history, the exposed key should be rotated

## Rotating the API Key

After removing from git history, you should:

1. Go to https://www.themoviedb.org/settings/api
2. Revoke/delete the old API key
3. Generate a new API key
4. Update your `.env` file with the new key

## Best Practices

- ✅ Never commit API keys or secrets
- ✅ Use environment variables
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `.env.example` as a template
- ✅ Rotate keys if they're accidentally exposed
- ✅ Use different keys for development and production

