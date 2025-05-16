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
test_commit "ci: SEC-333 update CI pipeline"
test_commit "style: SEC-444 update code style"
test_commit "test: SEC-555 add new tests"
test_commit "refactor: SEC-666 refactor code"
test_commit "SEC-123 fix critical bug"

# Invalid cases
echo -e "\nTesting invalid commit types:"
test_commit "build: SEC-123 build process update"
test_commit "feat: SEC-123 add new feature"
test_commit "fix: SEC-123 fix bug"
test_commit "update: SEC-123 update something"
test_commit "perf: SEC-123 improve performance"
test_commit "revert: SEC-123 revert changes"

echo -e "\nTesting missing task name:"
test_commit "docs: API interface has"
test_commit "docs(surface): API interface has"
test_commit "chore: update dependencies"
test_commit "style: update code style"

echo -e "\nTesting invalid task name format:"
test_commit "docs: SEC123 API interface has"
test_commit "docs: SEC_123 API interface has"
test_commit "docs: sec-123 API interface has"
test_commit "docs: SEC- API interface has"

echo -e "\nTesting invalid release format:"
test_commit "release-SEC-123 prepare release"
test_commit "release/SEC123 prepare release"
test_commit "release/SEC_123 prepare release"
test_commit "release/SEC-123 prepare release"

# Cleanup
rm test.txt 