const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/admin' || reqPath === '/admin/') reqPath = '/admin/index.html';
  if (reqPath === '/money-garlands') reqPath = '/money-garlands.html';
  if (reqPath === '/bouquets') reqPath = '/bouquets.html';
  if (reqPath === '/customized-hampers') reqPath = '/customized-hampers.html';
  if (reqPath === '/wedding-gifting') reqPath = '/wedding-gifting.html';
  if (reqPath === '/customized-gifts') reqPath = '/customized-gifts.html';
  if (reqPath === '/luxury-addons') reqPath = '/luxury-addons.html';
  if (reqPath === '/sitemap') reqPath = '/sitemap.html';
  if (reqPath === '/privacy-policy' || reqPath === '/policy') reqPath = '/privacy-policy.html';
  if (reqPath === '/terms-and-conditions' || reqPath === '/terms') reqPath = '/terms-and-conditions.html';
  if (reqPath === '/refund-policy' || reqPath === '/refunds' || reqPath === '/cancellation-policy') reqPath = '/refund-policy.html';

  if (req.method === 'POST' && reqPath === '/api/save-thumbnail') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { filename, base64 } = JSON.parse(body);
        const data = base64.replace(/^data:image\/\w+;base64,/, '');
        const target = path.join(ROOT, 'assets', 'images', filename);
        fs.writeFileSync(target, Buffer.from(data, 'base64'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, file: target }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  let filePath = path.join(ROOT, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const basename = path.basename(reqPath);
    const videoCandidate = path.join(ROOT, 'assets', 'videos', basename);
    const imageCandidate = path.join(ROOT, 'assets', 'images', basename);
    const reelCandidate = path.join(ROOT, 'assets', 'reels', basename);
    if (fs.existsSync(videoCandidate) && fs.statSync(videoCandidate).isFile()) {
      filePath = videoCandidate;
    } else if (fs.existsSync(imageCandidate) && fs.statSync(imageCandidate).isFile()) {
      filePath = imageCandidate;
    } else if (fs.existsSync(reelCandidate) && fs.statSync(reelCandidate).isFile()) {
      filePath = reelCandidate;
    }
  }

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // HTTP 206 Range Request support for lag-free, instant video streaming & seeking
    if (ext === '.mp4' || ext === '.webm' || ext === '.ogg') {
      const range = req.headers.range;
      const fileSize = stats.size;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
          res.writeHead(416, {
            'Content-Range': `bytes */${fileSize}`
          });
          return res.end();
        }

        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400'
        });
        file.pipe(res);
        return;
      }

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const headers = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };

    if (ext === '.html' || ext === '.js' || ext === '.css' || ext === '.json') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('\n==================================================');
  console.log('  Bloom&blush - Boutique Local Development Server');
  console.log('==================================================');
  console.log(`  Main Website:   http://localhost:${PORT}/`);
  console.log(`  Owner Portal:   http://localhost:${PORT}/admin/`);
  console.log('==================================================\n');
});
