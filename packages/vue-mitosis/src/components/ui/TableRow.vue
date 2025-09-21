<template>
  <tr :class="rowClass">
    <slot />
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

interface TableRowProps {
  class?: string
}

const props = defineProps<TableRowProps>()

const rowClass = computed(() => cn(
  'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  props.class
))
</script>