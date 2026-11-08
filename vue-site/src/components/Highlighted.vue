<template>
  <template v-for="(part, i) in parts" :key="i">
    <mark v-if="part.highlight" class="hl">{{ part.text }}</mark>
    <template v-else>{{ part.text }}</template>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/** Renders text, wrapping segments marked as ==like this== in a highlight. */
const props = defineProps<{ text: string }>()

const parts = computed(() =>
  props.text
    .split('==')
    .map((text, i) => ({ text, highlight: i % 2 === 1 }))
    .filter((part) => part.text),
)
</script>

<style scoped>
.hl {
  background: rgba(7, 195, 242, 0.3);
  color: inherit;
  padding: 0.05em 0.15em;
  border-radius: 3px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  font-weight: 500;
}
</style>
