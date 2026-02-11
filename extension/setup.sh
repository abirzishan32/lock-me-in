#!/bin/bash

# Setup script for Lock Me In Chrome Extension
# This script downloads the required face-api.js library

echo "📦 Lock Me In Extension Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found"
    echo "Please run this script from the extension/ directory"
    echo ""
    echo "Usage:"
    echo "  cd extension"
    echo "  ./setup.sh"
    exit 1
fi

# Check if face-api.min.js already exists
if [ -f "face-api.min.js" ]; then
    echo "✅ face-api.min.js already exists"
    read -p "Do you want to re-download it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup complete! You can now load the extension in Chrome."
        exit 0
    fi
fi

echo "📥 Downloading face-api.js..."
echo ""

# Try to download with curl
if command -v curl &> /dev/null; then
    echo "Using curl..."
    curl -L -o face-api.min.js "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
    download_status=$?
# Try wget as fallback
elif command -v wget &> /dev/null; then
    echo "Using wget..."
    wget -O face-api.min.js "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
    download_status=$?
else
    echo "❌ Error: Neither curl nor wget found"
    echo ""
    echo "Please download manually:"
    echo "1. Visit: https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
    echo "2. Save the file as 'face-api.min.js' in this directory"
    exit 1
fi

# Check if download was successful
if [ $download_status -eq 0 ] && [ -f "face-api.min.js" ]; then
    file_size=$(wc -c < face-api.min.js | tr -d ' ')
    if [ $file_size -gt 10000 ]; then
        echo ""
        echo "✅ Successfully downloaded face-api.min.js ($(numfmt --to=iec $file_size))"
        echo ""
        echo "🎉 Setup complete!"
        echo ""
        echo "Next steps:"
        echo "1. Open Chrome and go to chrome://extensions/"
        echo "2. Enable 'Developer mode' (top-right toggle)"
        echo "3. Click 'Load unpacked'"
        echo "4. Select this extension/ folder"
        echo "5. Visit any website and click the FOCUS tab!"
        echo ""
    else
        echo ""
        echo "⚠️ Warning: Downloaded file seems too small"
        echo "Please download manually from:"
        echo "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
        exit 1
    fi
else
    echo ""
    echo "❌ Download failed"
    echo ""
    echo "Please download manually:"
    echo "1. Visit: https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
    echo "2. Save the file as 'face-api.min.js' in this directory"
    exit 1
fi
