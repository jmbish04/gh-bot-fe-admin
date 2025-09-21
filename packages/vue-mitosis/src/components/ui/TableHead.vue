<template>
  <th :class="headClass">
    <slot />
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

interface TableHeadProps {
  class?: string
}

const props = defineProps<TableHeadProps>()

const headClass = computed(() => cn(
  'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  props.class
))
</script>