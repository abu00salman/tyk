const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) app.quit();
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 900, minWidth: 660, minHeight: 540,
    backgroundColor: '#05060f', title: 'اختبر معلوماتك', show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true, spellcheck: false }
  });
  win.once('ready-to-show', () => win.show());
  win.on('page-title-updated', e => e.preventDefault());
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) { e.preventDefault(); shell.openExternal(url); } });
  win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
}

const template = process.platform === 'darwin'
  ? [{ role: 'appMenu' }, { label: 'عرض', submenu: [{ role: 'togglefullscreen', label: 'ملء الشاشة' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }] }, { role: 'windowMenu' }]
  : [{ label: 'عرض', submenu: [{ role: 'togglefullscreen', label: 'ملء الشاشة', accelerator: 'F11' }, { role: 'quit', label: 'خروج' }] }];

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
