<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { fetchWorkspaces } from '@/services/workspace'

type WorkspaceItem = {
  membershipId: string
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE'
  business: {
    id: string
    name: string
    category: string
    aiFaq: string
    ownerUserId: string
  }
}

const router = useRouter()
const items = ref<WorkspaceItem[]>([])
const loading = ref(true)
const error = ref('')

const openBusiness = async (businessId: string) => {
  await router.push(`/business/${businessId}`)
}

onMounted(async () => {
  try {
    const response = await fetchWorkspaces()
    items.value = response.data
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load workspaces'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="grid gap-4">
    <div>
      <h1 class="text-2xl font-semibold">Workspace</h1>
      <p class="text-sm text-muted-foreground">Select a business to manage or review.</p>
    </div>

    <p v-if="loading" class="text-sm text-muted-foreground">Loading...</p>
    <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
    <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in items"
        :key="item.membershipId"
        class="rounded-xl border border-border bg-card p-4"
      >
        <h2 class="text-lg font-semibold">{{ item.business.name }}</h2>
        <p class="text-sm text-muted-foreground">{{ item.business.category }}</p>
        <p class="mt-1 text-xs text-muted-foreground">Role: {{ item.role }}</p>
        <button class="mt-3 rounded-md bg-sky-600 px-3 py-2 text-sm text-white" @click="openBusiness(item.business.id)">
          Open business
        </button>
      </article>
    </div>
  </section>
</template>
