<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <article :class="cn('rounded-xl border border-border bg-card text-card-foreground shadow-sm', $props.class)">
    <slot />
  </article>
</template>
