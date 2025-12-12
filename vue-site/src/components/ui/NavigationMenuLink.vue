<script setup lang="ts">
import { NavigationMenuLink, type NavigationMenuLinkProps } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<NavigationMenuLinkProps & { 
  class?: string
  active?: boolean
}>()

const linkClass = computed(() => cn(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
  props.active && 'bg-accent/50 font-semibold',
  props.class
))
</script>

<template>
  <NavigationMenuLink
    v-bind="props"
    :class="linkClass"
  >
    <slot />
  </NavigationMenuLink>
</template>

