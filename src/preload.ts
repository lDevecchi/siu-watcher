import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('guaraniAPI', {
  getSubjects: (email: string, password: string) =>
    ipcRenderer.invoke('get-subjects', email, password),
  toggleWatch: (email: string, password: string) =>
    ipcRenderer.invoke('toggle-watch', email, password),
  onWatchUpdate: (callback: (updated: boolean) => void) =>
    ipcRenderer.on('watch-update', (_e, data) => callback(data)),
  onWatchError: (callback: (error: string) => void) =>
    ipcRenderer.on('watch-error', (_e, error) => callback(error)),
  testClick: () => '¡La app funciona correctamente!'

});
