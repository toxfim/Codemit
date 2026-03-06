<script lang="ts" setup>
interface Creator {
  firstName: string | undefined
  lastName: string | undefined
  phone: string | undefined
  role: 'MANAGER' | 'EMPLOYEE' | undefined
  telegramId: string | undefined
  subscriptionPlan: 'FREE' | 'PRO' | 'BASIC' | undefined
}

import { ref } from 'vue'

const creators = ref<Creator[]>([])



</script>

<template>
  <section class="creators-page">
    <h1>Creators</h1>
    <p>This page is under construction. Stay tuned for updates!</p>
    <ul>
      <li v-for="creator in creators" :key="creator.telegramId">
        {{ creator.firstName }} {{ creator.lastName }} - {{ creator.subscriptionPlan }}
      </li>
    </ul>
  </section>
</template>
