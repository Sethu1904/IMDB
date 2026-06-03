const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const selectedFileName = document.getElementById('selected-file-name');

let selectedFile = null;

// Drag & drop
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFileSelect(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFileSelect(fileInput.files[0]);
});

function handleFileSelect(file) {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    alert('Please select a CSV file.');
    return;
  }
  selectedFile = file;
  selectedFileName.textContent = `Selected: ${file.name}`;
  uploadFile();
}

function uploadFile() {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('file', selectedFile);

  show('upload-progress');
  animateProgress();

  fetch('/api/upload', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        document.getElementById('success-filename').textContent = data.filename;
        document.getElementById('stat-records').textContent = data.total_records.toLocaleString();
        document.getElementById('stat-time').textContent = `${data.time_taken} sec`;
        hide('upload-section');
        hide('upload-progress');
        show('success-section');
      } else {
        showError(data.error || 'Upload failed.');
      }
    })
    .catch(() => showError('Network error. Please try again.'));
}

let progressInterval = null;
function animateProgress() {
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');
  let pct = 0;
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 3, 92);
    bar.style.width = pct + '%';
    text.textContent = `Uploading... ${Math.round(pct)}%`;
  }, 300);
}

function showError(msg) {
  clearInterval(progressInterval);
  document.getElementById('error-msg').textContent = msg;
  hide('upload-progress');
  show('error-section');
}

function resetUpload() {
  selectedFile = null;
  fileInput.value = '';
  selectedFileName.textContent = '';
  document.getElementById('progress-bar').style.width = '0%';
  hide('success-section');
  hide('error-section');
  hide('upload-progress');
  show('upload-section');
}

function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }
