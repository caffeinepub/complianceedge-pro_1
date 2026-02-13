import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useBackendHealthCheck() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['backendHealth'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const result = await actor.backendHealthCheck();
        return result === true;
      } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  return {
    isHealthy: query.data === true,
    isChecking: query.isLoading || query.isFetching,
    isError: query.isError || query.data === false,
    refetch: query.refetch,
  };
}
