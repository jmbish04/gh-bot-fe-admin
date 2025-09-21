import { ref, computed } from 'vue'
import { gitHubBotAPI, type Command } from '../lib/github-bot-api'

export function useCommands() {
  // Reactive state
  const commands = ref<Command[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Filters
  const filters = ref({
    repo: '',
    author: '',
    status: ''
  })

  // Computed properties
  const completedCommandsCount = computed(() => 
    commands.value.filter(cmd => cmd.status === 'completed').length
  )

  const workingCommandsCount = computed(() => 
    commands.value.filter(cmd => cmd.status === 'working').length
  )

  const queuedCommandsCount = computed(() => 
    commands.value.filter(cmd => cmd.status === 'queued').length
  )

  // Actions
  const loadCommands = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const data = await gitHubBotAPI.getCommands({
        repo: filters.value.repo || undefined,
        author: filters.value.author || undefined,
        status: filters.value.status || undefined,
        limit: 50
      })
      
      commands.value = data.commands || []
    } catch (err) {
      console.error('Failed to load commands:', err)
      error.value = 'Failed to load commands'
      
      // Use mock data as fallback
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
    } finally {
      isLoading.value = false
    }
  }

  const applyFilters = () => {
    loadCommands()
  }

  const resetFilters = () => {
    filters.value = {
      repo: '',
      author: '',
      status: ''
    }
    loadCommands()
  }

  return {
    // State
    commands,
    isLoading,
    error,
    filters,
    
    // Computed
    completedCommandsCount,
    workingCommandsCount,
    queuedCommandsCount,
    
    // Actions
    loadCommands,
    applyFilters,
    resetFilters
  }
}