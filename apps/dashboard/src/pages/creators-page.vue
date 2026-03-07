<script lang="ts" setup>
import type { CreatorRow } from '@codemit/shared/api-contracts'
import { onMounted, ref } from 'vue'

import { fetchCreators } from '@/services/creators'

const creators = ref<CreatorRow[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const result = await fetchCreators()
    creators.value = result.data
  } catch {
    error.value = 'Failed to load creators'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="creators-page">
    <h1>Creators</h1>
    <p>Data is validated by shared API contracts.</p>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <ul>
      <li v-for="creator in creators" :key="creator.id">
        {{ creator.firstName }} {{ creator.lastName }} - {{ creator.subscriptionPlan }}
      </li>
    </ul>
  </section>
</template>
