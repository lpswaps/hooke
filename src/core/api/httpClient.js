import { env } from '../../config/env';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function httpRequest(path, { chainId, signal, ...options } = {}) {
  const url = new URL(joinUrl(env.apiBaseUrl, path));
  if (chainId) url.searchParams.set('chain', chainId);

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (chainId) headers.set('X-Chain-Id', chainId);

  const response = await fetch(url.toString(), {
    ...options,
    headers,
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Empty response body is valid for some endpoints.
  }

  if (!response.ok) {
    throw new ApiError(data?.error || `Request failed: ${response.status}`, response.status, data);
  }

  return data;
}

export function buildQueryString(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  const value = query.toString();
  return value ? `?${value}` : '';
}
