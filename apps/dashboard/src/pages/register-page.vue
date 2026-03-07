<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { loginGoogle, registerOwner } from '@/services/auth'
import { setAccessToken, setSelectedBusinessId } from '@/services/session'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  businessName: '',
  businessCategory: '',
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await registerOwner(form)
    const data = response.data
    setAccessToken(data.accessToken)
    if (data.business?.id) setSelectedBusinessId(data.business.id)
    await router.push('/workspace')
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}

const handleGoogleMock = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await loginGoogle({
      googleId: `google_${crypto.randomUUID()}`,
      email: form.email || `user_${Date.now()}@gmail.com`,
      fullName: form.fullName || 'Google User',
    })
    const data = response.data
    setAccessToken(data.accessToken)
    if (data.business?.id) setSelectedBusinessId(data.business.id)
    await router.push('/workspace')
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Google auth failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto grid max-w-md gap-4">
    <h1 class="text-2xl font-semibold">Register Business Owner</h1>
    <p class="text-sm text-muted-foreground">
      Register with form or continue with Google to create your default workspace.
    </p>

    <input v-model="form.fullName" class="field" placeholder="Full name" />
    <input v-model="form.email" class="field" placeholder="Email" type="email" />
    <input v-model="form.password" class="field" placeholder="Password" type="password" />
    <input v-model="form.businessName" class="field" placeholder="Business name (optional)" />
    <input v-model="form.businessCategory" class="field" placeholder="Business category (optional)" />

    <button class="btn" :disabled="loading" @click="handleSubmit">Register</button>
    <button class="btn btn-secondary" :disabled="loading" @click="handleGoogleMock">
      Continue with Google
    </button>

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
.btn-secondary {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
