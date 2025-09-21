import { ref, onMounted, onUnmounted } from 'vue'
import { gitHubBotAPI } from '../lib/github-bot-api'

export function useHealth() {
  // Reactive state
  const healthStatus = ref({
    label: 'Checking...',
    color: 'text-yellow-600'
  })
  
  const isChecking = ref(false)
  const lastCheck = ref<Date | null>(null)
  let healthInterval: NodeJS.Timeout | null = null

  // Actions
  const checkHealth = async () => {
    if (isChecking.value) return
    
    try {
      isChecking.value = true
      const data = await gitHubBotAPI.checkHealth()
      
      healthStatus.value = {
        label: data.ok ? 'Healthy' : 'Issues',
        color: data.ok ? 'text-green-600' : 'text-red-600'
      }
      
      lastCheck.value = new Date()
    } catch (error) {
      console.error('Health check failed:', error)
      healthStatus.value = {
        label: 'Offline',
        color: 'text-red-600'
      }
      lastCheck.value = new Date()
    } finally {
      isChecking.value = false
    }
  }

  const startPeriodicHealthCheck = (intervalMs: number = 30000) => {
    // Clear any existing interval
    if (healthInterval) {
      clearInterval(healthInterval)
    }
    
    // Perform initial check
    checkHealth()
    
    // Set up periodic checks
    healthInterval = setInterval(checkHealth, intervalMs)
  }

  const stopPeriodicHealthCheck = () => {
    if (healthInterval) {
      clearInterval(healthInterval)
      healthInterval = null
    }
  }

  // Auto-start health monitoring on mount
  onMounted(() => {
    startPeriodicHealthCheck(30000) // Check every 30 seconds
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopPeriodicHealthCheck()
  })

  return {
    // State
    healthStatus,
    isChecking,
    lastCheck,
    
    // Actions
    checkHealth,
    startPeriodicHealthCheck,
    stopPeriodicHealthCheck
  }
}