# Quick Start Guide - 3 Steps to Focus Monitoring

Get up and running in less than 5 minutes!

## 🚀 Quick Start

### Step 1: Start the Server (30 seconds)

Open terminal and run:

```bash
cd "/Volumes/Meow 2/lock-me-in"
./start-server.sh
```

Or manually:
```bash
cd "/Volumes/Meow 2/lock-me-in"
python3 -m http.server 8000
```

✅ Keep this terminal running!

---

### Step 2: Install Tampermonkey (2 minutes)

1. **Install extension in your browser:**
   - Chrome: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/

2. **Add the script:**
   - Click Tampermonkey icon → Dashboard
   - Click ➕ (new script)
   - Delete template
   - Copy all of `script.js` and paste
   - Save (Cmd+S)

---

### Step 3: Use It! (1 minute)

1. **Visit any website**
2. **Click "Start"** in the top-right panel
3. **Allow webcam** when prompted
4. **Done!** You're now being monitored

---

## 📋 What Happens Next?

- ✅ Green check = You're focused
- ⚠️ Yellow warning = You looked away (shows seconds)
- 🚨 Red screen = Away for 5+ seconds (warning!)

---

## 🧪 Test Before Using

Want to test first? Open `test.html` in your browser:

```bash
open test.html
# or double-click test.html
```

---

## 📚 Need More Help?

- **Detailed instructions**: See `TAMPERMONKEY-GUIDE.md`
- **Technical details**: See `ARCHITECTURE.md`
- **General info**: See `README.md`

---

## ⚡ Pro Tips

1. **Good lighting** = Better detection
2. **Face the camera** = More accurate
3. **1-3 feet away** = Optimal distance
4. **Click "Show Video"** to verify camera sees you

---

## 🛠️ Quick Troubleshooting

**Models not loading?**
→ Is the server running? Check terminal.

**Webcam not working?**  
→ Allow camera permission in browser settings.

**Face not detected?**
→ Improve lighting, face the camera directly.

---

## 🎯 You're All Set!

Start being more productive today. The script will keep you focused! 💪
