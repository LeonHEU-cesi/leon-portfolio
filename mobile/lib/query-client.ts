import { QueryClient } from '@tanstack/react-query';

// Singleton : évite de recréer le client à chaque rendu.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});
