import { ChartDataPoint, CoinListItem } from '../types';

const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com/data/v2';

const POPULAR_COINS: CoinListItem[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP' },
  { id: 'solana', symbol: 'sol', name: 'Solana' },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche' },
  { id: 'matic-network', symbol: 'matic', name: 'Polygon' },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink' },
];

export const fetchCoinsList = async (): Promise<CoinListItem[]> => {
  return POPULAR_COINS;
};

export const fetchCoinPrice = async (coinId: string): Promise<any> => {
  try {
    // Call our Vercel serverless function
    const response = await fetch(`/api/price?coinId=${coinId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${coinId} price`);
    }

    const data = await response.json();
    const coinData = data[coinId];

    if (!coinData) {
      throw new Error(`No data found for ${coinId}`);
    }

    return {
      usd: coinData.usd,
      usd_24h_change: coinData.usd_24h_change || 0,
      usd_24h_vol: coinData.usd_24h_vol || 0,
      usd_market_cap: coinData.usd_market_cap || 0,
      usd_24h_high: coinData.usd || 0,
      usd_24h_low: coinData.usd || 0,
      last_updated_at: Date.now() / 1000,
    };
  } catch (error) {
    console.error(`Error fetching price for ${coinId}:`, error);
    throw error;
  }
};

export const fetchCoinChartData = async (coinId: string): Promise<ChartDataPoint[]> => {
  try {
    // Call our Vercel serverless function
    const response = await fetch(`/api/chart?coinId=${coinId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${coinId} chart data`);
    }

    const data = await response.json();
    
    if (!data.prices || data.prices.length === 0) {
      throw new Error(`No chart data available for ${coinId}`);
    }

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: Math.floor(timestamp / 1000),
      value: price,
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