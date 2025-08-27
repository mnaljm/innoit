// Tiny complaint server
// Usage: set environment variable DISCORD_WEBHOOK_URL to your Discord webhook URL
// Then run: node server.js

// Try to load a local .env (optional). If dotenv isn't installed, continue silently.
try { require('dotenv').config(); } catch (e) {}

const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3001;
const publicDir = path.join(__dirname, 'public');

function sendNotification(complaint) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return Promise.resolve();

  const payload = {
    content: `Ny klage fra **${complaint.name || 'Ukendt'}** — ${complaint.category}`,
    embeds: [
      {
        title: 'Klage',
        description: complaint.message || '-',
        fields: [
          { name: 'Tag', value: complaint.tag || '-', inline: true },
          { name: 'Tidspunkt', value: complaint.createdAt || '-', inline: true }
        ],
        color: 15105570
      }
    ]
  };

  return new Promise((resolve, reject) => {
    try {
      const url = new URL(webhook);
      const data = JSON.stringify(payload);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) return resolve();
          return reject(new Error(`Webhook failed ${res.statusCode}: ${body}`));
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // serve static files from public
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(publicDir, decodeURIComponent(filePath));
    if (!filePath.startsWith(publicDir)) { res.statusCode = 400; res.end('Invalid'); return; }

    fs.readFile(filePath, (err, data) => {
      if (err) { res.statusCode = 404; res.end('Not found'); return; }
      const ext = path.extname(filePath).toLowerCase();
      const map = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
      res.setHeader('Content-Type', map[ext] || 'application/octet-stream');
      res.end(data);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/complain') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const json = JSON.parse(body);
        // append to complaints log
        const logDir = path.join(__dirname, 'data');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
        const now = new Date().toISOString().replace(/[:.]/g,'-');
        const filename = path.join(logDir, `${now}.json`);
        fs.writeFileSync(filename, JSON.stringify(json, null, 2));

        // send discord webhook (if configured)
        await sendNotification(json).catch(err => console.error('Webhook error:', err));

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  res.statusCode = 404; res.end('Not found');
});

server.listen(PORT, () => console.log(`Complaint server running on http://localhost:${PORT}`));
