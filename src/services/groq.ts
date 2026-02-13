import { CoinPrice, NewsArticle, ChartDataPoint } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const analyzeMarketData = async (
  coinName: string,
  coinSymbol: string,
  price: CoinPrice,
  news: NewsArticle[],
  chartData: ChartDataPoint[]
): Promise<string> => {
  // Prepare chart analysis
  const prices = chartData.map(d => d.value);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = prices[prices.length - 1];
  const priceChange = ((currentPrice - prices[0]) / prices[0]) * 100;

  // Prepare news summary
  const newsHeadlines = news.slice(0, 5).map(n => `- ${n.title}`).join('\n');

  const prompt = `You are a cryptocurrency market analyst. Analyze the following data for ${coinName} (${coinSymbol}) and provide actionable insights.

**Current Market Data:**
- Price: $${price.usd.toLocaleString()}
- 24h Change: ${price.usd_24h_change.toFixed(2)}%
- 24h High: $${price.usd_24h_high.toLocaleString()}
- 24h Low: $${price.usd_24h_low.toLocaleString()}
- 24h Volume: $${price.usd_24h_vol.toLocaleString()}

**24-Hour Chart Analysis:**
- Average Price: $${avgPrice.toFixed(2)}
- Price Range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}
- Overall Trend: ${priceChange > 0 ? 'Up' : 'Down'} ${Math.abs(priceChange).toFixed(2)}%

**Recent News Headlines:**
${newsHeadlines || 'No recent news available'}

Please provide a concise analysis covering:
1. **Price Trend**: Current momentum and direction
2. **News Sentiment**: Overall market sentiment from news (Bullish/Bearish/Neutral)
3. **Technical Analysis**: Support/resistance levels and patterns
4. **Short-term Outlook**: What to watch for in the next 24-48 hours

Keep it concise, professional, and actionable. Use bullet points for clarity.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
        body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Updated to current model
        messages: [
            {
            role: 'user',
            content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error response:', errorData);
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
};