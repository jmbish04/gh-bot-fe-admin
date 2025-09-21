<template>
  <td :class="cellClass">
    <slot />
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

interface TableCellProps {
  class?: string
}

const props = defineProps<TableCellProps>()

const cellClass = computed(() => cn(
  'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  props.class
))
</script>