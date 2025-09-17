import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { githubBotAPI } from '@/lib/services/github-bot-api';
import type {
  ResearchResultsParams,
  ColbyCommandsParams,
  BestPracticesParams,
  Repository,
  ColbyCommand,
  BestPractice,
  Operation,
  StatsResponse,
  ResearchStatusResponse,
} from '@/types/api';

// Query Keys
export const queryKeys = {
  health: ['health'] as const,
  research: {
    results: (params?: ResearchResultsParams) => ['research', 'results', params] as const,
    status: ['research', 'status'] as const,
  },
  commands: (params?: ColbyCommandsParams) => ['commands', params] as const,
  command: (id: string) => ['command', id] as const,
  bestPractices: (params?: BestPracticesParams) => ['bestPractices', params] as const,
  bestPractice: (id: string) => ['bestPractice', id] as const,
  operations: ['operations'] as const,
  operation: (id: string) => ['operation', id] as const,
  stats: ['stats'] as const,
  dashboard: ['dashboard'] as const,
} as const;

// Health queries
export const useHealth = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => githubBotAPI.getHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

// Research queries
export const useResearchResults = (params?: ResearchResultsParams) => {
  return useQuery({
    queryKey: queryKeys.research.results(params),
    queryFn: () => githubBotAPI.getResearchResults(params),
    staleTime: 60000, // Consider data stale after 1 minute
  });
};

export const useResearchStatus = () => {
  return useQuery({
    queryKey: queryKeys.research.status,
    queryFn: () => githubBotAPI.getResearchStatus(),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    staleTime: 0, // Always consider data stale for real-time updates
  });
};

// Research mutations
export const useStartResearch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => githubBotAPI.startResearch(),
    onSuccess: () => {
      // Invalidate research status to get updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.research.status });
      queryClient.invalidateQueries({ queryKey: queryKeys.research.results() });
    },
  });
};

export const useStopResearch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => githubBotAPI.stopResearch(),
    onSuccess: () => {
      // Invalidate research status to get updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.research.status });
    },
  });
};

// Commands queries
export const useColbyCommands = (params?: ColbyCommandsParams) => {
  return useQuery({
    queryKey: queryKeys.commands(params),
    queryFn: () => githubBotAPI.getColbyCommands(params),
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export const useColbyCommand = (id: string) => {
  return useQuery({
    queryKey: queryKeys.command(id),
    queryFn: () => githubBotAPI.getColbyCommand(id),
    enabled: !!id,
  });
};

// Best Practices queries
export const useBestPractices = (params?: BestPracticesParams) => {
  return useQuery({
    queryKey: queryKeys.bestPractices(params),
    queryFn: () => githubBotAPI.getBestPractices(params),
    staleTime: 60000, // Consider data stale after 1 minute
  });
};

export const useBestPractice = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bestPractice(id),
    queryFn: () => githubBotAPI.getBestPractice(id),
    enabled: !!id,
  });
};

// Best Practices mutations
export const useApproveBestPractice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => githubBotAPI.approveBestPractice(id),
    onSuccess: (_, id) => {
      // Invalidate best practices queries
      queryClient.invalidateQueries({ queryKey: ['bestPractices'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.bestPractice(id) });
    },
  });
};

export const useRejectBestPractice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => githubBotAPI.rejectBestPractice(id),
    onSuccess: (_, id) => {
      // Invalidate best practices queries
      queryClient.invalidateQueries({ queryKey: ['bestPractices'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.bestPractice(id) });
    },
  });
};

// Operations queries
export const useOperations = () => {
  return useQuery({
    queryKey: queryKeys.operations,
    queryFn: () => githubBotAPI.getOperations(),
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    staleTime: 0, // Always consider data stale for real-time updates
  });
};

export const useOperation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.operation(id),
    queryFn: () => githubBotAPI.getOperation(id),
    enabled: !!id,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    staleTime: 0, // Always consider data stale for real-time updates
  });
};

// Operations mutations
export const useCancelOperation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => githubBotAPI.cancelOperation(id),
    onSuccess: (_, id) => {
      // Invalidate operations queries
      queryClient.invalidateQueries({ queryKey: queryKeys.operations });
      queryClient.invalidateQueries({ queryKey: queryKeys.operation(id) });
    },
  });
};

// Stats queries
export const useStats = () => {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => githubBotAPI.getStats(),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

// Dashboard query (combines multiple endpoints)
export const useDashboardData = () => {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => githubBotAPI.getDashboardData(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
};

// Utility hooks
export const useIsHealthy = () => {
  const { data: health, isLoading, error } = useHealth();
  return {
    isHealthy: health?.ok ?? false,
    isLoading,
    error,
  };
};

// Custom hooks for common patterns
export const useRepositoryFilters = (filters: ResearchResultsParams) => {
  return useResearchResults(filters);
};

export const useCommandFilters = (filters: ColbyCommandsParams) => {
  return useColbyCommands(filters);
};

export const useBestPracticeFilters = (filters: BestPracticesParams) => {
  return useBestPractices(filters);
};

// Real-time data hooks (for components that need live updates)
export const useRealTimeOperations = () => {
  return useQuery({
    queryKey: [...queryKeys.operations, 'realtime'],
    queryFn: () => githubBotAPI.getOperations(),
    refetchInterval: 2000, // Refetch every 2 seconds
    staleTime: 0,
  });
};

export const useRealTimeResearchStatus = () => {
  return useQuery({
    queryKey: [...queryKeys.research.status, 'realtime'],
    queryFn: () => githubBotAPI.getResearchStatus(),
    refetchInterval: 3000, // Refetch every 3 seconds
    staleTime: 0,
  });
};
