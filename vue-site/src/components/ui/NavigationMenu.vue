<script setup lang="ts">
import { NavigationMenuRoot, type NavigationMenuRootProps, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<NavigationMenuRootProps & { class?: string }>()
const emits = defineEmits<{
  'update:modelValue': [payload: string]
}>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <NavigationMenuRoot
    v-bind="forwarded"
    :class="cn('relative z-10 flex max-w-max flex-1 items-center justify-center', props.class)"
  >
    <slot />
  </NavigationMenuRoot>
</template>

