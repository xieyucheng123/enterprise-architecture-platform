#!/bin/bash

# EAP Frontend Playwright Test Runner
# Usage: ./run-tests.sh [test-pattern]

set -e

echo "=== EAP Frontend Playwright Tests ==="
echo

# Check if backend is running
echo "Checking backend server..."
if ! curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "⚠️  Backend server (http://localhost:8080) is not running"
    echo "   Please start the backend server first"
    echo
fi

# Check if frontend is running
echo "Checking frontend server..."
if ! curl -s http://localhost:4173 > /dev/null 2>&1; then
    echo "⚠️  Frontend server (http://localhost:4173) is not running"
    echo "   Starting Vite preview server..."
    
    # Start Vite preview in background
    npm run preview > /tmp/vite-preview.log 2>&1 &
    VITE_PID=$!
    
    # Wait for server to start
    echo -n "   Waiting for server to start..."
    for i in {1..30}; do
        if curl -s http://localhost:4173 > /dev/null 2>&1; then
            echo " ✓"
            echo "   Server started with PID: $VITE_PID"
            SERVER_STARTED=true
            break
        fi
        echo -n "."
        sleep 1
    done
    
    if [ "$SERVER_STARTED" != "true" ]; then
        echo " ✗"
        echo "   Failed to start server. Check /tmp/vite-preview.log for details."
        kill $VITE_PID 2>/dev/null || true
        exit 1
    fi
else
    echo "✓ Frontend server is running"
fi

echo

# Run tests
TEST_PATTERN="${1:-tests/}"

echo "Running tests matching: $TEST_PATTERN"
echo

npx playwright test "$TEST_PATTERN" --reporter=list

echo
echo "=== Test Run Complete ==="

# Clean up if we started the server
if [ -n "$VITE_PID" ]; then
    echo "Stopping Vite preview server (PID: $VITE_PID)..."
    kill $VITE_PID 2>/dev/null || true
fi