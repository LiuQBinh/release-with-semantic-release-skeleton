#!/bin/bash

echo "Testing commit message validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create a test file
echo "test" > test.txt

test_commit() {
    echo -e "\nTesting: $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    git add test.txt
    git commit -m "$1" 2>&1
    git reset HEAD~1 2>/dev/null
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Valid cases
echo "Testing valid commit messages:"
test_commit "docs: SEC-123 API interface has"
test_commit "docs(surface): SEC-123 API interface has"
test_commit "chore: SEC-101 update dependencies"
test_commit "build: SEC-222 build process update"
test_commit "ci: SEC-333 update CI pipeline"
test_commit "style: SEC-444 update code style"
test_commit "test: SEC-555 add new tests"
test_commit "refactor: SEC-666 refactor code"
test_commit "revert: SEC-777 revert previous commit"

# Invalid cases
echo -e "\nTesting invalid commit types:"
test_commit "doc: SEC-123 API interface has"
test_commit "feature: SEC-123 add new feature"
test_commit "bugfix: SEC-123 fix bug"
test_commit "update: SEC-123 update something"
test_commit "fix(auth): SEC-789 resolve login issue"
test_commit "feat(lang): SEC-456 add Polish language"

echo -e "\nTesting missing task name:"
test_commit "docs: API interface has"
test_commit "docs(surface): API interface has"
test_commit "chore: update dependencies"
test_commit "build: build process update"

echo -e "\nTesting invalid task name format:"
test_commit "docs: SEC123 API interface has"
test_commit "docs: SEC_123 API interface has"
test_commit "docs: sec-123 API interface has"
test_commit "docs: SEC- API interface has"

echo -e "\nTesting task number without type:"
test_commit "SEC-123 fix critical bug"
test_commit "SEC-456 update documentation"
test_commit "SEC-789 resolve login issue"

echo -e "\nTesting disabled commit type:"
test_commit "hotfix: SEC-123 fix critical bug"

# Cleanup
rm test.txt 