<template>
  <div :class="titleClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

interface CardTitleProps {
  class?: string
}

const props = defineProps<CardTitleProps>()

const titleClass = computed(() => cn(
  'font-semibold leading-none tracking-tight',
  props.class
))
</script>