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
          <div 
            v-if="isWebSocketEnabled"
            :class="isConnected ? 'text-green-600' : 'text-gray-400'" 
            class="flex items-center space-x-1 px-2 py-1 rounded text-xs"
            :title="isConnected ? 'Real-time updates connected' : 'Real-time updates disconnected'"
          >
            <div class="w-2 h-2 rounded-full bg-current"></div>
            <span>{{ isConnected ? 'Live' : 'Offline' }}</span>
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
        <!-- Stats Display Component -->
        <StatsDisplay 
          :stats="dashboardStats" 
          :commands-executed="completedCommandsCount"
          :best-practices-count="bestPractices.length"
        />

        <!-- Recent Activity Component -->
        <RecentActivity :activities="recentActivity" />
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
            <Button @click="triggerResearch" :disabled="isResearchLoading">
              {{ isResearchLoading ? 'Running...' : '🔍 Start Research' }}
            </Button>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Filters -->
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center space-x-2">
                  <label class="text-sm font-medium">Min Score:</label>
                  <Input 
                    v-model="researchFilters.minScore" 
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
                    v-model="researchFilters.limit" 
                    type="number" 
                    min="10" 
                    max="200" 
                    class="w-20"
                  />
                </div>
                <Button @click="applyResearchFilters" variant="outline">
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

      <!-- Commands History with Real-time Updates -->
      <div v-if="activeTab === 'commands'" class="space-y-6">
        <CommandsList 
          :commands="commands"
          :filters="commandFilters"
          :is-loading="isCommandsLoading"
          :error="commandsError"
          @apply-filters="applyCommandFilters"
        />
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
                <Button @click="applyPracticeFilters" variant="outline">
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
                      <Button size="sm" variant="outline" @click="approvePractice(practice.id)">
                        👍 Approve
                      </Button>
                      <Button size="sm" variant="outline" @click="rejectPractice(practice.id)">
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
import { ref, onMounted } from 'vue'

// Import composables
import { useDashboardStats } from './composables/useDashboardStats'
import { useCommands } from './composables/useCommands'
import { useBestPractices } from './composables/useBestPractices'
import { useHealth } from './composables/useHealth'
import { useWebSocket } from './composables/useWebSocket'

// Import UI components
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

// Import dashboard components
import StatsDisplay from './components/dashboard/StatsDisplay.vue'
import CommandsList from './components/dashboard/CommandsList.vue'
import RecentActivity from './components/dashboard/RecentActivity.vue'

// ===============================
// STATE MANAGEMENT WITH COMPOSABLES
// ===============================

// Tab navigation state
const activeTab = ref('dashboard')
const tabs = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'research', label: '🔍 Research' },
  { id: 'commands', label: '⚡ Commands' },
  { id: 'practices', label: '💡 Best Practices' }
]

// Use composables for business logic
const { healthStatus } = useHealth()

const { 
  researchResults, 
  stats: dashboardStats, 
  filters: researchFilters,
  isLoading: isResearchLoading,
  loadResearchResults,
  triggerResearch,
  applyFilters: applyResearchFilters
} = useDashboardStats()

const {
  commands,
  filters: commandFilters,
  isLoading: isCommandsLoading,
  error: commandsError,
  completedCommandsCount,
  loadCommands,
  applyFilters: applyCommandFilters
} = useCommands()

const {
  bestPractices,
  filters: practiceFilters,
  loadBestPractices,
  approvePractice,
  rejectPractice,
  applyFilters: applyPracticeFilters
} = useBestPractices()

// WebSocket for real-time monitoring
const { isConnected, connect } = useWebSocket()
const isWebSocketEnabled = ref(true) // Feature flag

// Recent activity (could also be moved to a composable if it becomes more complex)
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

// ===============================
// ACTIONS
// ===============================

const refreshData = async () => {
  await Promise.all([
    loadResearchResults(),
    loadCommands(),
    loadBestPractices()
  ])
}

// ===============================
// LIFECYCLE
// ===============================

onMounted(() => {
  // Load initial data
  refreshData()
  
  // Connect WebSocket for real-time updates if enabled
  if (isWebSocketEnabled.value) {
    connect()
  }
})
</script>