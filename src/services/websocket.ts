export class CryptoWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;
  private wsUrl: string = 'wss://ws.coincap.io/prices';
  private currentSymbol: string = '';
  private onPriceUpdate: ((price: number) => void) | null = null;

  connect(coinId: string, onPriceUpdate: (price: number) => void) {
    // Map coin IDs to CoinCap asset IDs
    const coinMap: Record<string, string> = {
      'bitcoin': 'bitcoin',
      'ethereum': 'ethereum',
      'cardano': 'cardano',
      'ripple': 'xrp',
      'solana': 'solana',
      'polkadot': 'polkadot',
      'dogecoin': 'dogecoin',
      'avalanche': 'avalanche',
      'avalanche-2': 'avalanche',
      'polygon': 'polygon',
      'matic-network': 'polygon',
      'chainlink': 'chainlink',
    };

    const symbol = coinMap[coinId] || 'bitcoin';
    
    if (this.ws?.readyState === WebSocket.OPEN && this.currentSymbol === symbol) {
      console.log(`✅ Already connected to ${symbol.toUpperCase()}`);
      return;
    }

    if (this.ws) {
      this.disconnect();
    }

    this.currentSymbol = symbol;
    this.onPriceUpdate = onPriceUpdate;
    this.createConnection(symbol, onPriceUpdate);
  }

  private createConnection(symbol: string, onPriceUpdate: (price: number) => void) {
    try {
      console.log(`🔌 Connecting to CoinCap WebSocket for ${symbol.toUpperCase()}...`);
      
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log(`✅ WebSocket connected to ${symbol.toUpperCase()}`);
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // CoinCap sends all prices, filter for our coin
          if (data[symbol]) {
            const price = parseFloat(data[symbol]);
            if (!isNaN(price)) {
              onPriceUpdate(price);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      this.reconnectAttempts = 0;
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000);
    
    console.log(`🔄 Reconnecting in ${delay / 1000}s... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.currentSymbol && this.onPriceUpdate) {
        this.createConnection(this.currentSymbol, this.onPriceUpdate);
      }
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}