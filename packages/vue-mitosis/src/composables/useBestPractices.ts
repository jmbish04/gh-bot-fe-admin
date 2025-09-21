import { ref } from 'vue'
import { gitHubBotAPI, type BestPractice } from '../lib/github-bot-api'

export function useBestPractices() {
  // Reactive state
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
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Filters
  const filters = ref({
    category: '',
    status: 'pending'
  })

  // Actions
  const loadBestPractices = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const data = await gitHubBotAPI.getBestPractices({
        category: filters.value.category || undefined,
        status: filters.value.status || undefined
      })
      
      bestPractices.value = data.practices || []
    } catch (err) {
      console.error('Failed to load best practices:', err)
      error.value = 'Failed to load best practices'
      // Keep mock data as fallback
    } finally {
      isLoading.value = false
    }
  }

  const approvePractice = async (practiceId: string) => {
    // Update local state optimistically
    const practice = bestPractices.value.find(p => p.id === practiceId)
    if (practice) {
      practice.status = 'approved'
    }
    
    // TODO: Make API call to approve practice
    console.log(`Approved practice ${practiceId}`)
  }

  const rejectPractice = async (practiceId: string) => {
    // Update local state optimistically
    const practice = bestPractices.value.find(p => p.id === practiceId)
    if (practice) {
      practice.status = 'rejected'
    }
    
    // TODO: Make API call to reject practice
    console.log(`Rejected practice ${practiceId}`)
  }

  const applyFilters = () => {
    loadBestPractices()
  }

  return {
    // State
    bestPractices,
    isLoading,
    error,
    filters,
    
    // Actions
    loadBestPractices,
    approvePractice,
    rejectPractice,
    applyFilters
  }
}