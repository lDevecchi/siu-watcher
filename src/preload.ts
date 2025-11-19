import { contextBridge, ipcRenderer } from 'electron';
import { ResponseStatus, Subject } from './utils/types';

contextBridge.exposeInMainWorld('guaraniAPI', {
  getSubjects: (email: string, password: string): Promise<ResponseStatus> =>
    ipcRenderer.invoke('get-subjects', email, password),

  checkForChanges: (email: string, password: string): Promise<[Subject[] | null, ResponseStatus]> =>
    ipcRenderer.invoke('check-for-changes', email, password),

  toggleCronJob: (email: string, password: string): Promise<{ running: boolean }> =>
    ipcRenderer.invoke('toggle-cron-job', email, password),

  onCronJobUpdate: (callback: (updated: boolean) => void) =>
    ipcRenderer.on('cron-job-update', (_e, data) => callback(data)),

  onCronJobError: (callback: (error: string) => void) =>
    ipcRenderer.on('cron-job-error', (_e, error) => callback(error)),

  testClick: () => '¡La app funciona correctamente!'

});
