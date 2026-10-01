import { useMemo, useRef, useEffect } from 'react';
import * as RUW from 'react-use-websocket';
import { useChain } from './useChain';
import { buildWebSocketUrl } from '../core/realtime/wsClient';

const { ReadyState } = RUW;

const useReactWebSocket =
  typeof RUW.default === 'function'
    ? RUW.default
    : typeof RUW.default?.default === 'function'
      ? RUW.default.default
      : RUW.useWebSocket;

const STATUS_MAP = {
  [ReadyState.UNINSTANTIATED]: 'idle',
  [ReadyState.CONNECTING]: 'connecting',
  [ReadyState.OPEN]: 'open',
  [ReadyState.CLOSING]: 'closing',
  [ReadyState.CLOSED]: 'closed',
};

const reconnectInterval = (attempt) => Math.min(30000, 1000 * 2 ** attempt);

export function useWebSocket(path, onMessage, { enabled = true, share = true, onReconnect } = {}) {
  const { chainId } = useChain();
  const hasConnectedRef = useRef(false);

  const url = useMemo(
    () => (enabled && path ? buildWebSocketUrl(path, chainId) : null),
    [enabled, path, chainId],
  );

  // url 变了(切代币/切链),重置"是否已连接过"的标志
  useEffect(() => {
    hasConnectedRef.current = false;
  }, [url]);

  const onReconnectRef = useRef(onReconnect);
  useEffect(() => { onReconnectRef.current = onReconnect; }, [onReconnect]);

  const onMessageRef = useRef(onMessage);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  const { readyState, sendJsonMessage } = useReactWebSocket(
    url,
    {
      share,
      retryOnError: true,
      shouldReconnect: () => true,
      reconnectAttempts: Number.MAX_SAFE_INTEGER,
      reconnectInterval,
      onOpen: () => {
        if (hasConnectedRef.current) {
          // 第二次及以后连上 = 重连
          onReconnectRef.current?.();
        }
        hasConnectedRef.current = true;
      },
      onMessage: (event) => {
        try {
          onMessageRef.current?.(JSON.parse(event.data));
        } catch (error) {
          console.error('[useWebSocket] failed to parse message:', error);
        }
      },
      // 如果后端支持心跳,把下面打开:
      // heartbeat: { message: 'ping', returnMessage: 'pong', timeout: 60000, interval: 25000 },
    },
    Boolean(url),
  );

  return {
    status: url ? STATUS_MAP[readyState] : 'idle',
    readyState,
    sendJsonMessage,
  };
}