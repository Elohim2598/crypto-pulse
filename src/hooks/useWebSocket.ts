import { useEffect, useState, useRef } from 'react';
import { CryptoWebSocket } from '../services/websocket';
import { COIN_TO_BINANCE } from '../types';

/**
 * Custom hook for real-time crypto price via WebSocket
 */
export const useWebSocket = (coinId: string) => {
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<CryptoWebSocket | null>(null);

  useEffect(() => {
    // Get Binance symbol from CoinGecko ID
    const binanceSymbol = COIN_TO_BINANCE[coinId];
    
    // If coin not supported on Binance, don't connect
    if (!binanceSymbol) {
      console.warn(`WebSocket not available for ${coinId}`);
      setIsConnected(false);
      setLivePrice(null);
      return;
    }

    // Create WebSocket instance if it doesn't exist
    if (!wsRef.current) {
      wsRef.current = new CryptoWebSocket();
    }

    // Connect to the coin's WebSocket stream
    wsRef.current.connect(binanceSymbol, (price) => {
      setLivePrice(price);
      setIsConnected(true);
    });

    // Cleanup on unmount or coin change
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
      setIsConnected(false);
      setLivePrice(null);
    };
  }, [coinId]); // Reconnect when coin changes

  return {
    livePrice,
    isConnected,
  };
};