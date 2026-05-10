const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  convertSrt: (srtPath) => ipcRenderer.invoke('convert-srt', srtPath),
});
