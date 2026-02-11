# Icon Creation Instructions

This extension needs three icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

## Quick Creation Using ImageMagick

If you have ImageMagick installed:

```bash
# Create a simple eye icon placeholder
convert -size 128x128 xc:blue -fill white -font Arial -pointsize 80 -gravity center -annotate +0+0 "👁️" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

## Or Use Online Tools

1. Go to any icon generator website (e.g., https://favicon.io/)
2. Create an eye or focus-themed icon
3. Download and rename to icon16.png, icon48.png, icon128.png
4. Place them in the extension/ directory

## Temporary Fix

You can also use simple colored squares as placeholders:

```bash
cd extension
# Create simple colored placeholders
convert -size 128x128 xc:#4CAF50 icon128.png
convert -size 48x48 xc:#4CAF50 icon48.png
convert -size 16x16 xc:#4CAF50 icon16.png
```
