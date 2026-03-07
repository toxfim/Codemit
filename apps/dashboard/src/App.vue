<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import DefaultLayout from '@/layouts/default-layout.vue'
import DashboardLayout from '@/layouts/dashboard-layout.vue'
import AuthLayout from '@/layouts/auth-layout.vue'

const route = useRoute()

const layouts = {
  default: DefaultLayout,
  dashboard: DashboardLayout,
  auth: AuthLayout,
}

const currentLayout = computed(() => {
  return layouts[route.meta.layout as keyof typeof layouts] || DefaultLayout
})
</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>
