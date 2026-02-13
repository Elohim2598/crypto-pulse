// Coin list item from CoinGecko
export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
}

// Mapping for Binance WebSocket symbols
// export const COIN_TO_BINANCE: Record<string, string> = {
//   'bitcoin': 'btc',
//   'ethereum': 'eth',
//   'cardano': 'ada',
//   'ripple': 'xrp',
//   'solana': 'sol',
//   'polkadot': 'dot',
//   'dogecoin': 'doge',
//   'avalanche-2': 'avax',
//   'matic-network': 'matic',
//   'chainlink': 'link',
// };

// Coin price data from CoinGecko API (works for any coin, not just Bitcoin)
export interface CoinPrice {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
  usd_24h_high: number;    // ← Add this
  usd_24h_low: number;     // ← Add this
  last_updated_at: number;
}

// Chart data point (for the price chart)
export interface ChartDataPoint {
  time: number; // Unix timestamp
  value: number; // Price in USD
}

// News article from CryptoCompare API
export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source: {
    title: string;
    region: string;
  };
  currencies: Array<{
    code: string;
    title: string;
  }>;
}

// WebSocket message from Binance
export interface WebSocketMessage {
  e: string; // Event type
  s: string; // Symbol (BTCUSDT)
  p: string; // Price
  E: number; // Event time
}

// API Response types - removed specific bitcoin reference
export interface CoinGeckoResponse {
  [coinId: string]: CoinPrice; // Dynamic key based on coin
}

export interface CryptoNewsResponse {
  results: NewsArticle[];
}