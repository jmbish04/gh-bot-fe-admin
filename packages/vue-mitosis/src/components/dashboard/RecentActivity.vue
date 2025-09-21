<template>
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-3">
        <div v-for="activity in activities" :key="activity.id" class="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
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
</template>

<script setup lang="ts">
interface Activity {
  id: number
  icon: string
  title: string
  description: string
  timestamp: number
}

interface RecentActivityProps {
  activities: Activity[]
}

defineProps<RecentActivityProps>()

// Utility function
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
</script>

<script lang="ts">
import Card from '../ui/Card.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardTitle from '../ui/CardTitle.vue'
import CardContent from '../ui/CardContent.vue'

export default {
  name: 'RecentActivity',
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardContent
  }
}
</script>