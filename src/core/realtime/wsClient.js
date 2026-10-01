import { env } from '../../config/env';

export function buildWebSocketUrl(path, chainId) {
  const base = new URL(env.wsBaseUrl);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  base.pathname = `${base.pathname.replace(/\/$/, '')}${cleanPath}`;
  if (chainId) base.searchParams.set('chain', chainId);
  return base.toString();
}
