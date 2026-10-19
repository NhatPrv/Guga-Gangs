/**
 * server.js
 * Máy chủ HTTP tĩnh tích hợp sẵn (Zero-dependency Node.js)
 * Phục vụ ứng dụng Web SPA và toàn bộ kho dữ liệu JSON.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const WEB_DIR = path.join(ROOT_DIR, 'web');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Bật CORS cho mọi request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Định tuyến đường dẫn
  let filePath;

  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(WEB_DIR, 'index.html');
  } else if (pathname.startsWith('/data/')) {
    filePath = path.join(ROOT_DIR, pathname);
  } else if (pathname.startsWith('/css/') || pathname.startsWith('/js/')) {
    filePath = path.join(WEB_DIR, pathname);
  } else {
    // Thử tìm trong web/ trước, sau đó tìm ở root
    const webCandidate = path.join(WEB_DIR, pathname);
    if (fs.existsSync(webCandidate)) {
      filePath = webCandidate;
    } else {
      filePath = path.join(ROOT_DIR, pathname);
    }
  }

  // Kiểm tra an toàn bảo mật path traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden: Truy cập bị từ chối');
    return;
  }

  // Đọc file và trả response
  fs.stat(normalizedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: Đường dẫn không tồn tại (${pathname})`);
      return;
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(normalizedPath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('='.repeat(55));
  console.log(`🌸 JLPT N4 Master Web Server đang chạy tại:`);
  console.log(`   👉 http://localhost:${PORT}`);
  console.log('='.repeat(55));
  console.log(`Nhấn Ctrl + C để dừng máy chủ.`);
});
