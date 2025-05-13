# 🚀 Semantic Release Skeleton

A skeleton for implementing semantic versioning-based release management.

## 📋 Overview

Automated release workflow using [Semantic Release](https://github.com/semantic-release/semantic-release) and GitHub Actions.

## ⚙️ GitHub Actions Workflows
   **🚀 release**: Creates release on main branch push
   - Automatically determines next version based on commit messages
   - Creates GitHub release
   - Updates changelog

## 📝 Release Process

### Steps to development
1. 📝 Write conventional commit messages:
   ```bash
    git commit -m "feat: add new feature" # minior
    git commit -m "fix: resolve bug in login" # patch
    git commit --amend -m "feat: thêm tính năng lọc" -m "BREAKING CHANGE: API hiện tại đã thay đổi" # major


    git commit -m "chore: update dependencies"
    git commit -m "ci: configure GitHub Actions workflow"
    git commit -m "docs: update README with new features"
    git commit -m "style: format code according to guidelines"
    git commit -m "refactor: restructure authentication module"
    git commit -m "perf: optimize database queries"
    git commit -m "test: add unit tests for user service"
   ```
   - Use conventional commit types (feat, fix, docs, etc.)
   - Add descriptive message

2. 💾 Commit and push your changes
   - Required for PR approval
   - <span style="color: red">`verify-commit-messages` will block merge if format is incorrect</span>
   
   Example commit messages:
   ```
   feat: add user authentication
   fix: resolve login timeout issue
   docs: update API documentation
   ```

### Steps to release
1. 🔄 Create PR → `verify-commit-messages` checks commit format
2. 📤 Merge to main → `release` automatically:
   - Determines next version based on commit types
   - Creates GitHub release
   - Updates changelog
   - Tags the release
