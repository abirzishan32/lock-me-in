// Lock Me In - Eye Tracking (Chrome Extension)
// Converted from Tampermonkey userscript to standalone extension

(function() {
    'use strict';

    const CONFIG = {
        WARNING_THRESHOLD: 5000,
        CHECK_INTERVAL: 500,
        MODEL_URL: chrome.runtime.getURL('models/'),
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
            position: fixed; bottom: 20px; right: 20px; width: 220px; height: 165px;
            z-index: 999998; display: none; border-radius: 8px; overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 2px solid #4CAF50;
            background: #000; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        const video = document.createElement('video');
        video.id = 'focus-monitor-video';
        video.autoplay = true;
        video.muted = true;
        video.style.cssText = `width: 100%; height: 100%; object-fit: cover; transition: filter 0.3s;`;
        
        // Custom HUD Bar with Controls
        const hudBar = document.createElement('div');
        hudBar.id = 'video-hud-bar';
        hudBar.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; padding: 8px; box-sizing: border-box;
            background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
            display: flex; justify-content: space-between; align-items: flex-start;
            pointer-events: none; transition: opacity 0.2s;
        `;

        const statusOverlay = document.createElement('div');
        statusOverlay.id = 'video-status-hud';
        statusOverlay.style.cssText = `
            padding: 2px 6px; background: rgba(0,0,0,0.6); color: #4CAF50; font-family: 'Segoe UI', sans-serif;
            font-weight: bold; font-size: 10px; border-radius: 4px; text-transform: uppercase;
            pointer-events: auto; backdrop-filter: blur(2px);
        `;
        statusOverlay.textContent = 'READY';

        const controls = document.createElement('div');
        controls.style.cssText = `display: flex; gap: 4px; pointer-events: auto;`;
        
        const createBtn = (text, id, title) => {
            const btn = document.createElement('button');
            btn.id = id;
            btn.textContent = text;
            btn.title = title;
            btn.style.cssText = `
                background: rgba(255,255,255,0.15); color: white; border: none; border-radius: 4px;
                width: 20px; height: 20px; cursor: pointer; font-size: 12px; line-height: 1;
                display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);
                transition: background 0.2s; padding: 0;
            `;
            btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.3)';
            btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.15)';
            return btn;
        };

        const btnBlur = createBtn('💧', 'btn-video-blur', 'Blur Video');
        const btnMin = createBtn('_', 'btn-video-min', 'Minimize');

        controls.appendChild(btnBlur);
        controls.appendChild(btnMin);
        hudBar.appendChild(statusOverlay);
        hudBar.appendChild(controls);

        videoWrapper.appendChild(video);
        videoWrapper.appendChild(hudBar);
        document.body.appendChild(videoWrapper);
        state.video = video;

        // --- Minimalist Slim Sidebar ---
        // Inject Styling for better control and smooth transitions
        const style = document.createElement('style');
        style.textContent = `
            #focus-monitor-panel {
                position: fixed; top: 50%; right: -300px; transform: translateY(-50%);
                background: #121212; color: white; border-radius: 8px 0 0 8px;
                z-index: 999999; font-family: 'Segoe UI', sans-serif; box-shadow: -2px 0 15px rgba(0,0,0,0.5);
                transition: right 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex;
            }
            #focus-monitor-panel.expanded {
                right: 0 !important;
            }
            #panel-tab {
                width: 20px; background: rgba(20, 20, 20, 0.4); border-radius: 8px 0 0 8px;
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; cursor: pointer; border-right: 1px solid rgba(255,255,255,0.05);
                gap: 10px; padding: 15px 0; transition: all 0.3s ease; backdrop-filter: blur(4px);
            }
            #panel-tab:hover {
                background: #252525; opacity: 1; width: 20px;
            }
            .panel-content {
                width: 300px; padding: 15px; box-sizing: border-box;
            }
            /* Video States */
            #focus-monitor-video.blurred {
                filter: blur(15px);
                transform: scale(1.1);
            }
            #focus-video-container.minimized {
                height: 36px !important;
                width: 140px !important;
                border-width: 1px !important;
                bottom: 20px !important; /* Keep position */
            }
            #focus-video-container.minimized #focus-monitor-video {
                opacity: 0;
            }
            #focus-video-container.minimized #video-hud-bar {
                background: none;
                padding: 6px;
            }
        `;
        document.head.appendChild(style);

        const controlPanel = document.createElement('div');
        controlPanel.id = 'focus-monitor-panel';
        
        controlPanel.innerHTML = `
            <div id="panel-tab">
                <div style="writing-mode: vertical-rl; font-size: 10px; letter-spacing: 1px; color: #aaa; text-transform: uppercase; font-weight: bold; opacity: 0.8;">Lock Me In</div>
                <div id="collapse-icon" style="font-size: 10px; color: #888;">◀</div>
            </div>
            
            <div class="panel-content">
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
            <h1 style="font-size: 48px; margin-bottom: 10px;">YOU ARE DISTRACTED! STAY FOCUSED!</h1>
            <button id="dismiss-warning" style="padding: 12px 30px; border-radius: 4px; border: none; cursor: pointer; background: white; color: #b40000; font-weight: bold;">BACK TO WORK</button>
        `;
        document.body.appendChild(warningOverlay);

        // Listeners
        document.getElementById('toggle-monitor').addEventListener('click', toggleMonitoring);
        document.getElementById('toggle-video').addEventListener('click', toggleVideo);
        document.getElementById('dismiss-warning').addEventListener('click', dismissWarning);
        document.getElementById('panel-tab').addEventListener('click', togglePanel);
        
        // Video Control Listeners
        document.getElementById('btn-video-blur').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('focus-monitor-video').classList.toggle('blurred');
        });
        document.getElementById('btn-video-min').addEventListener('click', (e) => {
            e.stopPropagation();
            const container = document.getElementById('focus-video-container');
            const btn = document.getElementById('btn-video-min');
            const isMin = container.classList.toggle('minimized');
            btn.textContent = isMin ? '□' : '_';
            btn.title = isMin ? 'Maximize' : 'Minimize';
        });
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
            console.error('Model loading error:', e);
            document.getElementById('system-msg').textContent = 'Model Load Error';
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
        
        if (state.panelExpanded) {
            panel.classList.add('expanded');
            icon.style.transform = 'rotate(180deg)';
        } else {
            panel.classList.remove('expanded');
            icon.style.transform = 'rotate(0deg)';
        }
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
