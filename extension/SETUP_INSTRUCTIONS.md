# Extension Setup Instructions

## Required Files

Before the extension can work, you need to download `face-api.min.js`:

1. Visit: https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js
2. Save the file as `face-api.min.js` in the `extension/` directory

Alternatively, you can download it using curl:
```bash
cd extension
curl -L -o face-api.min.js "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
```

## Loading the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `extension/` folder
5. The extension will now be active on all websites!

## Using the Extension

1. Visit any website
2. Look for the control panel on the right side of the screen
3. Click "START MONITOR" to begin tracking
4. Grant webcam permission when prompted
5. The extension will now monitor your focus!

## Troubleshooting

- If models fail to load, check the browser console for errors
- Make sure all model files are present in the `extension/models/` directory
- Ensure camera permissions are granted in browser settings
