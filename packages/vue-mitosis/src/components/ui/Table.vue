<template>
  <div class="relative w-full overflow-auto">
    <table :class="tableClass">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

interface TableProps {
  class?: string
}

const props = defineProps<TableProps>()

const tableClass = computed(() => cn(
  'w-full caption-bottom text-sm',
  props.class
))
</script>