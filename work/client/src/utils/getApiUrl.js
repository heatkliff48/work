export const getApiUrl = () => {
  const localUrl = process.env.REACT_APP_LOCAL_URL;
  const tailscaleUrl = process.env.REACT_APP_TAILSCALE_URL;

  if (window.location.hostname.includes('ts.net')) {
    return tailscaleUrl;
  }

  return localUrl || window.location.origin + ':3001';
};
