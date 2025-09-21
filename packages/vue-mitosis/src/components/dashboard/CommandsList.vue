<template>
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
            v-model="filters.repo" 
            placeholder="Filter by repository..."
            class="w-48"
          />
          <Input 
            v-model="filters.author" 
            placeholder="Filter by author..."
            class="w-48"
          />
          <select 
            v-model="filters.status"
            class="px-3 py-2 text-sm rounded-md border border-input bg-background"
          >
            <option value="">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="working">Working</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <Button @click="$emit('applyFilters')" variant="outline">
            Filter
          </Button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-8">
          <div class="text-muted-foreground">Loading commands...</div>
        </div>

        <!-- Commands Table -->
        <Table v-else>
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
            <CommandRowItem 
              v-for="command in commands" 
              :key="command.id"
              :command="command"
            />
          </TableBody>
        </Table>

        <!-- Error State -->
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
          <div class="text-sm text-red-800 dark:text-red-400">{{ error }}</div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { type Command } from '../../lib/github-bot-api'
import CommandRowItem from './CommandRowItem.vue'

interface CommandsListProps {
  commands: Command[]
  filters: {
    repo: string
    author: string
    status: string
  }
  isLoading: boolean
  error: string | null
}

defineProps<CommandsListProps>()

defineEmits<{
  applyFilters: []
}>()
</script>

<script lang="ts">
import Card from '../ui/Card.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardTitle from '../ui/CardTitle.vue'
import CardContent from '../ui/CardContent.vue'
import Table from '../ui/Table.vue'
import TableHeader from '../ui/TableHeader.vue'
import TableBody from '../ui/TableBody.vue'
import TableRow from '../ui/TableRow.vue'
import TableHead from '../ui/TableHead.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'

export default {
  name: 'CommandsList',
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    Button,
    Input,
    CommandRowItem
  }
}
</script>