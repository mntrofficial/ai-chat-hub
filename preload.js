const { contextBridge, ipcRenderer } = require('electron');

// Базовая маскировка
delete Object.getPrototypeOf(navigator).webdriver;
Object.defineProperty(navigator, 'webdriver', { get: () => false });
Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU', 'ru', 'en-US'] });
if (!window.chrome) window.chrome = { runtime: {} };

contextBridge.exposeInMainWorld('electronAPI', {
  reloadWebview: () => ipcRenderer.send('reload-webview'),
  findInPage: (text, forward) => {
    const webview = document.getElementById('mainWebview');
    if (webview && webview.findInPage) webview.findInPage(text, { forward });
  }
});

ipcRenderer.on('reload-webview', () => {
  const webview = document.getElementById('mainWebview');
  if (webview) webview.reload();
});