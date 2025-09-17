// GitHub Bot API Types
// Generated from OpenAPI spec: https://gh-bot.hacolby.workers.dev/openapi.json

export interface HealthResponse {
  ok: boolean;
}

export interface Repository {
  full_name: string;
  html_url: string;
  stars: number;
  score: number;
  short_summary: string | null;
  long_summary: string | null;
}

export interface ResearchResultsResponse {
  total_projects: number;
  min_score_filter: number;
  limit_applied: number;
  results: Repository[];
}

export interface ResearchResultsParams {
  min_score?: number;
  limit?: number;
}

export interface ColbyCommand {
  id: string;
  repo: string;
  author: string;
  command: string;
  status: 'queued' | 'working' | 'completed' | 'failed';
  createdAt: number;
}

export interface ColbyCommandsResponse {
  commands: ColbyCommand[];
}

export interface ColbyCommandsParams {
  repo?: string;
  author?: string;
  status?: 'queued' | 'working' | 'completed' | 'failed';
  limit?: number;
}

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  updatedAt: number;
  tags: string[];
  examples?: string[];
  implementation?: string;
}

export interface BestPracticesResponse {
  practices: BestPractice[];
}

export interface BestPracticesParams {
  category?: string;
  status?: 'pending' | 'approved' | 'rejected';
  limit?: number;
}

export interface Operation {
  id: string;
  type: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startedAt: number;
  completedAt?: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface OperationsResponse {
  operations: Operation[];
}

export interface StatsResponse {
  projects: number;
  commands: number;
  practices: number;
  analyses: number;
  operations: number;
  repositories: number;
}

export interface ResearchStatusResponse {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  progress: number;
  current_operation: string;
  total_repositories: number;
  processed_repositories: number;
  estimated_completion?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// API Configuration
export const API_BASE_URL = 'https://gh-bot.hacolby.workers.dev';
export const WS_BASE_URL = 'wss://gh-bot.hacolby.workers.dev';

// API Endpoints
export const API_ENDPOINTS = {
  health: '/health',
  research: {
    results: '/research/results',
    status: '/research/status',
    start: '/research/start',
    stop: '/research/stop',
  },
  colby: {
    commands: '/colby/commands',
    command: (id: string) => `/colby/commands/${id}`,
  },
  bestPractices: {
    list: '/colby/best-practices',
    get: (id: string) => `/colby/best-practices/${id}`,
    approve: (id: string) => `/colby/best-practices/${id}/approve`,
    reject: (id: string) => `/colby/best-practices/${id}/reject`,
  },
  operations: {
    list: '/api/operations',
    get: (id: string) => `/api/operations/${id}`,
    cancel: (id: string) => `/api/operations/${id}/cancel`,
  },
  stats: '/api/stats',
} as const;

// Filter and Search Types
export interface RepositoryFilters {
  minScore?: number;
  maxScore?: number;
  minStars?: number;
  maxStars?: number;
  category?: string;
  search?: string;
}

export interface CommandFilters {
  repo?: string;
  author?: string;
  status?: ColbyCommand['status'];
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  search?: string;
}

export interface BestPracticeFilters {
  category?: string;
  status?: BestPractice['status'];
  tags?: string[];
  search?: string;
}

// UI State Types
export interface DashboardStats {
  totalRepositories: number;
  activeOperations: number;
  completedCommands: number;
  pendingPractices: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
  lastUpdated: number;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: boolean;
  defaultFilters: {
    repositories: RepositoryFilters;
    commands: CommandFilters;
    practices: BestPracticeFilters;
  };
}

// Chart and Visualization Types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
  label?: string;
}

export interface RepositoryScoreDistribution {
  scoreRange: string;
  count: number;
  percentage: number;
}

export interface CommandStatusDistribution {
  status: ColbyCommand['status'];
  count: number;
  percentage: number;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'stats_update' | 'operation_update' | 'command_update' | 'research_update' | 'notification';
  data: any;
  timestamp: number;
}

export interface StatsUpdateMessage extends WebSocketMessage {
  type: 'stats_update';
  data: DashboardStats;
}

export interface OperationUpdateMessage extends WebSocketMessage {
  type: 'operation_update';
  data: Operation;
}

export interface CommandUpdateMessage extends WebSocketMessage {
  type: 'command_update';
  data: ColbyCommand;
}

export interface ResearchUpdateMessage extends WebSocketMessage {
  type: 'research_update';
  data: ResearchStatusResponse;
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  data: NotificationState;
}

// Re-export all types for better module resolution
export type {
  HealthResponse,
  Repository,
  ResearchResultsResponse,
  ResearchResultsParams,
  ColbyCommand,
  ColbyCommandsResponse,
  ColbyCommandsParams,
  BestPractice,
  BestPracticesResponse,
  BestPracticesParams,
  Operation,
  OperationsResponse,
  StatsResponse,
  ResearchStatusResponse,
  ErrorResponse,
  RepositoryFilters,
  CommandFilters,
  BestPracticeFilters,
  DashboardStats,
  NotificationState,
  UserPreferences,
  ChartDataPoint,
  TimeSeriesData,
  RepositoryScoreDistribution,
  CommandStatusDistribution,
  WebSocketMessage,
  StatsUpdateMessage,
  OperationUpdateMessage,
  CommandUpdateMessage,
  ResearchUpdateMessage,
  NotificationMessage,
};
