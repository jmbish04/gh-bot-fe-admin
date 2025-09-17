import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/types/api';
import type {
  HealthResponse,
  ResearchResultsResponse,
  ResearchResultsParams,
  ColbyCommandsResponse,
  ColbyCommandsParams,
  BestPracticesResponse,
  BestPracticesParams,
  OperationsResponse,
  StatsResponse,
  ResearchStatusResponse,
  ErrorResponse,
  Repository,
  ColbyCommand,
  BestPractice,
  Operation,
} from '@/types/api';

class GitHubBotAPI {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        // Add API token if available
        const token = this.getApiToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorResponse: ErrorResponse = {
          error: error.response?.data?.error || 'Unknown error',
          message: error.response?.data?.message || error.message,
          statusCode: error.response?.status || 500,
        };
        return Promise.reject(errorResponse);
      }
    );
  }

  private getApiToken(): string | null {
    // In a real app, this would come from environment variables or user auth
    return process.env.GITHUB_BOT_API_TOKEN || null;
  }

  // Health endpoints
  async getHealth(): Promise<HealthResponse> {
    const response: AxiosResponse<HealthResponse> = await this.client.get('/health');
    return response.data;
  }

  // Research endpoints
  async getResearchResults(params?: ResearchResultsParams): Promise<ResearchResultsResponse> {
    const response: AxiosResponse<ResearchResultsResponse> = await this.client.get('/research/results', {
      params,
    });
    return response.data;
  }

  async getResearchStatus(): Promise<ResearchStatusResponse> {
    const response: AxiosResponse<ResearchStatusResponse> = await this.client.get('/research/status');
    return response.data;
  }

  async startResearch(): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post('/research/start');
    return response.data;
  }

  async stopResearch(): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post('/research/stop');
    return response.data;
  }

  // Colby Commands endpoints
  async getColbyCommands(params?: ColbyCommandsParams): Promise<ColbyCommandsResponse> {
    const response: AxiosResponse<ColbyCommandsResponse> = await this.client.get('/colby/commands', {
      params,
    });
    return response.data;
  }

  async getColbyCommand(id: string): Promise<ColbyCommand> {
    const response: AxiosResponse<ColbyCommand> = await this.client.get(`/colby/commands/${id}`);
    return response.data;
  }

  // Best Practices endpoints
  async getBestPractices(params?: BestPracticesParams): Promise<BestPracticesResponse> {
    const response: AxiosResponse<BestPracticesResponse> = await this.client.get('/colby/best-practices', {
      params,
    });
    return response.data;
  }

  async getBestPractice(id: string): Promise<BestPractice> {
    const response: AxiosResponse<BestPractice> = await this.client.get(`/colby/best-practices/${id}`);
    return response.data;
  }

  async approveBestPractice(id: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post(`/colby/best-practices/${id}/approve`);
    return response.data;
  }

  async rejectBestPractice(id: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post(`/colby/best-practices/${id}/reject`);
    return response.data;
  }

  // Operations endpoints
  async getOperations(): Promise<OperationsResponse> {
    const response: AxiosResponse<OperationsResponse> = await this.client.get('/api/operations');
    return response.data;
  }

  async getOperation(id: string): Promise<Operation> {
    const response: AxiosResponse<Operation> = await this.client.get(`/api/operations/${id}`);
    return response.data;
  }

  async cancelOperation(id: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post(`/api/operations/${id}/cancel`);
    return response.data;
  }

  // Stats endpoint
  async getStats(): Promise<StatsResponse> {
    const response: AxiosResponse<StatsResponse> = await this.client.get('/api/stats');
    return response.data;
  }

  // Utility methods
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.getHealth();
      return health.ok;
    } catch {
      return false;
    }
  }

  // Batch operations
  async getDashboardData() {
    const [stats, operations, recentCommands, recentPractices] = await Promise.allSettled([
      this.getStats(),
      this.getOperations(),
      this.getColbyCommands({ limit: 10 }),
      this.getBestPractices({ status: 'pending', limit: 10 }),
    ]);

    return {
      stats: stats.status === 'fulfilled' ? stats.value : null,
      operations: operations.status === 'fulfilled' ? operations.value.operations : [],
      recentCommands: recentCommands.status === 'fulfilled' ? recentCommands.value.commands : [],
      recentPractices: recentPractices.status === 'fulfilled' ? recentPractices.value.practices : [],
    };
  }
}

// Create singleton instance
export const githubBotAPI = new GitHubBotAPI();

// Export class for testing
export { GitHubBotAPI };
