import { WebSocketMessage } from '../types';

type PriceCallback = (price: number) => void;

export class CryptoWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private wsUrl: string = '';
  private callback: PriceCallback | null = null;
  private reconnectTimeout: number | null = null;
  private currentSymbol: string = '';

  /**
   * Connect to Binance WebSocket for real-time price
   * @param symbol - Binance symbol (e.g., 'btc', 'eth', 'ada')
   */
  connect(symbol: string, onPriceUpdate: PriceCallback): void {
    // If already connected to this symbol, don't reconnect
    if (this.currentSymbol === symbol && this.isConnected()) {
      return;
    }

    // Disconnect existing connection
    if (this.ws) {
      this.disconnect();
    }

    this.currentSymbol = symbol;
    this.wsUrl = `wss://stream.binance.com:9443/ws/${symbol}usdt@trade`;
    this.callback = onPriceUpdate;
    this.createConnection();
  }

  private createConnection(): void {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log(`WebSocket connected to ${this.currentSymbol.toUpperCase()}`);
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          const price = parseFloat(data.p);
          
          if (this.callback && !isNaN(price)) {
            this.callback(price);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Giving up.');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`🔄 Reconnecting in ${delay / 1000}s... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = window.setTimeout(() => {
      this.createConnection();
    }, delay);
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.callback = null;
    this.reconnectAttempts = 0;
    this.currentSymbol = '';
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}