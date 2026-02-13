import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { StatCard } from './components/StatCard/StatCard';
import { PriceChart } from './components/PriceChart/PriceChart';
import { NewsCard } from './components/NewsCard/NewsCard';
import { CoinSearch } from './components/CoinSearch/CoinSearch';
import { StatCardSkeleton, NewsCardSkeleton, ChartSkeleton } from './components/LoadingSkeleton/LoadingSkeleton';
import { ErrorState } from './components/ErrorState/ErrorState';
import { useCoinPrice } from './hooks/useCoinPrice';
import { useWebSocket } from './hooks/useWebSocket';
import { useCryptoNews } from './hooks/useCryptoNews';
import { fetchCoinChartData } from './services/api';
import { formatPrice, formatLargeNumber, formatPercentage } from './utils/formatters';
import { ChartDataPoint } from './types';
import { AIAnalysis } from './components/AIAnalysis/AIAnalysis';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [coinName, setCoinName] = useState('Bitcoin');
  const [coinSymbol, setCoinSymbol] = useState('BTC');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  const { price, isLoading: priceLoading, isError: priceError } = useCoinPrice(selectedCoin);
  const { livePrice, isConnected } = useWebSocket(selectedCoin);
  const { news, isLoading: newsLoading, isError: newsError } = useCryptoNews(coinSymbol);

  // Fetch chart data when coin changes
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setChartLoading(true);
        setChartError(null);
        setChartData([]);
        const data = await fetchCoinChartData(selectedCoin);
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart data:', error);
        setChartError('Failed to load chart data. Please try again.');
      } finally {
        setChartLoading(false);
      }
    };
    loadChartData();
  }, [selectedCoin]);

  const handleCoinSelect = (coinId: string, name: string, symbol: string) => {
    setSelectedCoin(coinId);
    setCoinName(name);
    setCoinSymbol(symbol);
  };

  const handleChartRetry = () => {
    const loadChartData = async () => {
      try {
        setChartLoading(true);
        setChartError(null);
        const data = await fetchCoinChartData(selectedCoin);
        setChartData(data);
      } catch (error) {
        setChartError('Failed to load chart data. Please try again.');
      } finally {
        setChartLoading(false);
      }
    };
    loadChartData();
  };

  const currentPrice = livePrice || price?.usd || 0;

  return (
    <div className="app">
      <Header />
      
      <main className="main">
        <CoinSearch selectedCoin={selectedCoin} onCoinSelect={handleCoinSelect} />

        {/* Stats Section */}
        <section className="stats-grid">
          {priceLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : priceError ? (
            <div className="stats-error">
              <ErrorState message="Failed to load price data" />
            </div>
          ) : (
            <>
              <StatCard
                label={`${coinName} Price`}
                value={formatPrice(currentPrice)}
                change={price ? formatPercentage(price.usd_24h_change) : undefined}
                isPositive={price ? price.usd_24h_change >= 0 : undefined}
              />
              <StatCard
                label="24h Volume"
                value={price ? `$${formatLargeNumber(price.usd_24h_vol)}` : 'N/A'}
              />
              <StatCard
                label="24h High / Low"
                value={
                  price 
                    ? `${formatPrice(price.usd_24h_high)} / ${formatPrice(price.usd_24h_low)}`
                    : 'N/A'
                }
              />
              <StatCard
                label="WebSocket"
                value={isConnected ? 'Live' : 'Offline'}
              />
            </>
          )}
        </section>

        {/* AI Analysis Button */}
{!priceLoading && !priceError && price && chartData.length > 0 && (
  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
    <AIAnalysis
      coinName={coinName}
      coinSymbol={coinSymbol}
      price={price}
      news={news || []}
      chartData={chartData}
    />
  </div>
)}

        {/* Chart Section */}
        {chartLoading ? (
          <ChartSkeleton />
        ) : chartError ? (
          <ErrorState message={chartError} onRetry={handleChartRetry} />
        ) : chartData.length > 0 ? (
          <PriceChart data={chartData} livePrice={livePrice || undefined} />
        ) : null}

        {/* News Section */}
        <section className="news-section">
          <h2 className="news-title">{coinName} News</h2>
          {newsLoading ? (
            <div className="news-grid">
              {[...Array(6)].map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : newsError ? (
            <ErrorState message="Failed to load news" />
          ) : news && news.length > 0 ? (
            <div className="news-grid">
              {news.slice(0, 6).map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
              ))}
            </div>
          ) : (
            <p className="loading">No news available for {coinName}</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;