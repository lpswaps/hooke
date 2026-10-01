const required = (value, fallback) => value || fallback;

export const env = Object.freeze({
  apiBaseUrl: required(import.meta.env.VITE_API_BASE_URL, 'http://localhost:4000'),
  wsBaseUrl: required(import.meta.env.VITE_WS_BASE_URL, 'ws://localhost:4002'),
  nodeEnv: import.meta.env.MODE || 'development',
});