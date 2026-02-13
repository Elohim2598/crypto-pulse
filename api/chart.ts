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
    
    // Get hourly data for last 24 hours from CryptoCompare
    const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=24`;
    console.log(`Request URL: ${url}`);
    
    const response = await fetch(url);
    
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
      point.time * 1000, // Convert to milliseconds
      point.close
    ]);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.status(200).json({ prices });
  } catch (error: any) {
    console.error('Chart API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch chart data',
      message: error.message 
    });
  }
}