import { ChartDataPoint, CoinListItem } from '../types';

const COINCAP_BASE_URL = 'https://api.coincap.io/v2';
const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com/data/v2';

// Popular coins on CoinCap
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
  try {
    const response = await fetch(`${COINCAP_BASE_URL}/assets/${coinId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${coinId} price`);
    }

    const result = await response.json();
    const coin = result.data;

    return {
      usd: parseFloat(coin.priceUsd),
      usd_24h_change: parseFloat(coin.changePercent24Hr),
      usd_24h_vol: parseFloat(coin.volumeUsd24Hr),
      usd_market_cap: parseFloat(coin.marketCapUsd),
      usd_24h_high: parseFloat(coin.priceUsd) * 1.02, // Approximate
      usd_24h_low: parseFloat(coin.priceUsd) * 0.98,  // Approximate
      last_updated_at: Date.now() / 1000,
    };
  } catch (error) {
    console.error(`Error fetching price for ${coinId}:`, error);
    throw error;
  }
};

export const fetchCoinChartData = async (coinId: string): Promise<ChartDataPoint[]> => {
  try {
    const end = Date.now();
    const start = end - 24 * 60 * 60 * 1000; // 24 hours ago

    const response = await fetch(
      `${COINCAP_BASE_URL}/assets/${coinId}/history?interval=h1&start=${start}&end=${end}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${coinId} chart data`);
    }

    const data = await response.json();
    
    return data.data.map((point: any) => ({
      time: Math.floor(point.time / 1000),
      value: parseFloat(point.priceUsd),
    }));
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error);
    throw error;
  }
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