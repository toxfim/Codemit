<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { loginLocal } from '@/services/auth'
import { setAccessToken } from '@/services/session'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await loginLocal(form)
    setAccessToken(response.data.accessToken)
    await router.push('/workspace')
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto grid max-w-md gap-4">
    <h1 class="text-2xl font-semibold">Login</h1>
    <p class="text-sm text-muted-foreground">Sign in to access your workspaces.</p>

    <input v-model="form.email" class="field" placeholder="Email" type="email" />
    <input v-model="form.password" class="field" placeholder="Password" type="password" />
    <button class="btn" :disabled="loading" @click="handleSubmit">Login</button>

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
