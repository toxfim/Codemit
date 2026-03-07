<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { completeOnboarding, resolveOnboarding } from '@/services/onboarding'
import { setAccessToken } from '@/services/session'

const route = useRoute()
const router = useRouter()
const token = computed(() => String(route.query.token || ''))

const form = reactive({
  fullName: '',
  password: '',
})

const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const inviteInfo = ref<{ role: string; businessId: string } | null>(null)

const submit = async () => {
  if (!token.value) return
  submitting.value = true
  error.value = ''
  try {
    const response = await completeOnboarding({
      token: token.value,
      fullName: form.fullName,
      password: form.password,
    })
    setAccessToken(response.data.accessToken)
    await router.push('/workspace')
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to complete onboarding'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!token.value) {
    error.value = 'Missing token'
    loading.value = false
    return
  }

  try {
    const response = await resolveOnboarding(token.value)
    inviteInfo.value = response.data
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Invalid onboarding token'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="mx-auto grid max-w-md gap-4">
    <h1 class="text-2xl font-semibold">Complete Onboarding</h1>
    <p v-if="inviteInfo" class="text-sm text-muted-foreground">
      Role from invite: <span class="font-medium">{{ inviteInfo.role }}</span>
    </p>
    <p v-if="loading" class="text-sm text-muted-foreground">Validating invite...</p>

    <template v-else-if="!error">
      <input v-model="form.fullName" class="field" placeholder="Full name" />
      <input v-model="form.password" class="field" placeholder="Password" type="password" />
      <button class="btn" :disabled="submitting" @click="submit">Complete onboarding</button>
    </template>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </section>
</template>

<style scoped>
.field {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 12px;
}
.btn {
  border: 0;
  border-radius: 10px;
  background: #0284c7;
  color: #fff;
  padding: 10px 12px;
  cursor: pointer;
}
</style>
