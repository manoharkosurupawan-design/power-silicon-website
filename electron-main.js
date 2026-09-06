const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let server;
let serverPort = 38472;

// Embedded local static web server to enable offline execution & clean routing
function startEmbeddedServer(callback) {
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg'
  };

  server = http.createServer((req, res) => {
    let parsedUrl = req.url.split('?')[0];
    let filePath = path.join(__dirname, parsedUrl === '/' ? 'index.html' : parsedUrl);

    // If direct path doesn't exist, try appending .html for extensionless URLs
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    }

    // Check directory fallback or 404
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const indexInDir = path.join(filePath, 'index.html');
      if (fs.existsSync(indexInDir)) {
        filePath = indexInDir;
      } else {
        filePath = path.join(__dirname, '404.html');
        res.statusCode = 404;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(res.statusCode || 200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      }
    });
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      serverPort++;
      server.listen(serverPort, '127.0.0.1');
    }
  });

  server.listen(serverPort, '127.0.0.1', () => {
    callback(`http://127.0.0.1:${serverPort}`);
  });
}

function createWindow(url) {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    title: 'Power Silicon Technologies Pvt. Ltd.',
    icon: path.join(__dirname, 'favicon.ico'),
    backgroundColor: '#030712',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  // Remove default menu bar for clean modern presentation
  Menu.setApplicationMenu(null);

  // Open external links (e.g. WhatsApp, LinkedIn, Maps) in default system browser
  win.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    if (targetUrl.startsWith('http:') || targetUrl.startsWith('https:')) {
      if (!targetUrl.includes('127.0.0.1') && !targetUrl.includes('localhost')) {
        shell.openExternal(targetUrl);
        return { action: 'deny' };
      }
    }
    return { action: 'allow' };
  });

  win.loadURL(url);
}

app.whenReady().then(() => {
  startEmbeddedServer((url) => {
    createWindow(url);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(`http://127.0.0.1:${serverPort}`);
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    try { server.close(); } catch(e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
