import { useQuery } from '@tanstack/react-query';
import { fetchCryptoNews } from '../services/api';
import { NewsArticle } from '../types';

/**
 * Custom hook to fetch latest crypto news for a specific coin
 */
export const useCryptoNews = (coinSymbol: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['crypto-news', coinSymbol], // Key includes coin symbol
    queryFn: async () => {
      const response = await fetchCryptoNews(coinSymbol);
      return response.results;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Data stays fresh for 30 seconds
    enabled: !!coinSymbol, // Only fetch if coinSymbol is provided
  });

  return {
    news: data as NewsArticle[] | undefined,
    isLoading,
    isError,
    error,
  };
};