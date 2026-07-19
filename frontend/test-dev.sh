#!/bin/bash

# EAP Frontend Test Development Helper
# This script helps with test development by providing common commands

set -e

COMMAND="${1:-help}"

case "$COMMAND" in
  "list")
    echo "Available test files:"
    echo "====================="
    find tests -name "*.spec.ts" | sort | sed 's/^/  /'
    echo
    echo "Total: $(find tests -name "*.spec.ts" | wc -l) test files"
    echo "Total tests: $(grep -r "test(" tests/ --include="*.spec.ts" | wc -l) test cases"
    ;;
    
  "run")
    TEST_PATTERN="${2:-tests/}"
    echo "Running tests matching: $TEST_PATTERN"
    echo
    npx playwright test "$TEST_PATTERN" --reporter=list
    ;;
    
  "ui")
    echo "Starting Playwright UI test runner..."
    npx playwright test --ui
    ;;
    
  "headed")
    TEST_PATTERN="${2:-tests/}"
    echo "Running tests in headed mode: $TEST_PATTERN"
    npx playwright test "$TEST_PATTERN" --headed --reporter=list
    ;;
    
  "debug")
    TEST_PATTERN="${2:-tests/}"
    echo "Debugging tests: $TEST_PATTERN"
    echo "Use --debug flag with Playwright for step-by-step debugging"
    npx playwright test "$TEST_PATTERN" --debug
    ;;
    
  "trace")
    TEST_PATTERN="${2:-tests/}"
    echo "Running tests with trace: $TEST_PATTERN"
    npx playwright test "$TEST_PATTERN" --trace on
    echo "Trace files saved to test-results/"
    ;;
    
  "report")
    echo "Generating HTML test report..."
    npx playwright test --reporter=html
    echo "Report generated at playwright-report/index.html"
    ;;
    
  "check")
    echo "Checking test syntax..."
    for file in tests/**/*.spec.ts; do
      if node -c "$file" >/dev/null 2>&1; then
        echo "✓ $file"
      else
        echo "✗ $file"
        node -c "$file"
      fi
    done
    ;;
    
  "coverage")
    echo "Test Coverage Summary:"
    echo "======================"
    echo "Authentication Tests: $(grep -c "test(" tests/auth/*.spec.ts) tests"
    echo "Navigation Tests: $(grep -c "test(" tests/navigation/*.spec.ts) tests"
    echo "Value Stream Tests: $(grep -c "test(" tests/value-stream/*.spec.ts) tests"
    echo "Business Capabilities Tests: $(grep -c "test(" tests/business-capabilities/*.spec.ts) tests"
    echo "Business Processes Tests: $(grep -c "test(" tests/business-processes/*.spec.ts) tests"
    echo "Error Handling Tests: $(grep -c "test(" tests/error-handling/*.spec.ts) tests"
    echo
    echo "Total: $(grep -r "test(" tests/ --include="*.spec.ts" | wc -l) test cases"
    ;;
    
  "help"|*)
    echo "EAP Frontend Test Development Helper"
    echo "===================================="
    echo "Usage: ./test-dev.sh [command]"
    echo
    echo "Commands:"
    echo "  list      - List all test files and count"
    echo "  run       - Run tests (optional: test pattern)"
    echo "  ui        - Start Playwright UI test runner"
    echo "  headed    - Run tests in headed mode (visible browser)"
    echo "  debug     - Debug tests with Playwright debugger"
    echo "  trace     - Run tests with trace recording"
    echo "  report    - Generate HTML test report"
    echo "  check     - Check test file syntax"
    echo "  coverage  - Show test coverage summary"
    echo "  help      - Show this help message"
    echo
    echo "Examples:"
    echo "  ./test-dev.sh list"
    echo "  ./test-dev.sh run tests/auth/"
    echo "  ./test-dev.sh headed tests/auth/login.spec.ts"
    echo "  ./test-dev.sh coverage"
    ;;
esac