export class CryptoWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;
  private currentSymbol: string = '';
  private onPriceUpdate: ((price: number) => void) | null = null;

  connect(coinId: string, onPriceUpdate: (price: number) => void) {
    // Map coin IDs to Kraken pairs
    const coinMap: Record<string, string> = {
      'bitcoin': 'XBT/USD',
      'ethereum': 'ETH/USD',
      'cardano': 'ADA/USD',
      'ripple': 'XRP/USD',
      'solana': 'SOL/USD',
      'polkadot': 'DOT/USD',
      'dogecoin': 'DOGE/USD',
      'avalanche': 'AVAX/USD',
      'avalanche-2': 'AVAX/USD',
      'polygon': 'MATIC/USD',
      'matic-network': 'MATIC/USD',
      'chainlink': 'LINK/USD',
    };

    const symbol = coinMap[coinId] || 'XBT/USD';
    
    if (this.ws?.readyState === WebSocket.OPEN && this.currentSymbol === symbol) {
      console.log(`✅ Already connected to ${symbol}`);
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
      console.log(`🔌 Connecting to Kraken WebSocket for ${symbol}...`);
      
      this.ws = new WebSocket('wss://ws.kraken.com');

      this.ws.onopen = () => {
        console.log(`✅ WebSocket connected to ${symbol}`);
        this.reconnectAttempts = 0;
        
        // Subscribe to ticker for this pair
        const subscribeMsg = {
          event: 'subscribe',
          pair: [symbol],
          subscription: { name: 'ticker' }
        };
        
        this.ws?.send(JSON.stringify(subscribeMsg));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Kraken ticker format: [channelID, data, channelName, pair]
          if (Array.isArray(data) && data[2] === 'ticker') {
            const tickerData = data[1];
            // tickerData.c is [price, volume] - we want the price
            const price = parseFloat(tickerData.c[0]);
            
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
      // Unsubscribe before closing
      if (this.ws.readyState === WebSocket.OPEN && this.currentSymbol) {
        const unsubscribeMsg = {
          event: 'unsubscribe',
          pair: [this.currentSymbol],
          subscription: { name: 'ticker' }
        };
        this.ws.send(JSON.stringify(unsubscribeMsg));
      }
      
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}export class CryptoWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;
  private currentSymbol: string = '';
  private onPriceUpdate: ((price: number) => void) | null = null;

  connect(coinId: string, onPriceUpdate: (price: number) => void) {
    // Map coin IDs to Kraken pairs
    const coinMap: Record<string, string> = {
      'bitcoin': 'XBT/USD',
      'ethereum': 'ETH/USD',
      'cardano': 'ADA/USD',
      'ripple': 'XRP/USD',
      'solana': 'SOL/USD',
      'polkadot': 'DOT/USD',
      'dogecoin': 'DOGE/USD',
      'avalanche': 'AVAX/USD',
      'avalanche-2': 'AVAX/USD',
      'polygon': 'MATIC/USD',
      'matic-network': 'MATIC/USD',
      'chainlink': 'LINK/USD',
    };

    const symbol = coinMap[coinId] || 'XBT/USD';
    
    if (this.ws?.readyState === WebSocket.OPEN && this.currentSymbol === symbol) {
      console.log(`✅ Already connected to ${symbol}`);
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
      console.log(`🔌 Connecting to Kraken WebSocket for ${symbol}...`);
      
      this.ws = new WebSocket('wss://ws.kraken.com');

      this.ws.onopen = () => {
        console.log(`✅ WebSocket connected to ${symbol}`);
        this.reconnectAttempts = 0;
        
        // Subscribe to ticker for this pair
        const subscribeMsg = {
          event: 'subscribe',
          pair: [symbol],
          subscription: { name: 'ticker' }
        };
        
        this.ws?.send(JSON.stringify(subscribeMsg));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Kraken ticker format: [channelID, data, channelName, pair]
          if (Array.isArray(data) && data[2] === 'ticker') {
            const tickerData = data[1];
            // tickerData.c is [price, volume] - we want the price
            const price = parseFloat(tickerData.c[0]);
            
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
      // Unsubscribe before closing
      if (this.ws.readyState === WebSocket.OPEN && this.currentSymbol) {
        const unsubscribeMsg = {
          event: 'unsubscribe',
          pair: [this.currentSymbol],
          subscription: { name: 'ticker' }
        };
        this.ws.send(JSON.stringify(unsubscribeMsg));
      }
      
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}