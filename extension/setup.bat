@echo off
REM Setup script for Lock Me In Chrome Extension (Windows)
REM This script downloads the required face-api.js library

echo.
echo 📦 Lock Me In Extension Setup
echo ================================
echo.

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo ❌ Error: manifest.json not found
    echo Please run this script from the extension\ directory
    echo.
    echo Usage:
    echo   cd extension
    echo   setup.bat
    exit /b 1
)

REM Check if face-api.min.js already exists
if exist "face-api.min.js" (
    echo ✅ face-api.min.js already exists
    set /p REPLY="Do you want to re-download it? (y/N): "
    if /i not "%REPLY%"=="y" (
        echo Setup complete! You can now load the extension in Chrome.
        exit /b 0
    )
)

echo 📥 Downloading face-api.js...
echo.

REM Try to download with PowerShell
where powershell >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using PowerShell to download...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js' -OutFile 'face-api.min.js'}"
    
    if exist "face-api.min.js" (
        for %%A in ("face-api.min.js") do set filesize=%%~zA
        if !filesize! GTR 10000 (
            echo.
            echo ✅ Successfully downloaded face-api.min.js
            echo.
            echo 🎉 Setup complete!
            echo.
            echo Next steps:
            echo 1. Open Chrome and go to chrome://extensions/
            echo 2. Enable 'Developer mode' ^(top-right toggle^)
            echo 3. Click 'Load unpacked'
            echo 4. Select this extension\ folder
            echo 5. Visit any website and click the FOCUS tab!
            echo.
            exit /b 0
        )
    )
)

echo.
echo ❌ Download failed
echo.
echo Please download manually:
echo 1. Visit: https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js
echo 2. Save the file as 'face-api.min.js' in this directory
echo.
pause
exit /b 1
