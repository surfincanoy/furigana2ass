const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  convertSrt: (srtPath) => ipcRenderer.invoke('convert-srt', srtPath),
  selectSaveFile: () => ipcRenderer.invoke('select-save-file'),
  mergeSrt: (opts) => ipcRenderer.invoke('merge-srt', opts),
});
