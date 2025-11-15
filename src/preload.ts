import { contextBridge } from 'electron';
import { runCheck } from './bot/index';

contextBridge.exposeInMainWorld('guaraniAPI', {
    checkNotas: async (email: string, password: string) => {
        return await runCheck(email, password);
    }
});
