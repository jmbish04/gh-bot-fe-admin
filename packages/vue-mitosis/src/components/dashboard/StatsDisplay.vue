<template>
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
            <div class="text-2xl font-bold">{{ commandsExecuted }}</div>
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
            <div class="text-2xl font-bold">{{ bestPracticesCount }}</div>
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
</template>

<script setup lang="ts">
interface StatsDisplayProps {
  stats: {
    totalRepositories: number
    activeResearch: number
    averageScore?: number
    highScoreCount?: number
  }
  commandsExecuted: number
  bestPracticesCount: number
}

defineProps<StatsDisplayProps>()
</script>

<script lang="ts">
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'

export default {
  name: 'StatsDisplay',
  components: {
    Card,
    CardContent
  }
}
</script>