<template>
  <TableRow>
    <TableCell>{{ command.repo }}</TableCell>
    <TableCell>{{ command.author }}</TableCell>
    <TableCell>
      <code class="text-sm bg-muted px-2 py-1 rounded">{{ command.command }}</code>
    </TableCell>
    <TableCell>
      <div class="flex items-center space-x-2">
        <span :class="statusColor" class="inline-flex items-center px-2 py-1 rounded-full text-xs">
          {{ currentStatus }}
        </span>
        
        <!-- Real-time progress indicator for active commands -->
        <div 
          v-if="isActiveCommand && liveStatus?.progress !== undefined" 
          class="w-16 h-1 bg-muted rounded-full overflow-hidden"
        >
          <div 
            class="h-full bg-primary rounded-full transition-all duration-300"
            :style="{ width: `${liveStatus.progress}%` }"
          ></div>
        </div>
        
        <!-- WebSocket connection indicator -->
        <div 
          v-if="isActiveCommand"
          :class="isConnected ? 'text-green-500' : 'text-gray-400'"
          class="w-2 h-2 rounded-full"
          :title="isConnected ? 'Live updates connected' : 'Live updates disconnected'"
        >
          <div class="w-full h-full rounded-full bg-current"></div>
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div>
        {{ formatTime(command.createdAt * 1000) }}
        <div v-if="liveStatus?.message" class="text-xs text-muted-foreground mt-1">
          {{ liveStatus.message }}
        </div>
      </div>
    </TableCell>
  </TableRow>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { type Command } from '../../lib/github-bot-api'
import { useWebSocket } from '../../composables/useWebSocket'

interface CommandRowItemProps {
  command: Command
}

const props = defineProps<CommandRowItemProps>()

// Use WebSocket composable for real-time updates
const { 
  isConnected, 
  subscribeToCommand, 
  unsubscribeFromCommand,
  getCommandStatus 
} = useWebSocket()

// Computed properties
const isActiveCommand = computed(() => 
  props.command.status === 'queued' || props.command.status === 'working'
)

const liveStatus = computed(() => 
  getCommandStatus(props.command.id)
)

const currentStatus = computed(() => 
  liveStatus.value?.status || props.command.status
)

const statusColor = computed(() => {
  const status = currentStatus.value
  const colors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    working: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    queued: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
})

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

// Lifecycle hooks
onMounted(() => {
  // Subscribe to real-time updates for active commands
  if (isActiveCommand.value) {
    subscribeToCommand(props.command.id)
  }
})

onUnmounted(() => {
  // Clean up subscription
  if (isActiveCommand.value) {
    unsubscribeFromCommand(props.command.id)
  }
})
</script>

<script lang="ts">
import TableRow from '../ui/TableRow.vue'
import TableCell from '../ui/TableCell.vue'

export default {
  name: 'CommandRowItem',
  components: {
    TableRow,
    TableCell
  }
}
</script>