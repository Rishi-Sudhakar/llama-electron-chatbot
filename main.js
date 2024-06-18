const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', () => {
  // Start Flask server
  const flaskServer = spawn('python3', ['app.py']);

  flaskServer.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  flaskServer.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  flaskServer.on('close', (code) => {
    console.log(`Flask server exited with code ${code}`);
  });

  createWindow();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('quit', () => {
  // Kill Flask server when Electron app is closed
  flaskServer.kill();
});
