<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import { cancelInvite, createInvite, fetchBusiness, fetchInvites, updateBusiness } from '@/services/business'

type InviteItem = {
  id: string
  role: 'MANAGER' | 'EMPLOYEE' | 'OWNER'
  status: 'PENDING' | 'USED' | 'EXPIRED' | 'CANCELLED'
  expiresAt: string
  createdAt: string
}

const route = useRoute()
const businessId = computed(() => String(route.params.businessId))

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const inviteError = ref('')
const inviteModalOpen = ref(false)
const inviteLink = ref('')
const telegramShareUrl = ref('')

const business = reactive({
  name: '',
  category: '',
  aiFaq: '',
  membershipRole: 'EMPLOYEE' as 'OWNER' | 'MANAGER' | 'EMPLOYEE',
})

const inviteForm = reactive({
  role: 'EMPLOYEE' as 'MANAGER' | 'EMPLOYEE',
  expiresInHours: 48,
})

const invites = ref<InviteItem[]>([])

const canEdit = computed(() => business.membershipRole === 'OWNER' || business.membershipRole === 'MANAGER')

const loadBusiness = async () => {
  const response = await fetchBusiness(businessId.value)
  business.name = response.data.business.name
  business.category = response.data.business.category
  business.aiFaq = response.data.business.aiFaq
  business.membershipRole = response.data.membership.role
}

const loadInvites = async () => {
  const response = await fetchInvites(businessId.value)
  invites.value = response.data
}

const saveBusiness = async () => {
  if (!canEdit.value) return
  saving.value = true
  error.value = ''
  try {
    await updateBusiness(businessId.value, {
      name: business.name,
      category: business.category,
      aiFaq: business.aiFaq,
    })
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to update business'
  } finally {
    saving.value = false
  }
}

const submitInvite = async () => {
  inviteError.value = ''
  try {
    const response = await createInvite(businessId.value, inviteForm)
    inviteLink.value = response.data.inviteLink
    telegramShareUrl.value = response.data.telegramShareUrl
    await loadInvites()
  } catch (err: any) {
    inviteError.value = err?.response?.data?.message || 'Failed to create invite'
  }
}

const copyInviteLink = async () => {
  if (!inviteLink.value) return
  await navigator.clipboard.writeText(inviteLink.value)
}

const cancelInviteItem = async (inviteId: string) => {
  await cancelInvite(businessId.value, inviteId)
  await loadInvites()
}

onMounted(async () => {
  try {
    await loadBusiness()
    await loadInvites()
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load business'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="grid gap-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Business</h1>
        <p class="text-sm text-muted-foreground">
          Workspace role: <span class="font-medium">{{ business.membershipRole }}</span>
        </p>
      </div>

      <button
        class="rounded-md bg-sky-600 px-3 py-2 text-sm text-white disabled:opacity-60"
        :disabled="!canEdit"
        @click="inviteModalOpen = true"
      >
        Invite employee
      </button>
    </div>

    <p v-if="loading" class="text-sm text-muted-foreground">Loading...</p>
    <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>

    <div v-else class="grid gap-4">
      <section class="rounded-xl border border-border bg-card p-4">
        <h2 class="text-lg font-semibold">Business Settings</h2>
        <p class="mb-3 text-sm text-muted-foreground">
          Only OWNER and MANAGER can update these values.
        </p>
        <div class="grid gap-3">
          <input v-model="business.name" class="field" :disabled="!canEdit" placeholder="Business name" />
          <input v-model="business.category" class="field" :disabled="!canEdit" placeholder="Business category" />
          <textarea
            v-model="business.aiFaq"
            class="field min-h-28"
            :disabled="!canEdit"
            placeholder="AI FAQ"
          />
          <button class="rounded-md bg-sky-600 px-3 py-2 text-sm text-white disabled:opacity-60" :disabled="!canEdit || saving" @click="saveBusiness">
            Save settings
          </button>
        </div>
      </section>

      <section class="rounded-xl border border-border bg-card p-4">
        <h2 class="mb-3 text-lg font-semibold">Invites</h2>
        <table class="min-w-full text-left text-sm">
          <thead class="bg-muted/70 text-xs uppercase text-muted-foreground">
            <tr>
              <th class="px-3 py-2">Role</th>
              <th class="px-3 py-2">Status</th>
              <th class="px-3 py-2">Expires</th>
              <th class="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invites" :key="item.id" class="border-t border-border">
              <td class="px-3 py-2">{{ item.role }}</td>
              <td class="px-3 py-2">{{ item.status }}</td>
              <td class="px-3 py-2">{{ new Date(item.expiresAt).toLocaleString() }}</td>
              <td class="px-3 py-2">
                <button
                  v-if="item.status === 'PENDING' && canEdit"
                  class="rounded border border-slate-300 px-2 py-1 text-xs"
                  @click="cancelInviteItem(item.id)"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div v-if="inviteModalOpen" class="modal-backdrop">
      <div class="modal-card">
        <h3 class="text-lg font-semibold">Invite Employee</h3>
        <p class="text-sm text-muted-foreground">Role is enforced by the invite.</p>

        <label class="text-sm">Role</label>
        <select v-model="inviteForm.role" class="field">
          <option value="MANAGER">MANAGER</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
        </select>

        <label class="text-sm">Expires in hours</label>
        <input v-model.number="inviteForm.expiresInHours" class="field" type="number" min="1" max="168" />

        <button class="rounded-md bg-sky-600 px-3 py-2 text-sm text-white" @click="submitInvite">
          Create invite
        </button>

        <div v-if="inviteLink" class="grid gap-2 rounded-lg border border-border p-3">
          <p class="break-all text-xs">{{ inviteLink }}</p>
          <div class="flex gap-2">
            <button class="rounded border border-slate-300 px-2 py-1 text-xs" @click="copyInviteLink">
              Copy invite link
            </button>
            <a
              class="rounded border border-slate-300 px-2 py-1 text-xs"
              :href="telegramShareUrl"
              target="_blank"
              rel="noreferrer"
            >
              Share via Telegram
            </a>
          </div>
        </div>

        <p v-if="inviteError" class="text-sm text-red-600">{{ inviteError }}</p>

        <button class="rounded border border-slate-300 px-3 py-2 text-sm" @click="inviteModalOpen = false">
          Close
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.field {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 12px;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(2 6 23 / 45%);
  display: grid;
  place-items: center;
  z-index: 60;
}
.modal-card {
  width: min(460px, calc(100vw - 32px));
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 10px;
}
</style>
