# 👁️ Lock Me In - Focus Monitor

A browser extension that helps you stay focused by monitoring your attention using facial detection technology. Get alerted when you look away from your work!

## 🌟 Features

- **Real-time Face Detection**: Uses AI to detect if you're looking at the screen
- **Smart Warnings**: Get a full-screen alert after being away for 5+ seconds
- **Minimalist UI**: Unobtrusive control panel that slides out from the side
- **Privacy First**: All processing happens locally - no data leaves your device
- **Standalone**: No external servers required!

## 🚀 Quick Start

### Option 1: Chrome Extension (Recommended)

**No server, no Tampermonkey - just pure extension goodness!**

1. **Setup** (one-time, 1 minute):
   ```bash
   cd extension
   ./setup.sh    # Linux/Mac
   setup.bat     # Windows
   ```

2. **Install** (30 seconds):
   - Open Chrome: `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

3. **Use it**: Visit any website and click the FOCUS tab!

**📖 Full instructions**: See [extension/README.md](extension/README.md)

### Option 2: Tampermonkey (Legacy)

Requires a local Python server to serve model files.

**📖 Full instructions**: See [quickstart.md](quickstart.md)

## 📁 Repository Structure

```
lock-me-in/
├── extension/              # 🎯 STANDALONE CHROME EXTENSION
│   ├── manifest.json      # Extension configuration
│   ├── content.js         # Main extension script
│   ├── models/            # AI model files (bundled!)
│   ├── setup.sh           # Automated setup (Mac/Linux)
│   ├── setup.bat          # Automated setup (Windows)
│   └── README.md          # Detailed extension guide
├── script.js              # Original Tampermonkey script
├── test.html              # Test page for Tampermonkey
├── server.py              # Local server for Tampermonkey
└── quickstart.md          # Installation guides for both options
```

## 🎯 How It Works

1. **Face Detection**: Uses face-api.js (TensorFlow.js) to detect faces in your webcam feed
2. **Attention Tracking**: Monitors whether a face is detected in the video stream
3. **Warning System**: Triggers a full-screen alert if no face detected for 5+ seconds
4. **Local Processing**: Everything runs in your browser - no cloud, no servers

## 🔒 Privacy & Security

- ✅ **100% Local**: All processing happens in your browser
- ✅ **No Data Collection**: Nothing is recorded or transmitted
- ✅ **No External Calls**: Works completely offline (after initial setup)
- ✅ **Open Source**: All code is visible and auditable
- ✅ **Camera Control**: You control when the camera is active

## ⚙️ Customization

Edit `extension/content.js` to adjust:

```javascript
const CONFIG = {
    WARNING_THRESHOLD: 5000,  // Time before warning (ms) - default 5 seconds
    CHECK_INTERVAL: 500,      // Detection frequency (ms) - default 500ms
    MIN_CONFIDENCE: 0.5       // Face detection threshold - default 0.5
};
```

## 🛠️ Requirements

### Chrome Extension
- Chrome/Chromium browser (version 88+)
- Webcam
- ~15MB disk space for models

### Tampermonkey (Legacy)
- Tampermonkey extension
- Python 3 for local server
- Webcam

## 📊 Technology Stack

- **Face Detection**: [face-api.js](https://github.com/justadudewhohacks/face-api.js) (TensorFlow.js)
- **Models**: Tiny Face Detector (lightweight and fast)
- **Browser API**: WebRTC for camera access
- **Extension**: Chrome Extensions Manifest V3

## 🎨 UI/UX

- **Collapsible Panel**: Minimal "FOCUS" tab on the right side
- **Video Preview**: Optional webcam preview with status overlay
- **Status Indicators**: Color-coded (green = focused, red = away)
- **Warning Screen**: Full-screen red overlay with dismiss button

## 📈 Performance

- **CPU Usage**: ~3-5% on modern CPUs
- **Memory**: ~50-100MB
- **Detection Latency**: <500ms
- **Models Size**: ~15MB total

## 🤝 Contributing

Contributions welcome! Ideas:
- Better icon designs
- Configuration UI
- Additional detection modes (eye tracking, head pose)
- Performance optimizations
- Mobile browser support
- Statistics/analytics (local only)

## 📝 License

MIT License - Free to use and modify

## 🙏 Credits

- **face-api.js**: Vincent Mühler (@justadudewhohacks)
- **TensorFlow.js**: Google
- **Inspiration**: Pomodoro technique and focus apps

## 📞 Support

- 🐛 **Issues**: Open an issue on GitHub
- 📖 **Documentation**: See README files in each directory
- 💡 **Ideas**: Suggestions welcome!

## ⚡ Quick Comparison

| Feature | Chrome Extension | Tampermonkey |
|---------|-----------------|--------------|
| Setup Time | 2 minutes | 5 minutes |
| Server Required | ❌ No | ✅ Yes (Python) |
| Offline Mode | ✅ Yes | ❌ No |
| Model Loading | Bundled | HTTP server |
| Portability | ✅ High | ⚠️ Low |
| Updates | Manual | Script update |

---

**🎯 Ready to boost your focus? Get started with the Chrome Extension now!**

```bash
cd extension && ./setup.sh
```

Then load it in Chrome and stay focused! 💪
