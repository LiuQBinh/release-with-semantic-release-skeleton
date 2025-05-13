# 🚀 Semantic Release Skeleton

A skeleton for implementing semantic versioning-based release management using [Semantic Release](https://github.com/semantic-release/semantic-release) and GitHub Actions.

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Conventional Commits](#-conventional-commits)
- [Release Process](#-release-process)
- [Branch Strategy](#-branch-strategy)

## 📋 Overview

This project implements an automated release workflow that:
- Automatically determines the next version based on commit messages
- Creates GitHub releases
- Generates and updates changelog
- Ensures consistent versioning across your project

## ✨ Features

- **Automated Versioning**: Version numbers are automatically determined based on commit messages
- **Changelog Generation**: Automatic changelog updates with each release
- **GitHub Integration**: Seamless integration with GitHub Actions
- **Conventional Commits**: Enforces commit message conventions for better versioning

## 📝 Conventional Commits

The project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Here are the supported commit types:

| Type       | Description               | Version Impact |
|------------|---------------------------|----------------|
| `feat`     | New feature               | Minor (1.x.0)  |
| `fix`      | Bug fix                   | Patch (1.0.x)  |
| `docs`     | Documentation changes     | None           |
| `style`    | Code style changes        | None           |
| `refactor` | Code refactoring          | None           |
| `perf`     | Performance improvements  | None           |
| `test`     | Adding or modifying tests | None           |
| `chore`    | Maintenance tasks         | None           |
| `ci`       | CI configuration changes  | None           |

### Breaking Changes
To indicate a breaking change, add `BREAKING CHANGE:` in the commit body - Major (x.0.0):
```bash
git commit -m "feat: add new API" -m "BREAKING CHANGE: API interface has changed"
```

## 🔄 Release Process

### Development Workflow

1. **Write Conventional Commit Messages**
   ```bash
   # Feature commits (minor version)
   git commit -m "feat: SEC-123 add new feature"
   
   # Bug fix commits (patch version)
   git commit -m "fix: SEC-123 resolve login bug"
   
   # Breaking changes (major version)
   git commit -m "feat: SEC-123 implement new API" -m "BREAKING CHANGE: API interface has changed"
   
   # Other commit types
   git commit -m "chore: SEC-123 update dependencies"
   git commit -m "docs: SEC-123 update README"
   git commit -m "test: SEC-123 add unit tests"
   ```

2. **Push Changes**
   ```bash
   git push origin <branch-name>
   ```

## 🌿 Branch Strategy

### Branch Types
- `main`: Production branch, triggers releases
- `release/SEC-*`: Release branches for feature development
- `release/SEC-*-child`: Child branches for specific tasks

### Release Process
1. Develop features in `release/SEC-*-child` branches
2. Merge child branches into parent `release/SEC-*` branch
3. Merge release branch into `main`
4. GitHub Actions automatically triggers the release process

### Local Squash Merging
You can perform squash merges locally using the following commands:

```bash
# Squash merge child branch into parent release branch
git checkout release/SEC-123
git merge --squash release/SEC-123-child
git commit -m "feat: implement feature from SEC-123-child"

# Squash merge release branch into main
git checkout main
git merge --squash release/SEC-123
git commit -m "feat: implement SEC-123 features"
```

The `--squash` option combines all changes from the source branch into a single commit on the target branch, giving you more control over the commit history.
