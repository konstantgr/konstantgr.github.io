<template>
  <div :class="cn('rounded-lg border border-border bg-background shadow-sm hover:shadow-md transition-all duration-200', className)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  className?: string
}>()
</script>

