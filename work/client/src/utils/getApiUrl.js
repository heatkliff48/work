export const getApiUrl = () => {
  const hostname = window.location.hostname;

  // Проверяем и DNS-имя Tailscale, и IP-адрес Tailscale
  if (hostname.includes('ts.net') || hostname.startsWith('100.')) {
    // Используем тот же IP/хост, что и для фронтенда, но с портом бэкенда
    return `http://${hostname}:3001`;
  }

  // Локальная разработка
  const localUrl =
    process.env.REACT_APP_LOCAL_URL || 'http://192.168.0.101:3001';
  return localUrl;
};

export const getWebSocketUrl = (path = '') => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

  let port;
  if (hostname.includes('ts.net') || hostname.startsWith('100.')) {
    port = ':3001';
  } else {
    port = ':3001'; // Или определите порт из переменной окружения
  }

  return `${protocol}//${hostname}${port}${path}`;
};
