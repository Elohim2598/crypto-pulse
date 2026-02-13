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
    console.log(`Fetching price data for: ${coinId}`);
    
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
    console.log(`Request URL: ${url}`);
    
    const response = await fetchWithRetry(url);
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinGecko error: ${response.status} - ${errorText}`);
      throw new Error(`CoinGecko returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched price data for ${coinId}`);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Price API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch price data',
      message: error.message 
    });
  }
}