#!/bin/bash

echo "Testing commit message validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Initialize counters
valid_ok=0
valid_ng=0
invalid_ok=0
invalid_ng=0

test_commit() {
    local is_valid=$2
    echo -e "\nTesting: $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create test file for this test
    echo "test" > test.txt
    
    # Stage and commit
    git add test.txt
    if git commit -m "$1" 2>&1; then
        if [ "$is_valid" = "valid" ]; then
            valid_ok=$((valid_ok + 1))
        else
            invalid_ok=$((invalid_ok + 1))
        fi
    else
        if [ "$is_valid" = "valid" ]; then
            valid_ng=$((valid_ng + 1))
        else
            invalid_ng=$((invalid_ng + 1))
        fi
    fi
    
    # Reset only the commit, keep the working directory
    git reset HEAD~1 2>/dev/null
    rm -f test.txt
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Valid cases
echo "Testing valid commit messages:"
test_commit "docs: SEC-123 API interface has" "valid"
test_commit "docs(surface): SEC-123 API interface has" "valid"
test_commit "style: SEC-444 update code style" "valid"
test_commit "refactor: SEC-666 refactor code" "valid"
test_commit "test: SEC-555 add new tests" "valid"
test_commit "chore: SEC-101 update dependencies" "valid"
test_commit "ci: SEC-333 update CI pipeline" "valid"
test_commit "SEC-123 fix critical bug" "valid"

# Invalid cases
echo -e "\nTesting invalid commit types:"
test_commit "build: SEC-123 build process update" "invalid"
test_commit "feat: SEC-123 add new feature" "invalid"
test_commit "fix: SEC-123 fix bug" "invalid"
test_commit "update: SEC-123 update something" "invalid"
test_commit "perf: SEC-123 improve performance" "invalid"
test_commit "revert: SEC-123 revert changes" "invalid"

echo -e "\nTesting missing task name:"
test_commit "docs: API interface has" "invalid"
test_commit "docs(surface): API interface has" "invalid"
test_commit "chore: update dependencies" "invalid"
test_commit "style: update code style" "invalid"

echo -e "\nTesting invalid task name format:"
test_commit "docs: SEC123 API interface has" "invalid"
test_commit "docs: SEC_123 API interface has" "invalid"
test_commit "docs: sec-123 API interface has" "invalid"
test_commit "docs: SEC- API interface has" "invalid"

echo -e "\nTesting invalid release format:"
test_commit "release-SEC-123 prepare release" "invalid"
test_commit "release/SEC123 prepare release" "invalid"
test_commit "release/SEC_123 prepare release" "invalid"
test_commit "release/SEC-123 prepare release" "invalid"

# Print summary
echo -e "\nTest Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "valid cases"
echo "OK: $valid_ok/8 cases"
echo "NG: $valid_ng/8 cases"
echo
echo "invalid cases"
echo "OK: $invalid_ng/18 cases"
echo "NG: $invalid_ok/18 cases" 