const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

// Get the app's executable path
const getAppPath = () => {
  if (process.platform === 'win32') {
    return process.execPath;
  }
  return app.getPath('exe');
};

// Registry path for Windows startup
const getRegistryPath = () => {
  const appName = 'Sun Wallpaper';
  return `HKCU\\\\Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run`;
};

// Check if auto-start is enabled
async function getAutoStart() {
  if (process.platform !== 'win32') {
    return false;
  }

  try {
    const { execSync } = require('child_process');
    const appName = 'Sun Wallpaper';
    const regPath = getRegistryPath();

    const result = execSync(`reg query "${regPath}" /v "${appName}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });

    return result.includes(appName);
  } catch (error) {
    return false;
  }
}

// Set auto-start on Windows
async function setAutoStart(enabled) {
  if (process.platform !== 'win32') {
    return Promise.resolve();
  }

  const { execSync } = require('child_process');
  const appName = 'Sun Wallpaper';
  const appPath = getAppPath();
  const regPath = getRegistryPath();

  return new Promise((resolve, reject) => {
    try {
      if (enabled) {
        // Add to registry
        execSync(`reg add "${regPath}" /v "${appName}" /t REG_SZ /d "${appPath}" /f`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore']
        });
      } else {
        // Remove from registry
        execSync(`reg delete "${regPath}" /v "${appName}" /f`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore']
        });
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function createWindow() {
  // Import screen module ONLY inside this function (after app.ready)
  const { screen } = require('electron');
  
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.loadFile('index.html');

  // Remove menu bar
  mainWindow.setMenu(null);
}

app.whenReady().then(() => {
  // Setup IPC handlers
  const { ipcMain } = require('electron');

  ipcMain.handle('get-auto-start', async () => {
    return await getAutoStart();
  });

  ipcMain.handle('set-auto-start', async (event, enabled) => {
    await setAutoStart(enabled);
  });

  ipcMain.on('close-app', () => {
    app.quit();
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle display changes
app.whenReady().then(() => {
  const { screen } = require('electron');
  screen.on('display-metrics-changed', () => {
    if (mainWindow) {
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width, height } = primaryDisplay.workAreaSize;
      mainWindow.setBounds({ x: 0, y: 0, width, height });
    }
  });
});
