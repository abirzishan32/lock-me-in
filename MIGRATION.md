# Migration Guide: Tampermonkey to Chrome Extension

This guide helps you migrate from the Tampermonkey userscript to the standalone Chrome extension.

## Why Migrate?

| Tampermonkey | Chrome Extension |
|--------------|------------------|
| Requires Python server | ❌ No server needed |
| Server must be running | ✅ Always available |
| Models via HTTP | ✅ Bundled locally |
| face-api.js from CDN | ✅ Bundled locally |
| More setup steps | ✅ Simple setup |
| Internet required | ✅ Offline capable |

## Migration Steps

### Step 1: Stop the Server (if running)

If you're currently using the Tampermonkey version:

```bash
# Find and stop the Python server
ps aux | grep "python.*8000"
kill <PID>
```

Or just close the terminal window running the server.

### Step 2: Set Up the Extension

```bash
cd extension
./setup.sh    # Mac/Linux
setup.bat     # Windows
```

This downloads face-api.js (one-time only).

### Step 3: Load in Chrome

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select the `extension/` folder
5. Done! ✅

### Step 4: Disable Tampermonkey Script (Optional)

If you want to keep both:
- Keep them both active for comparison

If you want to switch completely:
1. Open Tampermonkey Dashboard
2. Find "Focus Monitor - Eye Tracking"
3. Toggle it off or delete it

## What Stays the Same

✅ **All functionality** - Same face detection, warnings, UI  
✅ **Same models** - Identical AI models  
✅ **Same behavior** - 5-second warning threshold, etc.  
✅ **Same privacy** - Everything still runs locally  

## What Changes

The only difference:
- **Before**: Models loaded from `http://localhost:8000/models`
- **After**: Models loaded from `chrome-extension://.../models`

## Testing the Migration

1. Load the extension
2. Visit any website
3. Click the FOCUS tab on the right
4. Click "START MONITOR"
5. Allow camera access
6. Verify face detection works

You should see:
- Green "FOCUSED" when looking at screen
- Red "AWAY: Xs" when looking away
- Full-screen warning after 5 seconds

## Troubleshooting

### "Models not loading"
- Ensure face-api.min.js is in extension/ folder
- Check browser console for errors
- Verify all model files are in extension/models/

### "Camera not working"
- Check Chrome camera permissions
- Visit: `chrome://settings/content/camera`
- Ensure the extension has camera access

### "Extension not appearing"
- Verify Developer mode is enabled
- Check for errors at `chrome://extensions/`
- Try reloading the extension

## Reverting to Tampermonkey

If you need to go back:

1. Disable/remove the Chrome extension
2. Start the Python server:
   ```bash
   python3 -m http.server 8000
   ```
3. Re-enable the Tampermonkey script

All the old files are still in the repository root.

## Benefits You'll Notice

1. **Faster startup** - No waiting for server
2. **More reliable** - No "server not running" errors
3. **Better performance** - Local file access is faster
4. **Simpler workflow** - Just start Chrome, it works
5. **Portable** - Works on any machine with Chrome

## Need Help?

- 📖 Extension docs: `extension/README.md`
- 📖 Quick start: `quickstart.md`
- 📖 Main README: `README.md`
- 🐛 Issues: Open a GitHub issue

## Summary

The Chrome extension provides the exact same functionality but with:
- ✅ Easier setup
- ✅ No external dependencies
- ✅ Better reliability
- ✅ Offline capability
- ✅ Simpler user experience

**Ready to migrate? Run `cd extension && ./setup.sh` now!**
