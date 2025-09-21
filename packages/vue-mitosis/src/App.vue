<template>
  <div class="min-h-screen bg-background p-8">
    <div class="mx-auto max-w-4xl space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-foreground mb-2">
          ShadCN Vue.js with Mitosis
        </h1>
        <p class="text-muted-foreground">
          A complete example using ShadCN components built for Vue.js, compatible with Mitosis
        </p>
      </div>

      <!-- Interactive Demo -->
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">
                Text Input
              </label>
              <Input
                v-model="inputValue"
                placeholder="Type something..."
              />
              <p v-if="inputValue" class="text-sm text-muted-foreground mt-2">
                You typed: {{ inputValue }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium mb-2 block">
                Counter: {{ counter }}
              </label>
              <div class="flex gap-2">
                <Button @click="incrementCounter">
                  Increment
                </Button>
                <Button variant="outline" @click="resetCounter">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Button Variants Demo -->
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </CardContent>
      </Card>

      <!-- Table Demo -->
      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in tableData" :key="user.id">
                <TableCell>{{ user.id }}</TableCell>
                <TableCell>{{ user.name }}</TableCell>
                <TableCell>{{ user.email }}</TableCell>
                <TableCell>
                  <span class="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                    {{ user.role }}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- GitHub Bot Admin Actions -->
      <Card>
        <CardHeader>
          <CardTitle>GitHub Bot Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                🔄
              </div>
              <span>Sync Workflows</span>
            </Button>
            <Button variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                📊
              </div>
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                ⚙️
              </div>
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Footer -->
      <div class="text-center text-sm text-muted-foreground">
        <p>Built with Vue.js and ShadCN design system</p>
        <p>Designed to work with Mitosis • Deployable to Cloudflare Pages</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const inputValue = ref('')
const counter = ref(0)

const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
]

const incrementCounter = () => {
  counter.value++
}

const resetCounter = () => {
  counter.value = 0
}
</script>