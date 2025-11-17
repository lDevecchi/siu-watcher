import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import cron, { ScheduledTask } from 'node-cron';
import { checkForChanges, getSubjects } from './bot/index';

let mainWindow: BrowserWindow | null = null;
let watchJob: ScheduledTask | null = null;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  console.log('dirname:', __dirname);
  console.log('HTML path:', path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: Obtener notas
ipcMain.handle('get-subjects', async (_event, email: string, password: string) => {
  try {
    const result = await getSubjects(email, password);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

// IPC: Iniciar / detener observación
ipcMain.handle('toggle-watch', async (_event, email: string, password: string) => {
  if (watchJob) {
    watchJob.stop();
    watchJob = null;
    return { running: false };
  }

  // Cron: cada minuto
  watchJob = cron.schedule('* * * * *', async () => {
    try {
      const result = await checkForChanges(email, password);
      mainWindow?.webContents.send('watch-update', result);
    } catch (err) {
      mainWindow?.webContents.send('watch-error', (err as Error).message);
    }
  });

  watchJob.start();
  return { running: true };
});


// Handle close app.
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });