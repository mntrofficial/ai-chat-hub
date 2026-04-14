const webview = document.getElementById('mainWebview');
const serviceBtns = document.querySelectorAll('.service-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevMatchBtn = document.getElementById('prevMatchBtn');
const nextMatchBtn = document.getElementById('nextMatchBtn');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const sidebar = document.getElementById('sidebar');
const errorOverlay = document.getElementById('errorOverlay');
const reloadBtn = document.getElementById('reloadBtn');

let currentSearchText = '';
let currentMatchCount = 0;

// Сворачивание панели
let sidebarCollapsed = false;
toggleSidebarBtn.addEventListener('click', () => {
  sidebarCollapsed = !sidebarCollapsed;
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
});

// Переключение сервиса
function switchService(url) {
  webview.src = url;
  errorOverlay.classList.add('hidden');
}

// Обработка ошибок
function showError() {
  errorOverlay.classList.remove('hidden');
}
function reloadWebview() {
  webview.reload();
  errorOverlay.classList.add('hidden');
}

function attachEvents(wv) {
  wv.addEventListener('did-find-in-page', (e) => {
    currentMatchCount = e.matches;
    updateSearchStatus();
  });
  wv.addEventListener('dom-ready', () => {
    if (currentSearchText) wv.findInPage(currentSearchText, { forward: true });
  });
  wv.addEventListener('did-fail-load', (e) => {
    console.error('Ошибка загрузки:', e);
    showError();
  });
}

// Поиск
function startSearch(forward = true) {
  const text = searchInput.value.trim();
  if (!text) return;
  currentSearchText = text;
  webview.findInPage(currentSearchText, { forward });
}
function findNext() { if (currentSearchText) webview.findInPage(currentSearchText, { forward: true }); }
function findPrev() { if (currentSearchText) webview.findInPage(currentSearchText, { forward: false }); }
function updateSearchStatus() {
  console.log(`Найдено: ${currentMatchCount}`);
}

// Назначение обработчиков
serviceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    if (!url) return;
    serviceBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    switchService(url);
  });
});

searchBtn.addEventListener('click', () => startSearch(true));
nextMatchBtn.addEventListener('click', findNext);
prevMatchBtn.addEventListener('click', findPrev);
reloadBtn.addEventListener('click', reloadWebview);

attachEvents(webview);
window.webview = webview;