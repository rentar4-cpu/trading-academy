const DEFAULT_ANDROID_API_BASE = 'https://shaped-cookie-dangerous-wal.trycloudflare.com';
const REMOTE_ANDROID_CONFIG_URL =
  'https://raw.githubusercontent.com/rentar4-cpu/trading-academy/master/public/mobile-config.json';
const REMOTE_ANDROID_CONFIG_TIMEOUT_MS = 2500;

function normalizeMarketApiBase(value) {
  const input = String(value || '').trim();
  if (!input) return '';

  const withProtocol = /^https?:\/\//i.test(input)
    ? input
    : `http://${input}`;

  try {
    const url = new URL(withProtocol);
    return `${url.protocol}//${url.host}`;
  } catch {
    return input.replace(/\/+$/, '');
  }
}

function isPackagedApp() {
  try {
    if (window.Capacitor?.isNativePlatform?.()) return true;
  } catch {
    // Fall through to the local WebView origin check.
  }

  return (
    window.location.protocol === 'http:' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
    !window.location.port
  );
}

const savedApiBase = normalizeMarketApiBase(
  localStorage.getItem('market_api_base_url'),
);
const configuredApiBase = normalizeMarketApiBase(window.MARKET_API_BASE);
const packagedApp = isPackagedApp();

if (packagedApp) {
  localStorage.removeItem('market_api_base_url');
}

window.DEFAULT_MARKET_API_BASE = DEFAULT_ANDROID_API_BASE;
window.REMOTE_ANDROID_CONFIG_URL = REMOTE_ANDROID_CONFIG_URL;
window.MARKET_API_BASE =
  (packagedApp ? DEFAULT_ANDROID_API_BASE : '') ||
  savedApiBase ||
  configuredApiBase;
window.MARKET_API_SOURCE = packagedApp ? 'android-default' : 'browser';

window.normalizeMarketApiBase = normalizeMarketApiBase;

function applyMarketApiBase(value, source) {
  const normalized = normalizeMarketApiBase(value);
  if (!normalized) return '';

  window.MARKET_API_BASE = normalized;
  window.MARKET_API_SOURCE = source;
  return normalized;
}

function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, {
    cache: 'no-store',
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Remote config failed: ${response.status}`);
      }
      return response.json();
    })
    .finally(() => clearTimeout(timeout));
}

async function loadRemoteAndroidConfig() {
  if (!packagedApp) return window.MARKET_API_BASE;

  try {
    const cacheBuster = `t=${Date.now()}`;
    const separator = REMOTE_ANDROID_CONFIG_URL.includes('?') ? '&' : '?';
    const config = await fetchJsonWithTimeout(
      `${REMOTE_ANDROID_CONFIG_URL}${separator}${cacheBuster}`,
      REMOTE_ANDROID_CONFIG_TIMEOUT_MS,
    );

    if (config?.enabled === false) return window.MARKET_API_BASE;

    const remoteBase = applyMarketApiBase(
      config?.apiBase || config?.api_base || config?.serverUrl,
      'android-remote-config',
    );

    if (remoteBase) return remoteBase;
  } catch (error) {
    window.MARKET_API_CONFIG_ERROR = error?.message || String(error);
  }

  return window.MARKET_API_BASE;
}

window.marketRuntimeReady = loadRemoteAndroidConfig();

window.setMarketApiBase = function setMarketApiBase(value) {
  if (packagedApp) {
    applyMarketApiBase(DEFAULT_ANDROID_API_BASE, 'android-default');
    return window.MARKET_API_BASE;
  }

  const normalized = normalizeMarketApiBase(value);

  if (normalized) {
    localStorage.setItem('market_api_base_url', normalized);
  } else {
    localStorage.removeItem('market_api_base_url');
  }

  window.MARKET_API_BASE = normalized;
  window.MARKET_API_SOURCE = normalized ? 'browser-saved' : 'browser';
  return window.MARKET_API_BASE;
};

window.marketApiUrl = function marketApiUrl(path) {
  const base = normalizeMarketApiBase(window.MARKET_API_BASE);
  if (!base) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

window.marketApiJson = async function marketApiJson(path, options = {}) {
  if (window.marketRuntimeReady) {
    await window.marketRuntimeReady;
  }

  const requestUrl = window.marketApiUrl(path);
  let response;

  try {
    response = await fetch(requestUrl, options);
  } catch (cause) {
    const error = new Error(
      `Cannot reach the data server at ${window.MARKET_API_BASE || requestUrl}`,
    );
    error.code = 'MARKET_API_UNREACHABLE';
    error.cause = cause;
    error.requestUrl = requestUrl;
    throw error;
  }

  const body = await response.text();
  const trimmedBody = body.trim();
  const looksLikeHtml = /^(?:<!doctype\s+html|<html[\s>])/i.test(trimmedBody);
  let data;

  if (trimmedBody) {
    try {
      data = JSON.parse(trimmedBody);
    } catch (cause) {
      const error = new Error(
        looksLikeHtml
          ? 'The server address opened an app page instead of the data API'
          : 'The server returned data in an unsupported format',
      );
      error.code = looksLikeHtml
        ? 'MARKET_API_HTML_RESPONSE'
        : 'MARKET_API_INVALID_JSON';
      error.cause = cause;
      error.requestUrl = requestUrl;
      throw error;
    }
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || body || `Request failed: ${response.status}`;
    const error = new Error(message);
    error.code = 'MARKET_API_HTTP_ERROR';
    error.status = response.status;
    error.requestUrl = requestUrl;
    throw error;
  }

  return data;
};
