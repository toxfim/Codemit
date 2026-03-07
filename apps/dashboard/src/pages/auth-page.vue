<script setup lang="ts">
import {
  BriefcaseBusiness,
  Lock,
  LogIn,
  Mail,
  UserRound,
} from 'lucide-vue-next'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import UiButton from '@/components/ui/button.vue'
import UiCard from '@/components/ui/card.vue'
import { loginGoogle, loginLocal, registerOwner } from '@/services/auth'
import { setAccessToken, setSelectedBusinessId } from '@/services/session'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')

const mode = computed<'login' | 'register'>(() =>
  route.query.mode === 'register' ? 'register' : 'login',
)

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  fullName: '',
  email: '',
  password: '',
  businessName: '',
  businessCategory: '',
})

const switchMode = async (next: 'login' | 'register') => {
  await router.replace({ path: '/auth', query: { mode: next } })
  error.value = ''
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await loginLocal(loginForm)
    setAccessToken(response.data.accessToken)
    await router.push('/workspace')
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await registerOwner(registerForm)
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

const handleGoogle = async () => {
  loading.value = true
  error.value = ''
  try {
    const fullName =
      mode.value === 'register'
        ? registerForm.fullName || 'Google User'
        : 'Google User'
    const email =
      mode.value === 'register'
        ? registerForm.email || `user_${Date.now()}@gmail.com`
        : loginForm.email || `user_${Date.now()}@gmail.com`

    const response = await loginGoogle({
      googleId: `google_${crypto.randomUUID()}`,
      email,
      fullName,
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
  <UiCard class="w-full max-w-md border-white/25 bg-white/90 p-6 backdrop-blur">
    <div class="mb-5">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Codemit Workspace</p>
      <h1 class="mt-2 text-2xl font-semibold text-slate-900">
        {{ mode === 'login' ? 'Welcome back' : 'Create your account' }}
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        {{ mode === 'login' ? 'Sign in to continue' : 'Register as owner and get default workspace' }}
      </p>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
      <button
        class="rounded-lg px-3 py-2 text-sm font-medium"
        :class="mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'"
        @click="switchMode('login')"
      >
        Login
      </button>
      <button
        class="rounded-lg px-3 py-2 text-sm font-medium"
        :class="mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'"
        @click="switchMode('register')"
      >
        Register
      </button>
    </div>

    <form v-if="mode === 'login'" class="grid gap-3" @submit.prevent="handleLogin">
      <label class="field-label">
        <Mail class="h-4 w-4 text-slate-500" />
        <input v-model="loginForm.email" class="field-input" placeholder="Email" type="email" />
      </label>

      <label class="field-label">
        <Lock class="h-4 w-4 text-slate-500" />
        <input v-model="loginForm.password" class="field-input" placeholder="Password" type="password" />
      </label>

      <UiButton :disabled="loading" type="submit">
        <LogIn class="mr-2 h-4 w-4" />
        Login
      </UiButton>
    </form>

    <form v-else class="grid gap-3" @submit.prevent="handleRegister">
      <label class="field-label">
        <UserRound class="h-4 w-4 text-slate-500" />
        <input v-model="registerForm.fullName" class="field-input" placeholder="Full name" />
      </label>

      <label class="field-label">
        <Mail class="h-4 w-4 text-slate-500" />
        <input v-model="registerForm.email" class="field-input" placeholder="Email" type="email" />
      </label>

      <label class="field-label">
        <Lock class="h-4 w-4 text-slate-500" />
        <input v-model="registerForm.password" class="field-input" placeholder="Password" type="password" />
      </label>

      <label class="field-label">
        <BriefcaseBusiness class="h-4 w-4 text-slate-500" />
        <input
          v-model="registerForm.businessName"
          class="field-input"
          placeholder="Business name (optional)"
        />
      </label>

      <input
        v-model="registerForm.businessCategory"
        class="field-input field-input--plain"
        placeholder="Business category (optional)"
      />

      <UiButton :disabled="loading" type="submit">Create account</UiButton>
    </form>

    <UiButton class="mt-3 w-full" variant="outline" :disabled="loading" @click="handleGoogle">
      Continue with Google
    </UiButton>

    <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
  </UiCard>
</template>

<style scoped>
.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #fff;
  padding: 0 12px;
}

.field-input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 11px 0;
}

.field-input--plain {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 11px 12px;
  background: #fff;
}
</style>
