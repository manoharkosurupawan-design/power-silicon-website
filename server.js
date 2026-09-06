const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT || '3000', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0].split('#')[0];

  // API endpoint to save recorded video from browser
  if (req.method === 'POST' && cleanUrl === '/api/save-video') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const videosDir = path.join(__dirname, 'videos');
      if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

      const webmPath = path.join(videosDir, 'fabrication-loop.webm');
      const mp4Path = path.join(videosDir, 'fabrication-loop.mp4');

      fs.writeFileSync(webmPath, buffer);
      fs.writeFileSync(mp4Path, buffer);

      console.log(`[Video Saver] Saved ${buffer.length} bytes to ${webmPath} and ${mp4Path}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, size: buffer.length }));
    });
    return;
  }

  let filePath = path.join(__dirname, cleanUrl);

  // If path is root or a directory, look for index.html
  if (cleanUrl === '/' || (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())) {
    filePath = path.join(filePath, 'index.html');
  } else if (!path.extname(filePath) && !fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    // Support extension-less URLs (e.g. /about -> /about.html)
    filePath = filePath + '.html';
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(__dirname, '404.html');
      fs.readFile(notFoundPath, (err404, data404) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(err404 ? '404 - Not Found' : data404);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;

    // Support HTTP Range Requests for smooth video seeking & streaming
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm' || ext === '.ogg')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': totalSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes'
    });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`  ⚡ POWER SILICON TECHNOLOGIES WEB SERVER ACTIVE ⚡`);
    console.log(`  Local URL:    http://localhost:${port}`);
    console.log(`  Loopback URL: http://127.0.0.1:${port}`);
    console.log(`  Home Page:    http://localhost:${port}/index.html`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is currently in use. Trying port ${port + 1}...`);
      server.close();
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
