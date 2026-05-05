let timeLeft = 180; // 3 minutes in seconds
let timerId = null;
let isRunning = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');

// --- Audio System ---
let audioCtx = null;
let bgmInterval = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function play8bitNote(freq, duration, type = 'square', volume = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function startBGM() {
    initAudio();
    if (bgmInterval) return;

    let step = 0;
    const notes = [110, 123, 130, 146]; // A2, B2, C3, D3 - simple bass loop
    
    bgmInterval = setInterval(() => {
        if (!isRunning) return;
        
        // Bass note
        play8bitNote(notes[step % 4], 0.2, 'square', 0.05);
        
        // Occasional high note for flavor
        if (step % 8 === 0) {
            play8bitNote(440, 0.1, 'square', 0.03);
        }
        
        step++;
    }, 250);
}

function stopBGM() {
    clearInterval(bgmInterval);
    bgmInterval = null;
}

function playNotificationSound() {
    initAudio();
    // High-pitched "ding"
    play8bitNote(880, 0.1, 'square', 0.1);
    setTimeout(() => play8bitNote(1760, 0.2, 'square', 0.08), 100);
}

// --- Timer Logic ---

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    minutesDisplay.textContent = String(mins).padStart(2, '0');
    secondsDisplay.textContent = String(secs).padStart(2, '0');
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
    playNotificationSound();
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 3000);
}

function checkNotifications() {
    if (timeLeft > 30 && timeLeft % 60 === 0 && timeLeft !== 180) {
        showPopup(`残り時間: ${Math.floor(timeLeft / 60)}分`);
    }
    
    if (timeLeft <= 30 && timeLeft > 0 && timeLeft % 10 === 0) {
        showPopup(`残り時間: ${timeLeft}秒`);
    }

    if (timeLeft === 0) {
        showPopup("TIME UP!");
        stopTimer();
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startStopBtn.textContent = 'STOP';
    startStopBtn.style.borderColor = '#ff0000';
    startStopBtn.style.color = '#ff0000';
    startStopBtn.style.boxShadow = '0 0 15px #ff0000';

    startBGM();

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        checkNotifications();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            stopBGM();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    startStopBtn.textContent = 'START';
    startStopBtn.style.borderColor = 'var(--primary-color)';
    startStopBtn.style.color = 'var(--primary-color)';
    startStopBtn.style.boxShadow = '0 0 5px var(--primary-color)';
    clearInterval(timerId);
    stopBGM();
}

function resetTimer() {
    stopTimer();
    timeLeft = 180;
    updateDisplay();
    popup.classList.add('hidden');
}

startStopBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

// Initial display
updateDisplay();
