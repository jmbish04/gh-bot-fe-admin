import { ref, reactive, onUnmounted } from 'vue'

interface CommandStatus {
  commandId: string
  status: 'queued' | 'working' | 'completed' | 'failed'
  progress?: number
  message?: string
  updatedAt: number
}

export function useWebSocket() {
  // Reactive state
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)
  const lastMessage = ref<any>(null)
  
  // Map to store live command statuses
  const commandStatuses = reactive(new Map<string, CommandStatus>())
  
  // WebSocket instance
  let ws: WebSocket | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  let reconnectTimeout: NodeJS.Timeout | null = null

  // WebSocket URL - in a real app, this would come from environment config
  const getWebSocketUrl = () => {
    const baseUrl = 'https://gh-bot.hacolby.workers.dev'
    return baseUrl.replace('https:', 'wss:') + '/ws'
  }

  const connect = () => {
    if (isConnecting.value || isConnected.value) {
      return
    }

    try {
      isConnecting.value = true
      error.value = null
      
      const wsUrl = getWebSocketUrl()
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket connected')
        isConnected.value = true
        isConnecting.value = false
        reconnectAttempts = 0
        error.value = null
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          lastMessage.value = data
          
          // Handle command status updates
          if (data.type === 'command_update' && data.commandId) {
            updateCommandStatus(data.commandId, {
              commandId: data.commandId,
              status: data.status,
              progress: data.progress,
              message: data.message,
              updatedAt: Date.now()
            })
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        isConnected.value = false
        isConnecting.value = false
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect()
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        error.value = 'WebSocket connection error'
        isConnecting.value = false
      }
      
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      error.value = 'Failed to create WebSocket connection'
      isConnecting.value = false
    }
  }

  const disconnect = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    
    if (ws) {
      ws.close(1000, 'Intentional disconnect')
      ws = null
    }
    
    isConnected.value = false
    isConnecting.value = false
    reconnectAttempts = maxReconnectAttempts // Prevent auto-reconnect
  }

  const scheduleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      error.value = 'Max reconnection attempts reached'
      return
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000) // Exponential backoff, max 30s
    reconnectAttempts++
    
    console.log(`Scheduling WebSocket reconnection in ${delay}ms (attempt ${reconnectAttempts})`)
    
    reconnectTimeout = setTimeout(() => {
      connect()
    }, delay)
  }

  const subscribeToCommand = (commandId: string) => {
    if (!isConnected.value) {
      console.warn('WebSocket not connected, cannot subscribe to command:', commandId)
      return
    }

    try {
      const message = {
        type: 'subscribe',
        commandId: commandId
      }
      
      ws?.send(JSON.stringify(message))
      console.log('Subscribed to command updates:', commandId)
    } catch (err) {
      console.error('Failed to subscribe to command:', commandId, err)
    }
  }

  const unsubscribeFromCommand = (commandId: string) => {
    if (!isConnected.value) {
      return
    }

    try {
      const message = {
        type: 'unsubscribe',
        commandId: commandId
      }
      
      ws?.send(JSON.stringify(message))
      console.log('Unsubscribed from command updates:', commandId)
    } catch (err) {
      console.error('Failed to unsubscribe from command:', commandId, err)
    }
  }

  const updateCommandStatus = (commandId: string, status: CommandStatus) => {
    commandStatuses.set(commandId, status)
  }

  const getCommandStatus = (commandId: string): CommandStatus | undefined => {
    return commandStatuses.get(commandId)
  }

  const removeCommandStatus = (commandId: string) => {
    commandStatuses.delete(commandId)
  }

  // Auto-cleanup on component unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    // State
    isConnected,
    isConnecting,
    error,
    lastMessage,
    commandStatuses: commandStatuses as ReadonlyMap<string, CommandStatus>,
    
    // Actions
    connect,
    disconnect,
    subscribeToCommand,
    unsubscribeFromCommand,
    getCommandStatus,
    removeCommandStatus
  }
}