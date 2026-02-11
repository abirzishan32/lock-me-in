# Focus Monitor Chrome Extension

A standalone Chrome extension that monitors your focus using facial detection technology. No external servers or Tampermonkey required!

## 🚀 Quick Start

### Step 1: Download Required Library

Before loading the extension, you need to download the face-api.js library:

**Option A: Automated Setup Script (Easiest!)**
```bash
# Linux/Mac
cd extension
./setup.sh

# Windows
cd extension
setup.bat
```

**Option B: Using curl/wget**
```bash
cd extension
curl -L -o face-api.min.js "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
```

Or with wget:
```bash
cd extension
wget -O face-api.min.js "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
```

**Option C: Manual Download**
1. Visit: https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js
2. Save the file (Right-click → Save As)
3. Save it as `face-api.min.js` in the `extension/` folder

### Step 2: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `extension/` folder from this repository
5. The extension icon should appear in your toolbar

### Step 3: Use the Extension

1. Visit any website
2. Look for the "FOCUS" tab on the right side of the page
3. Click it to expand the control panel
4. Click **"START MONITOR"** button
5. Grant camera permissions when prompted
6. You're now being monitored! Stay focused! 👁️

## 📁 What's Included

```
extension/
├── manifest.json           # Extension configuration
├── content.js             # Main extension script
├── face-api.min.js        # Face detection library (you need to download this)
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
├── models/               # AI model files for face detection
│   ├── tiny_face_detector_model-*
│   └── ... (other model files)
├── SETUP_INSTRUCTIONS.md  # Detailed setup guide
└── CREATE_ICONS.md       # Icon customization guide
```

## 🎯 How It Works

1. **Face Detection**: Uses TensorFlow.js models to detect your face in real-time
2. **Focus Tracking**: Monitors whether you're looking at the screen
3. **Warning System**: Shows a red warning screen if you look away for 5+ seconds
4. **Privacy First**: All processing happens locally in your browser - no data sent anywhere!

## ⚙️ Features

- ✅ **Standalone**: No external servers required
- ✅ **Privacy-focused**: All processing happens locally
- ✅ **Lightweight**: Minimalist UI that doesn't interfere with your work
- ✅ **Customizable**: Adjust warning threshold and check intervals in content.js
- ✅ **Visual Feedback**: Color-coded status (green = focused, red = away)
- ✅ **Video Preview**: Toggle webcam preview on/off

## 🔧 Customization

Edit `content.js` to customize:

```javascript
const CONFIG = {
    WARNING_THRESHOLD: 5000,  // Milliseconds before warning (5 seconds)
    CHECK_INTERVAL: 500,      // How often to check (500ms)
    MIN_CONFIDENCE: 0.5       // Face detection confidence threshold
};
```

## 🛠️ Troubleshooting

### Models not loading?
- Check browser console for errors
- Ensure all files in `extension/models/` are present
- Verify `face-api.min.js` is downloaded

### Camera not working?
- Grant camera permissions in Chrome settings
- Check `chrome://settings/content/camera`
- Try reloading the extension

### Face not detected?
- Ensure good lighting
- Face the camera directly
- Stay 1-3 feet from the camera
- Remove obstructions (glasses, hat, etc.)

### Extension not appearing?
- Ensure Developer mode is enabled
- Check for errors in `chrome://extensions/`
- Try reloading the extension

## 📝 Differences from Tampermonkey Version

| Feature | Tampermonkey | Chrome Extension |
|---------|--------------|------------------|
| Installation | Requires Tampermonkey | Load directly in Chrome |
| Model Loading | Requires local server | Bundled with extension |
| face-api.js | Loaded from CDN | Bundled with extension |
| Portability | Requires server running | Fully self-contained |

## 🔒 Privacy & Security

- ✅ No data collection
- ✅ No external network requests (after initial setup)
- ✅ All processing happens locally
- ✅ Camera feed never leaves your device
- ✅ No analytics or tracking

## 📄 License

This extension is free to use and modify for personal use.

## 🤝 Contributing

To improve this extension:
1. Enhance the UI
2. Add more detection features
3. Improve performance
4. Create better icons
5. Add configuration options

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Ensure all required files are present
4. Try disabling other extensions
5. Open an issue on GitHub

---

**Made with ❤️ to help you stay focused!**
