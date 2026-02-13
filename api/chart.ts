async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      // If rate limited, wait and retry
      if (response.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

export default async function handler(req: any, res: any) {
  const { coinId } = req.query;

  if (!coinId || typeof coinId !== 'string') {
    return res.status(400).json({ error: 'coinId is required' });
  }

  try {
    // Map coin IDs to symbols for CryptoCompare
    const coinSymbols: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'cardano': 'ADA',
      'ripple': 'XRP',
      'solana': 'SOL',
      'polkadot': 'DOT',
      'dogecoin': 'DOGE',
      'avalanche-2': 'AVAX',
      'matic-network': 'MATIC',
      'chainlink': 'LINK',
    };

    const symbol = coinSymbols[coinId] || 'BTC';
    
    console.log(`Fetching chart data for: ${coinId} (${symbol})`);
    
    const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=24`;
    console.log(`Request URL: ${url}`);
    
    const response = await fetchWithRetry(url);
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CryptoCompare error: ${response.status} - ${errorText}`);
      throw new Error(`CryptoCompare returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched chart data for ${symbol}`);
    
    // Transform to match expected format
    const prices = data.Data.Data.map((point: any) => [
      point.time * 1000,
      point.close
    ]);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json({ prices });
  } catch (error: any) {
    console.error('Chart API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch chart data',
      message: error.message 
    });
  }
}