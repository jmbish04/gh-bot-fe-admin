// GitHub Bot API Service
// Handles all communication with the gh-bot backend API

export interface ResearchResult {
  full_name: string
  html_url: string
  stars: number
  score: number
  short_summary?: string
  long_summary?: string
}

export interface ResearchResponse {
  total_projects: number
  min_score_filter: number
  limit_applied: number
  results: ResearchResult[]
}

export interface Command {
  id: string
  repo: string
  author: string
  command: string
  status: 'queued' | 'working' | 'completed' | 'failed'
  createdAt: number
}

export interface CommandsResponse {
  commands: Command[]
}

export interface BestPractice {
  id: string
  title: string
  description: string
  category: string
  repository: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface HealthResponse {
  ok: boolean
}

class GitHubBotAPI {
  private baseUrl: string
  private authPassword?: string

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'https://gh-bot.hacolby.workers.dev', authPassword?: string) {
    this.baseUrl = baseUrl;
    this.authPassword = authPassword || import.meta.env.VITE_API_AUTH_PASSWORD;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers
    }

    // Add authentication if password is provided
    if (this.authPassword) {
      headers['Authorization'] = `Bearer ${this.authPassword}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error)
      throw error
    }
  }

  // Health check
  async checkHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health')
  }

  // Research endpoints
  async getResearchResults(minScore: number = 0.6, limit: number = 50): Promise<ResearchResponse> {
    const params = new URLSearchParams({
      min_score: minScore.toString(),
      limit: limit.toString()
    })
    return this.request<ResearchResponse>(`/research/results?${params}`)
  }

  async triggerResearch(): Promise<void> {
    try {
      await this.request('/research/run', { method: 'POST' })
    } catch (error) {
      // Research endpoint might not be available, handle gracefully
      console.warn('Research trigger endpoint not available:', error)
    }
  }

  // Commands endpoints
  async getCommands(filters: {
    repo?: string
    author?: string
    status?: string
    limit?: number
  } = {}): Promise<CommandsResponse> {
    const params = new URLSearchParams()
    if (filters.repo) params.append('repo', filters.repo)
    if (filters.author) params.append('author', filters.author)
    if (filters.status) params.append('status', filters.status)
    params.append('limit', (filters.limit || 50).toString())

    return this.request<CommandsResponse>(`/colby/commands?${params}`)
  }

  // Best practices endpoints
  async getBestPractices(filters: {
    category?: string
    status?: string
  } = {}): Promise<{ practices: BestPractice[] }> {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.status) params.append('status', filters.status)

    try {
      return await this.request<{ practices: BestPractice[] }>(`/colby/best-practices?${params}`)
    } catch (error) {
      // Return mock data if endpoint is not available
      return {
        practices: [
          {
            id: '1',
            title: 'Improve TypeScript Configuration',
            description: 'Add strict mode and enable additional compiler checks for better type safety',
            category: 'TypeScript',
            repository: 'example/project',
            status: 'pending'
          },
          {
            id: '2',
            title: 'Optimize Cloudflare Workers Bundle',
            description: 'Use tree shaking and modern bundling techniques to reduce worker size',
            category: 'Performance',
            repository: 'example/worker',
            status: 'pending'
          }
        ]
      }
    }
  }

  // Repository analysis endpoint (may not exist in current API)
  async analyzeRepository(owner: string, repo: string): Promise<any> {
    try {
      return await this.request(`/api/repo/${owner}/${repo}/analysis`)
    } catch (error) {
      console.warn(`Repository analysis endpoint not available for ${owner}/${repo}:`, error)
      throw error
    }
  }

  // Submit feedback (may not exist in current API)
  async submitFeedback(owner: string, repo: string, feedback: 'positive' | 'negative'): Promise<void> {
    try {
      await this.request(`/api/repo/${owner}/${repo}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ feedback })
      })
    } catch (error) {
      console.warn(`Feedback endpoint not available for ${owner}/${repo}:`, error)
    }
  }

  // Operations and stats (may not exist in current API)
  async getOperations(): Promise<any> {
    try {
      return await this.request('/api/operations')
    } catch (error) {
      console.warn('Operations endpoint not available:', error)
      return { operations: [] }
    }
  }

  async getStats(): Promise<any> {
    try {
      return await this.request('/api/stats')
    } catch (error) {
      console.warn('Stats endpoint not available:', error)
      return {
        total_repositories: 0,
        commands_executed: 0,
        best_practices: 0,
        active_research: 0
      }
    }
  }
}

// Create and export a singleton instance
export const gitHubBotAPI = new GitHubBotAPI()

// Export the class for custom instances
export default GitHubBotAPI