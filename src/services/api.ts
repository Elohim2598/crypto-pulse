import { ChartDataPoint, CoinListItem } from '../types';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';
const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com/data/v2';

// Hardcoded popular coins (since Binance doesn't have a full list endpoint)
const POPULAR_COINS: CoinListItem[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP' },
  { id: 'solana', symbol: 'sol', name: 'Solana' },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
  { id: 'avalanche', symbol: 'avax', name: 'Avalanche' },
  { id: 'polygon', symbol: 'matic', name: 'Polygon' },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink' },
];

export const fetchCoinsList = async (): Promise<CoinListItem[]> => {
  return POPULAR_COINS;
};

export const fetchCoinPrice = async (coinId: string): Promise<any> => {
  const coin = POPULAR_COINS.find(c => c.id === coinId);
  if (!coin) throw new Error('Coin not found');

  const symbol = `${coin.symbol.toUpperCase()}USDT`;
  
  const [ticker, stats] = await Promise.all([
    fetch(`${BINANCE_BASE_URL}/ticker/24hr?symbol=${symbol}`).then(r => r.json()),
    fetch(`${BINANCE_BASE_URL}/ticker/price?symbol=${symbol}`).then(r => r.json()),
  ]);

  return {
    usd: parseFloat(stats.price),
    usd_24h_change: parseFloat(ticker.priceChangePercent),
    usd_24h_vol: parseFloat(ticker.volume) * parseFloat(stats.price),
    usd_market_cap: 0, // Binance doesn't provide market cap
    usd_24h_high: parseFloat(ticker.highPrice),   // ← Add this
    usd_24h_low: parseFloat(ticker.lowPrice),     // ← Add this
    last_updated_at: Date.now() / 1000,
  };
};

export const fetchCoinChartData = async (coinId: string): Promise<ChartDataPoint[]> => {
  const coin = POPULAR_COINS.find(c => c.id === coinId);
  if (!coin) throw new Error('Coin not found');

  const symbol = `${coin.symbol.toUpperCase()}USDT`;
  
  const response = await fetch(
    `${BINANCE_BASE_URL}/klines?symbol=${symbol}&interval=1h&limit=24`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${coinId} chart data`);
  }

  const data = await response.json();
  
  return data.map((candle: any) => ({
    time: Math.floor(candle[0] / 1000),
    value: parseFloat(candle[4]), // Close price
  }));
};

export const fetchCryptoNews = async (coinSymbol: string = 'BTC'): Promise<any> => {
  const response = await fetch(
    `${CRYPTOCOMPARE_BASE_URL}/news/?lang=EN&categories=${coinSymbol.toUpperCase()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch crypto news');
  }

  const data = await response.json();
  
  return {
    results: data.Data.map((article: any) => ({
      id: article.id,
      title: article.title,
      url: article.url,
      published_at: new Date(article.published_on * 1000).toISOString(),
      source: {
        title: article.source_info.name,
        region: 'en',
      },
      currencies: [{ code: coinSymbol.toUpperCase(), title: coinSymbol }],
    })),
  };
};