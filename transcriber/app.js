const audioInput = document.getElementById('audioInput');
const selectBtn = document.getElementById('selectBtn');
const transcribeBtn = document.getElementById('transcribeBtn');
const fileNameDisplay = document.getElementById('fileName');
const dropZone = document.getElementById('dropZone');
const loader = document.getElementById('loader');
const resultWindow = document.getElementById('resultWindow');
const copyBtn = document.getElementById('copyBtn');
const charCount = document.getElementById('charCount');

let selectedFile = null;

// Handle File Selection
selectBtn.addEventListener('click', () => audioInput.click());

audioInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
});

function handleFileSelect(file) {
    selectedFile = file;
    fileNameDisplay.textContent = `選択されたファイル: ${file.name}`;
    transcribeBtn.disabled = false;
    
    // Clear previous results
    resultWindow.innerHTML = '<p class="placeholder">準備完了。開始ボタンを押してください。</p>';
}

// Transcribe API Call
transcribeBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    // UI Updates
    transcribeBtn.disabled = true;
    loader.classList.remove('hidden');
    resultWindow.innerHTML = '<p class="placeholder">処理中...</p>';

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('http://localhost:8000/transcribe', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        console.error('Transcription error:', error);
        let errorMsg = 'エラーが発生しました';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg = 'サーバーに接続できません。ローカルのPythonサーバー(main.py)が起動しているか確認してください。';
        } else {
            errorMsg = `エラーが発生しました: ${error.message}`;
        }
        resultWindow.innerHTML = `<p style="color: #ef4444;">${errorMsg}</p>`;
    } finally {
        loader.classList.add('hidden');
        transcribeBtn.disabled = false;
    }
});

function displayResult(data) {
    if (data.segments && data.segments.length > 0) {
        const text = data.segments.map(s => s.text).join(' ');
        resultWindow.innerHTML = `<p>${text}</p>`;
        charCount.textContent = text.length;
    } else {
        resultWindow.innerHTML = '<p>文字を検出できませんでした。</p>';
        charCount.textContent = '0';
    }
}

// Copy to Clipboard
copyBtn.addEventListener('click', () => {
    const text = resultWindow.innerText;
    if (!text || text.includes('ここに文字起こしの結果が表示されます')) return;

    navigator.clipboard.writeText(text).then(() => {
        const originalSvg = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
            copyBtn.innerHTML = originalSvg;
        }, 2000);
    });
});
