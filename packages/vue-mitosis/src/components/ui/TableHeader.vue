<template>
  <thead :class="headerClass">
    <slot />
  </thead>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

interface TableHeaderProps {
  class?: string
}

const props = defineProps<TableHeaderProps>()

const headerClass = computed(() => cn(
  '[&_tr]:border-b',
  props.class
))
</script>