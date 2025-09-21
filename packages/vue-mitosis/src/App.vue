<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation Header -->
    <nav class="bg-card border-b border-border p-4">
      <div class="mx-auto max-w-6xl flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              🤖
            </div>
            <h1 class="text-xl font-bold text-foreground">
              GitHub Bot Admin
            </h1>
          </div>
          <div class="hidden md:flex items-center space-x-1">
            <Button 
              v-for="tab in tabs" 
              :key="tab.id"
              :variant="activeTab === tab.id ? 'default' : 'ghost'"
              size="sm"
              @click="activeTab = tab.id"
              class="text-sm"
            >
              {{ tab.label }}
            </Button>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div :class="healthStatus.color" class="flex items-center space-x-2 px-3 py-1 rounded-full text-sm">
            <div class="w-2 h-2 rounded-full bg-current"></div>
            <span>{{ healthStatus.label }}</span>
          </div>
          <Button variant="outline" size="sm" @click="refreshData">
            🔄 Refresh
          </Button>
        </div>
      </div>
    </nav>

    <div class="mx-auto max-w-6xl p-6 space-y-6">
      <!-- Dashboard Overview -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center space-x-2">
                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  📊
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ stats.totalRepositories }}</div>
                  <div class="text-sm text-muted-foreground">Repositories Analyzed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center space-x-2">
                <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  ⚡
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ stats.commandsExecuted }}</div>
                  <div class="text-sm text-muted-foreground">Commands Executed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center space-x-2">
                <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  💡
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ stats.bestPractices }}</div>
                  <div class="text-sm text-muted-foreground">Best Practices</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center space-x-2">
                <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  🔍
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ stats.activeResearch }}</div>
                  <div class="text-sm text-muted-foreground">Active Research</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Recent Activity -->
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                  {{ activity.icon }}
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ activity.title }}</div>
                  <div class="text-xs text-muted-foreground">{{ activity.description }}</div>
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ formatTime(activity.timestamp) }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Research Results -->
      <div v-if="activeTab === 'research'" class="space-y-6">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Repository Research Results</CardTitle>
              <p class="text-sm text-muted-foreground mt-1">
                AI-analyzed repositories with intelligent scoring and recommendations
              </p>
            </div>
            <Button @click="triggerResearch" :disabled="isLoading">
              {{ isLoading ? 'Running...' : '🔍 Start Research' }}
            </Button>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Filters -->
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center space-x-2">
                  <label class="text-sm font-medium">Min Score:</label>
                  <Input 
                    v-model="filters.minScore" 
                    type="number" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    class="w-20"
                  />
                </div>
                <div class="flex items-center space-x-2">
                  <label class="text-sm font-medium">Limit:</label>
                  <Input 
                    v-model="filters.limit" 
                    type="number" 
                    min="10" 
                    max="200" 
                    class="w-20"
                  />
                </div>
                <Button @click="loadResearchResults" variant="outline">
                  Apply Filters
                </Button>
              </div>

              <!-- Results Table -->
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Stars</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="repo in researchResults" :key="repo.full_name">
                    <TableCell>
                      <div>
                        <div class="font-medium">{{ repo.full_name }}</div>
                        <a :href="repo.html_url" target="_blank" class="text-xs text-blue-600 hover:underline">
                          View on GitHub
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div class="flex items-center space-x-2">
                        <div class="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            class="h-full bg-primary rounded-full transition-all"
                            :style="{ width: `${repo.score * 100}%` }"
                          ></div>
                        </div>
                        <span class="text-sm">{{ (repo.score * 100).toFixed(0) }}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span class="inline-flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{{ repo.stars.toLocaleString() }}</span>
                      </span>
                    </TableCell>
                    <TableCell class="max-w-md">
                      <div class="text-sm text-muted-foreground truncate" :title="repo.long_summary || repo.short_summary">
                        {{ repo.short_summary || 'No summary available' }}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        📋 Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Commands History -->
      <div v-if="activeTab === 'commands'" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Colby Commands History</CardTitle>
            <p class="text-sm text-muted-foreground">
              Track and monitor GitHub bot command executions
            </p>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Command Filters -->
              <div class="flex flex-wrap gap-4">
                <Input 
                  v-model="commandFilters.repo" 
                  placeholder="Filter by repository..."
                  class="w-48"
                />
                <Input 
                  v-model="commandFilters.author" 
                  placeholder="Filter by author..."
                  class="w-48"
                />
                <select 
                  v-model="commandFilters.status"
                  class="px-3 py-2 text-sm rounded-md border border-input bg-background"
                >
                  <option value="">All Statuses</option>
                  <option value="queued">Queued</option>
                  <option value="working">Working</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <Button @click="loadCommands" variant="outline">
                  Filter
                </Button>
              </div>

              <!-- Commands Table -->
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Command</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="command in commands" :key="command.id">
                    <TableCell>{{ command.repo }}</TableCell>
                    <TableCell>{{ command.author }}</TableCell>
                    <TableCell>
                      <code class="text-sm bg-muted px-2 py-1 rounded">{{ command.command }}</code>
                    </TableCell>
                    <TableCell>
                      <span :class="getStatusColor(command.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs">
                        {{ command.status }}
                      </span>
                    </TableCell>
                    <TableCell>
                      {{ formatTime(command.createdAt * 1000) }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Best Practices -->
      <div v-if="activeTab === 'practices'" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Best Practices Management</CardTitle>
            <p class="text-sm text-muted-foreground">
              Review and manage AI-generated code suggestions and best practices
            </p>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Practice Filters -->
              <div class="flex flex-wrap gap-4">
                <Input 
                  v-model="practiceFilters.category" 
                  placeholder="Filter by category..."
                  class="w-48"
                />
                <select 
                  v-model="practiceFilters.status"
                  class="px-3 py-2 text-sm rounded-md border border-input bg-background"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Button @click="loadBestPractices" variant="outline">
                  Filter
                </Button>
              </div>

              <!-- Practices List -->
              <div class="space-y-3">
                <div v-for="practice in bestPractices" :key="practice.id" class="border border-border rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-medium">{{ practice.title }}</h3>
                      <p class="text-sm text-muted-foreground mt-1">{{ practice.description }}</p>
                      <div class="flex items-center space-x-4 mt-3">
                        <span class="text-xs bg-secondary px-2 py-1 rounded">{{ practice.category }}</span>
                        <span class="text-xs text-muted-foreground">{{ practice.repository }}</span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <Button size="sm" variant="outline">
                        👍 Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        👎 Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { gitHubBotAPI, type ResearchResult, type Command, type BestPractice } from './lib/github-bot-api'
import Button from './components/ui/Button.vue'
import Input from './components/ui/Input.vue'
import Card from './components/ui/Card.vue'
import CardHeader from './components/ui/CardHeader.vue'
import CardTitle from './components/ui/CardTitle.vue'
import CardContent from './components/ui/CardContent.vue'
import Table from './components/ui/Table.vue'
import TableHeader from './components/ui/TableHeader.vue'
import TableBody from './components/ui/TableBody.vue'
import TableRow from './components/ui/TableRow.vue'
import TableHead from './components/ui/TableHead.vue'
import TableCell from './components/ui/TableCell.vue'

// Reactive state
const activeTab = ref('dashboard')
const isLoading = ref(false)
const lastRefresh = ref(Date.now())

// Health status
const healthStatus = ref({
  label: 'Checking...',
  color: 'text-yellow-600'
})

// Dashboard stats
const stats = ref({
  totalRepositories: 0,
  commandsExecuted: 0,
  bestPractices: 0,
  activeResearch: 0
})

// Navigation tabs
const tabs = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'research', label: '🔍 Research' },
  { id: 'commands', label: '⚡ Commands' },
  { id: 'practices', label: '💡 Best Practices' }
]

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    icon: '🔍',
    title: 'Repository Analysis Completed',
    description: 'cloudflare/workers-sdk analyzed with score 0.89',
    timestamp: Date.now() - 1000 * 60 * 15 // 15 minutes ago
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Command Executed',
    description: 'research command by @developer in microsoft/typescript',
    timestamp: Date.now() - 1000 * 60 * 45 // 45 minutes ago
  },
  {
    id: 3,
    icon: '💡',
    title: 'Best Practice Suggested',
    description: 'TypeScript configuration improvement for vercel/next.js',
    timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
  }
])

// Research results
const researchResults = ref<ResearchResult[]>([])
const filters = ref({
  minScore: '0.6',
  limit: '50'
})

// Commands
const commands = ref<Command[]>([])
const commandFilters = ref({
  repo: '',
  author: '',
  status: ''
})

// Best practices
const bestPractices = ref<BestPractice[]>([
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
])
const practiceFilters = ref({
  category: '',
  status: 'pending'
})

// API functions using the service
const checkHealth = async () => {
  try {
    const data = await gitHubBotAPI.checkHealth()
    healthStatus.value = {
      label: data.ok ? 'Healthy' : 'Issues',
      color: data.ok ? 'text-green-600' : 'text-red-600'
    }
  } catch (error) {
    healthStatus.value = {
      label: 'Offline',
      color: 'text-red-600'
    }
  }
}

const loadResearchResults = async () => {
  try {
    isLoading.value = true
    const data = await gitHubBotAPI.getResearchResults(
      parseFloat(filters.value.minScore),
      parseInt(filters.value.limit)
    )
    
    researchResults.value = data.results || []
    stats.value.totalRepositories = data.total_projects || researchResults.value.length
  } catch (error) {
    console.error('Failed to load research results:', error)
    // Use mock data for demo if API fails
    researchResults.value = [
      {
        full_name: 'cloudflare/workers-sdk',
        html_url: 'https://github.com/cloudflare/workers-sdk',
        stars: 2400,
        score: 0.89,
        short_summary: 'Comprehensive SDK for Cloudflare Workers development',
        long_summary: 'A powerful SDK providing tools, CLI, and libraries for developing Cloudflare Workers applications'
      },
      {
        full_name: 'microsoft/TypeScript',
        html_url: 'https://github.com/microsoft/TypeScript',
        stars: 98000,
        score: 0.95,
        short_summary: 'TypeScript language and compiler implementation',
        long_summary: 'TypeScript is a language for application-scale JavaScript development'
      },
      {
        full_name: 'vercel/next.js',
        html_url: 'https://github.com/vercel/next.js',
        stars: 120000,
        score: 0.92,
        short_summary: 'React framework for production applications',
        long_summary: 'Next.js is a React framework for building full-stack web applications'
      }
    ]
    stats.value.totalRepositories = researchResults.value.length
  } finally {
    isLoading.value = false
  }
}

const loadCommands = async () => {
  try {
    const data = await gitHubBotAPI.getCommands({
      repo: commandFilters.value.repo || undefined,
      author: commandFilters.value.author || undefined,
      status: commandFilters.value.status || undefined,
      limit: 50
    })
    
    commands.value = data.commands || []
    stats.value.commandsExecuted = commands.value.filter(cmd => cmd.status === 'completed').length
  } catch (error) {
    console.error('Failed to load commands:', error)
    // Use mock data for demo if API fails
    commands.value = [
      {
        id: '1',
        repo: 'cloudflare/workers-sdk',
        author: 'developer1',
        command: 'colby research --deep',
        status: 'completed',
        createdAt: Math.floor(Date.now() / 1000) - 3600
      },
      {
        id: '2',
        repo: 'microsoft/TypeScript',
        author: 'developer2',
        command: 'colby analyze --performance',
        status: 'working',
        createdAt: Math.floor(Date.now() / 1000) - 1800
      },
      {
        id: '3',
        repo: 'vercel/next.js',
        author: 'developer3',
        command: 'colby best-practices',
        status: 'queued',
        createdAt: Math.floor(Date.now() / 1000) - 900
      }
    ]
    stats.value.commandsExecuted = commands.value.filter(cmd => cmd.status === 'completed').length
  }
}

const loadBestPractices = async () => {
  try {
    const data = await gitHubBotAPI.getBestPractices({
      category: practiceFilters.value.category || undefined,
      status: practiceFilters.value.status || undefined
    })
    
    bestPractices.value = data.practices || []
    stats.value.bestPractices = bestPractices.value.length
  } catch (error) {
    console.error('Failed to load best practices:', error)
    stats.value.bestPractices = bestPractices.value.length
  }
}

const triggerResearch = async () => {
  try {
    isLoading.value = true
    await gitHubBotAPI.triggerResearch()
    
    // Reload results after triggering research
    setTimeout(() => {
      loadResearchResults()
    }, 2000)
  } catch (error) {
    console.error('Failed to trigger research:', error)
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 3000)
  }
}

const refreshData = async () => {
  lastRefresh.value = Date.now()
  await Promise.all([
    checkHealth(),
    loadResearchResults(),
    loadCommands(),
    loadBestPractices()
  ])
}

// Utility functions
const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    working: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    queued: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

// Initialize data on mount
onMounted(() => {
  refreshData()
  
  // Set up periodic refresh
  const interval = setInterval(checkHealth, 30000) // Check health every 30 seconds
  
  // Cleanup on unmount
  return () => {
    clearInterval(interval)
  }
})

// Update stats based on current data
const updateStats = () => {
  stats.value.activeResearch = researchResults.value.filter(r => r.score > 0.8).length
}

// Watch for changes to update stats
setTimeout(updateStats, 1000)
</script>