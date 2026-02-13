import { useQuery } from '@tanstack/react-query';
import { fetchCoinPrice } from '../services/api';
import { CoinPrice } from '../types';

/**
 * Custom hook to fetch current price and stats for any coin
 * Uses React Query for caching and automatic refetching
 */
export const useCoinPrice = (coinId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['coin-price', coinId], // Key includes coinId
    queryFn: async () => {
      const response = await fetchCoinPrice(coinId);
      return response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Data stays fresh for 10 seconds
    enabled: !!coinId, // Only fetch if coinId is provided
  });

  return {
    price: data as CoinPrice | undefined,
    isLoading,
    isError,
    error,
  };
};