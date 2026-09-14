const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.whenReady().then(() => {
  console.log('🚀 Electron renderer started...');
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    }
  });

  win.webContents.on('console-message', (event, level, message) => {
    console.log('[Page]', message);
    if (message.includes('Saved to videos/ folder') || message.includes('VIDEO_EXPORT_COMPLETED_SUCCESSFULLY')) {
      console.log('🎉 Video successfully rendered and saved! Exiting renderer...');
      setTimeout(() => {
        app.quit();
        process.exit(0);
      }, 1500);
    }
  });

  win.loadURL('http://localhost:3000/generator-hiring-video.html?auto');
});
