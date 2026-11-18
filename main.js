const { app, BrowserWindow, Menu } = require('electron');
const path = require('path'), http = require('http'), fs = require('fs');

const ROOT = path.join(__dirname, 'src');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.glb': 'model/gltf-binary', '.png': 'image/png', '.json': 'application/json', '.txt': 'text/plain' };

// Serve the game from a local-only HTTP server so ES modules and 3D model loading work.
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.normalize(path.join(ROOT, decodeURIComponent(req.url.split('?')[0]))); 
      if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      fs.readFile(p.endsWith(path.sep) ? path.join(p, 'index.html') : p, (err, data) => {
        if (err) { rsp.writeHead(404); return rsp.end(); }
        rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); rsp.end(data);
      });
    });
    srv.listen(0, '127.0.0.1', () => res(srv.address().port));
  });
}

async function createWindow() {
  const port = await serve();
  const win = new BrowserWindow({
    width: 1400, height: 860, minWidth: 1100, minHeight: 720,
    backgroundColor: '#120d08', title: 'Realm of Embers',
    icon: path.join(ROOT, 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  win.loadURL(`http://127.0.0.1:${port}/index.html`);
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
