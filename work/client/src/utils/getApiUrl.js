const removeTrailingSlashes = (url) => {
  return url.replace(/\/+$/, '');
};

const normalizePath = (path) => {
  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

export const getApiUrl = () => {
  const configuredApiUrl = process.env.REACT_APP_URL?.trim();

  if (configuredApiUrl) {
    return removeTrailingSlashes(configuredApiUrl);
  }

  const hostname = window.location.hostname;

  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

  return `${protocol}//${hostname}:3001`;
};

export const getWebSocketUrl = (path = '') => {
  const configuredWebSocketUrl = process.env.REACT_APP_URL_SOCKET?.trim();

  const socketPath = normalizePath(path);

  if (configuredWebSocketUrl) {
    return `${removeTrailingSlashes(configuredWebSocketUrl)}${socketPath}`;
  }

  const apiUrl = new URL(getApiUrl());

  const webSocketProtocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';

  return `${webSocketProtocol}//${apiUrl.host}${socketPath}`;
};
