<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeVariant = 'default' | 'secondary' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  class?: string
}

const props = defineProps<BadgeProps>()
const classes = computed(() => cn(badgeVariants({ variant: props.variant }), props.class))
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
