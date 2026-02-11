// ==UserScript==
// @name         Lock Me In - Eye Tracking (Slim UI)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Monitor user focus with a minimalist, non-intrusive UI
// @author       Assistant
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        WARNING_THRESHOLD: 5000,
        CHECK_INTERVAL: 500,
        MODEL_URL: 'http://localhost:8000/models',
        MIN_CONFIDENCE: 0.5
    };

    let state = {
        isActive: false,
        video: null,
        modelsLoaded: false,
        lastFaceDetectedTime: Date.now(),
        warningShown: false,
        detectionInterval: null,
        stream: null,
        panelExpanded: false
    };

    function createUI() {
        if (!document.body) {
            setTimeout(createUI, 100);
            return;
        }

        // --- Video Container & HUD ---
        const videoWrapper = document.createElement('div');
        videoWrapper.id = 'focus-video-container';
        videoWrapper.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; width: 200px; height: 150px;
            z-index: 999998; display: none; border-radius: 8px; overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 3px solid #4CAF50;
            transition: border-color 0.3s;
        `;

        const video = document.createElement('video');
        video.id = 'focus-monitor-video';
        video.autoplay = true;
        video.muted = true;
        video.style.cssText = `width: 100%; height: 100%; object-fit: cover;`;
        
        const statusOverlay = document.createElement('div');
        statusOverlay.id = 'video-status-hud';
        statusOverlay.style.cssText = `
            position: absolute; top: 8px; left: 8px; padding: 2px 6px;
            background: rgba(0,0,0,0.7); color: #4CAF50; font-family: 'Segoe UI', Tahoma, sans-serif;
            font-weight: bold; font-size: 10px; border-radius: 4px; text-transform: uppercase;
        `;
        statusOverlay.textContent = 'READY';

        videoWrapper.appendChild(video);
        videoWrapper.appendChild(statusOverlay);
        document.body.appendChild(videoWrapper);
        state.video = video;

        // --- Minimalist Slim Sidebar ---
        const controlPanel = document.createElement('div');
        controlPanel.id = 'focus-monitor-panel';
        controlPanel.style.cssText = `
            position: fixed; top: 50%; right: -260px; transform: translateY(-50%);
            background: #121212; color: white; border-radius: 8px 0 0 8px;
            z-index: 999999; font-family: sans-serif; box-shadow: -2px 0 15px rgba(0,0,0,0.5);
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex;
        `;
        
        controlPanel.innerHTML = `
            <div id="panel-tab" style="
                width: 24px; background: #252525; border-radius: 8px 0 0 8px;
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; cursor: pointer; border-right: 1px solid #333;
                gap: 10px; padding: 15px 0;
            ">
                <div style="writing-mode: vertical-rl; font-size: 10px; letter-spacing: 1px; color: #bbb; text-transform: uppercase; font-weight: bold;">FOCUS</div>
                <div id="collapse-icon" style="font-size: 10px; color: #888;">◀</div>
            </div>
            
            <div style="width: 260px; padding: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #eee;">Session Controls</h4>
                <div style="display: flex; gap: 8px;">
                    <button id="toggle-monitor" style="flex: 2; padding: 8px; border-radius: 4px; border: none; background: #4CAF50; color: white; font-weight: bold; cursor: pointer; font-size: 12px;">START MONITOR</button>
                    <button id="toggle-video" style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #444; background: transparent; color: white; cursor: pointer;">📹</button>
                </div>
                <p id="system-msg" style="font-size: 10px; color: #666; margin-top: 10px; text-align: center;">Models pending...</p>
            </div>
        `;
        
        document.body.appendChild(controlPanel);

        // --- Warning Overlay ---
        const warningOverlay = document.createElement('div');
        warningOverlay.id = 'focus-warning';
        warningOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(180, 0, 0, 0.9); color: white;
            display: none; flex-direction: column; align-items: center; justify-content: center;
            z-index: 1000000; font-family: sans-serif;
        `;
        warningOverlay.innerHTML = `
            <h1 style="font-size: 48px; margin-bottom: 10px;">EYES ON SCREEN</h1>
            <button id="dismiss-warning" style="padding: 12px 30px; border-radius: 4px; border: none; cursor: pointer; background: white; color: #b40000; font-weight: bold;">BACK TO WORK</button>
        `;
        document.body.appendChild(warningOverlay);

        // Listeners
        document.getElementById('toggle-monitor').addEventListener('click', toggleMonitoring);
        document.getElementById('toggle-video').addEventListener('click', toggleVideo);
        document.getElementById('dismiss-warning').addEventListener('click', dismissWarning);
        document.getElementById('panel-tab').addEventListener('click', togglePanel);
    }

    async function detectFace() {
        if (!state.video || !state.isActive) return;

        const hud = document.getElementById('video-status-hud');
        const container = document.getElementById('focus-video-container');

        try {
            const detection = await faceapi.detectSingleFace(
                state.video, 
                new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: CONFIG.MIN_CONFIDENCE })
            );

            const now = Date.now();
            
            if (detection) {
                state.lastFaceDetectedTime = now;
                state.warningShown = false;
                hud.textContent = 'FOCUSED';
                hud.style.color = '#4CAF50';
                container.style.borderColor = '#4CAF50';
                hideWarning();
            } else {
                const awaySeconds = Math.floor((now - state.lastFaceDetectedTime) / 1000);
                hud.textContent = `AWAY: ${awaySeconds}s`;
                hud.style.color = '#ff4444';
                container.style.borderColor = '#ff4444';

                if ((now - state.lastFaceDetectedTime) >= CONFIG.WARNING_THRESHOLD && !state.warningShown) {
                    showWarning();
                    state.warningShown = true;
                }
            }
        } catch (error) { console.error(error); }
    }

    async function loadModels() {
        document.getElementById('system-msg').textContent = 'Loading AI Models...';
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(CONFIG.MODEL_URL);
            state.modelsLoaded = true;
            document.getElementById('system-msg').textContent = 'System Active';
            return true;
        } catch (e) {
            document.getElementById('system-msg').textContent = 'Load Error (Port 8000?)';
            return false;
        }
    }

    async function toggleMonitoring() {
        const btn = document.getElementById('toggle-monitor');
        if (!state.modelsLoaded && !(await loadModels())) return;

        if (!state.isActive) {
            try {
                state.stream = await navigator.mediaDevices.getUserMedia({ video: true });
                state.video.srcObject = state.stream;
                state.isActive = true;
                state.detectionInterval = setInterval(detectFace, CONFIG.CHECK_INTERVAL);
                btn.textContent = 'STOP MONITOR';
                btn.style.background = '#f44336';
                document.getElementById('focus-video-container').style.display = 'block';
            } catch (e) { alert("Camera access required."); }
        } else {
            state.isActive = false;
            clearInterval(state.detectionInterval);
            if(state.stream) state.stream.getTracks().forEach(t => t.stop());
            btn.textContent = 'START MONITOR';
            btn.style.background = '#4CAF50';
            hideWarning();
        }
    }

    function toggleVideo() {
        const container = document.getElementById('focus-video-container');
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }

    function togglePanel() {
        const panel = document.getElementById('focus-monitor-panel');
        const icon = document.getElementById('collapse-icon');
        state.panelExpanded = !state.panelExpanded;
        panel.style.right = state.panelExpanded ? '0px' : '-260px';
        icon.style.transform = state.panelExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    function showWarning() { document.getElementById('focus-warning').style.display = 'flex'; }
    function hideWarning() { document.getElementById('focus-warning').style.display = 'none'; }
    function dismissWarning() { hideWarning(); state.lastFaceDetectedTime = Date.now(); state.warningShown = false; }

    (function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            createUI();
        }
    })();
})();