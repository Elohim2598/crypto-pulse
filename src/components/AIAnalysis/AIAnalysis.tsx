import { useState } from 'react';
import { analyzeMarketData } from '../../services/groq';
import { CoinPrice, NewsArticle, ChartDataPoint } from '../../types';
import styles from './AIAnalysis.module.css';

interface AIAnalysisProps {
  coinName: string;
  coinSymbol: string;
  price: CoinPrice;
  news: NewsArticle[];
  chartData: ChartDataPoint[];
}

// Helper function to format markdown-like text
const formatAnalysis = (text: string) => {
  return text
    // Bold text: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet points with proper indentation
    .replace(/^[\*•]\s+/gm, '&nbsp;&nbsp;• ')
    .replace(/^\s+[\*•]\s+/gm, '&nbsp;&nbsp;&nbsp;&nbsp;• ')
    // Line breaks for better readability
    .replace(/\n/g, '<br/>');
};

export const AIAnalysis = ({ coinName, coinSymbol, price, news, chartData }: AIAnalysisProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const result = await analyzeMarketData(coinName, coinSymbol, price, news, chartData);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setAnalysis('');
    setError(null);
  };

  return (
    <>
      {/* Trigger Button */}
      <button className={styles.triggerButton} onClick={handleAnalyze}>
        AI Analysis
      </button>

      {/* Modal */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>
                AI Market Analysis - {coinName}
              </h2>
              <button className={styles.closeButton} onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className={styles.content}>
              {isLoading && (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>Analyzing market data...</p>
                </div>
              )}

              {error && (
                <div className={styles.error}>
                  <p>⚠️ {error}</p>
                  <button className={styles.retryButton} onClick={handleAnalyze}>
                    Try Again
                  </button>
                </div>
              )}

              {analysis && !isLoading && (
                <div className={styles.analysis}>
                  <div className={styles.badge}>Powered by Groq + Llama 3.3</div>
                  <div 
                    className={styles.text}
                    dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};