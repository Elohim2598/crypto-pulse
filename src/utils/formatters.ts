/**
 * Format a number as USD currency
 * Example: 50000 → "$50,000.00"
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Format large numbers with abbreviations
 * Example: 25000000000 → "25.00B"
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`; // Trillion
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;   // Billion
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;   // Million
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;   // Thousand
  return num.toFixed(2);
};

/**
 * Format percentage with + or - sign
 * Example: 2.5 → "+2.50%", -1.3 → "-1.30%"
 */
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

/**
 * Format relative time (e.g., "2 hours ago", "5 minutes ago")
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

/**
 * Get color class based on positive/negative value
 */
export const getPriceChangeColor = (change: number): string => {
  return change >= 0 ? 'positive' : 'negative';
};