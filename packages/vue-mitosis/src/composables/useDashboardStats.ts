import { ref, computed, watch } from 'vue'
import { gitHubBotAPI, type ResearchResult } from '../lib/github-bot-api'

export function useDashboardStats() {
  // Reactive state
  const researchResults = ref<ResearchResult[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Filters for research
  const filters = ref({
    minScore: '0.6',
    limit: '50'
  })

  // Computed statistics - automatically reactive to data changes
  const stats = computed(() => {
    const totalRepositories = researchResults.value.length
    const activeResearch = researchResults.value.filter(r => r.score > 0.8).length
    
    return {
      totalRepositories,
      activeResearch,
      averageScore: totalRepositories > 0 
        ? researchResults.value.reduce((sum, r) => sum + r.score, 0) / totalRepositories 
        : 0,
      highScoreCount: researchResults.value.filter(r => r.score > 0.9).length
    }
  })

  // Actions
  const loadResearchResults = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const data = await gitHubBotAPI.getResearchResults(
        parseFloat(filters.value.minScore),
        parseInt(filters.value.limit)
      )
      
      researchResults.value = data.results || []
    } catch (err) {
      console.error('Failed to load research results:', err)
      error.value = 'Failed to load research results'
      
      // Use mock data as fallback
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
    } finally {
      isLoading.value = false
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
    } catch (err) {
      console.error('Failed to trigger research:', err)
      error.value = 'Failed to trigger research'
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    }
  }

  const applyFilters = () => {
    loadResearchResults()
  }

  // Watch for filter changes and automatically reload data
  watch(
    () => [filters.value.minScore, filters.value.limit],
    () => {
      // Optional: Auto-reload when filters change
      // loadResearchResults()
    },
    { deep: true }
  )

  return {
    // State
    researchResults,
    isLoading,
    error,
    filters,
    
    // Computed stats that automatically update when data changes
    stats,
    
    // Actions
    loadResearchResults,
    triggerResearch,
    applyFilters
  }
}