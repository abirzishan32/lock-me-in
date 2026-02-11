# Alternative: Using CDN for face-api.js

If you prefer not to bundle face-api.js locally, you can load it from a CDN. However, this requires modifying the extension slightly.

## Method 1: Load from CDN (Requires CSP adjustment)

### Step 1: Modify manifest.json

Add Content Security Policy to allow CDN access:

```json
{
  "manifest_version": 3,
  "content_security_policy": {
    "extension_pages": "script-src 'self' https://cdn.jsdelivr.net; object-src 'self'"
  }
}
```

### Step 2: Create an HTML page to load the library

Create `loader.html` in the extension folder:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
</head>
<body></body>
</html>
```

### Step 3: Use background script to inject

This approach is more complex and not recommended for simplicity.

## Method 2: GitHub Pages Hosting (Advanced)

You can host the models on GitHub Pages:

1. Create a GitHub repository
2. Upload the models/ folder
3. Enable GitHub Pages
4. Update MODEL_URL in content.js to point to your GitHub Pages URL

Example:
```javascript
const CONFIG = {
    MODEL_URL: 'https://yourusername.github.io/focus-monitor-models/',
    // ... other config
};
```

**Note**: This requires internet connectivity and won't work offline.

## Method 3: Use jsDelivr for Models (Experimental)

You can reference models from a CDN too:

```javascript
const CONFIG = {
    MODEL_URL: 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/',
    // ... other config
};
```

**Limitations**:
- Requires internet connection
- Subject to CDN availability
- May have CORS issues

## Recommended Approach

**Stick with the bundled approach** (download face-api.min.js once and bundle with extension):
- ✅ Works offline
- ✅ No external dependencies after install
- ✅ Faster loading
- ✅ More reliable
- ✅ Privacy-friendly (no external requests)

The bundled models + downloaded face-api.min.js approach is the best for a truly standalone extension.
