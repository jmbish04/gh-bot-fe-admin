<template>
  <tbody :class="bodyClass">
    <slot />
  </tbody>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

interface TableBodyProps {
  class?: string
}

const props = defineProps<TableBodyProps>()

const bodyClass = computed(() => cn(
  '[&_tr:last-child]:border-0',
  props.class
))
</script>