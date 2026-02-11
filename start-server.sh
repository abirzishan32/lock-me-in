#!/bin/bash

# Lock Me In - Quick Start Script
# This script starts a local server to serve the face detection models

echo "========================================="
echo "  Lock Me In - Starting Local Server"
echo "========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if we're in the right directory
if [ ! -d "$SCRIPT_DIR/models" ]; then
    echo "❌ Error: models folder not found!"
    echo "Please run this script from the lock-me-in directory."
    exit 1
fi

echo "📁 Working directory: $SCRIPT_DIR"
echo "📦 Models folder found: ✓"
echo ""

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8000 is already in use!"
    echo ""
    echo "Options:"
    echo "  1. Stop the existing server and re-run this script"
    echo "  2. Use the existing server (it might already be serving the models)"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Try to find python3
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python not found!"
    echo ""
    echo "Please install Python 3 or use an alternative:"
    echo "  • Node.js: npx http-server -p 8000"
    echo "  • PHP: php -S localhost:8000"
    exit 1
fi

echo "🐍 Using: $PYTHON_CMD"
echo ""

# Start the CORS-enabled server
cd "$SCRIPT_DIR"
$PYTHON_CMD server.py
