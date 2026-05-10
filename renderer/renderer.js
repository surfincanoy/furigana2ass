const srtInput = document.getElementById('srtPath');
const selectBtn = document.getElementById('selectBtn');
const convertBtn = document.getElementById('convertBtn');
const statusArea = document.getElementById('statusArea');
const statusText = document.getElementById('statusText');

let selectedPath = null;

function setStatus(msg, type) {
  statusText.textContent = msg;
  statusArea.className = 'status-area' + (type ? ' ' + type : '');
}

selectBtn.addEventListener('click', async () => {
  const path = await window.electronAPI.selectFile();
  if (path) {
    selectedPath = path;
    srtInput.value = path;
    setStatus('已选择文件', '');
  }
});

convertBtn.addEventListener('click', async () => {
  if (!selectedPath) {
    setStatus('请先选择一个SRT文件', 'error');
    return;
  }

  convertBtn.disabled = true;
  setStatus('正在转换...', 'progress');

  try {
    const result = await window.electronAPI.convertSrt(selectedPath);
    if (result.success) {
      setStatus(`转换完成：${result.assPath}（共 ${result.total} 条字幕）`, 'success');
    } else {
      setStatus(`错误：${result.error}`, 'error');
    }
  } catch (err) {
    setStatus(`错误：${err.message}`, 'error');
  } finally {
    convertBtn.disabled = false;
  }
});
