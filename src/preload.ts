import { contextBridge } from 'electron';
import { getSubjects } from './bot/index';

contextBridge.exposeInMainWorld('guaraniAPI', {
    checkNotas: async (email: string, password: string) => {
        return await getSubjects(email, password);
    }
});
