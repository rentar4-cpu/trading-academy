window.MARKET_API_BASE = localStorage.getItem('market_api_base_url') || window.MARKET_API_BASE || '';

window.marketApiUrl = function marketApiUrl(path) {
  const base = (window.MARKET_API_BASE || '').replace(/\/$/, '');
  if (!base) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};
