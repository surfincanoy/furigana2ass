const srtInput = document.getElementById('srtPath');
const selectBtn = document.getElementById('selectBtn');
const convertBtn = document.getElementById('convertBtn');
const statusArea = document.getElementById('statusArea');
const statusText = document.getElementById('statusText');

const mergeFile1 = document.getElementById('mergeFile1');
const mergeFile2 = document.getElementById('mergeFile2');
const mergeSelect1 = document.getElementById('mergeSelect1');
const mergeSelect2 = document.getElementById('mergeSelect2');
const mergeSwap = document.getElementById('mergeSwap');
const mergeBtn = document.getElementById('mergeBtn');
const mergeStatus = document.getElementById('mergeStatus');
const mergeStatusText = document.getElementById('mergeStatusText');

let selectedPath = null;
let mergePath1 = null;
let mergePath2 = null;

function setStatus(el, text, type) {
  el.querySelector('span').textContent = text;
  el.className = 'status-area' + (type ? ' ' + type : '');
}

selectBtn.addEventListener('click', async () => {
  const path = await window.electronAPI.selectFile();
  if (path) {
    selectedPath = path;
    srtInput.value = path;
    setStatus(statusArea, '已选择文件', '');
  }
});

convertBtn.addEventListener('click', async () => {
  if (!selectedPath) {
    setStatus(statusArea, '请先选择一个SRT文件', 'error');
    return;
  }

  convertBtn.disabled = true;
  setStatus(statusArea, '正在转换...', 'progress');

  try {
    const result = await window.electronAPI.convertSrt(selectedPath);
    if (result.success) {
      setStatus(statusArea, `转换完成：${result.assPath}（共 ${result.total} 条字幕）`, 'success');
    } else {
      setStatus(statusArea, `错误：${result.error}`, 'error');
    }
  } catch (err) {
    setStatus(statusArea, `错误：${err.message}`, 'error');
  } finally {
    convertBtn.disabled = false;
  }
});

mergeSelect1.addEventListener('click', async () => {
  const path = await window.electronAPI.selectFile();
  if (path) {
    mergePath1 = path;
    mergeFile1.value = path;
    setStatus(mergeStatus, '', '');
  }
});

mergeSelect2.addEventListener('click', async () => {
  const path = await window.electronAPI.selectFile();
  if (path) {
    mergePath2 = path;
    mergeFile2.value = path;
    setStatus(mergeStatus, '', '');
  }
});

mergeBtn.addEventListener('click', async () => {
  if (!mergePath1 || !mergePath2) {
    setStatus(mergeStatus, '请先选择两个字幕文件', 'error');
    return;
  }

  const outPath = await window.electronAPI.selectSaveFile();
  if (!outPath) return;

  mergeBtn.disabled = true;
  setStatus(mergeStatus, '正在合并...', 'progress');

  try {
    const result = await window.electronAPI.mergeSrt({
      file1: mergePath1,
      file2: mergePath2,
      swap: mergeSwap.checked,
      outputPath: outPath,
    });

    if (result.success) {
      setStatus(mergeStatus, `合并完成：${result.outputPath}（共 ${result.total} 条字幕）`, 'success');
    } else {
      setStatus(mergeStatus, `错误：${result.error}`, 'error');
    }
  } catch (err) {
    setStatus(mergeStatus, `错误：${err.message}`, 'error');
  } finally {
    mergeBtn.disabled = false;
  }
});
