<script lang="ts" setup>
import { ArrowUpRight, CalendarClock, DollarSign, Users } from 'lucide-vue-next'

import UiBadge from '@/components/ui/badge.vue'
import UiButton from '@/components/ui/button.vue'
import UiCard from '@/components/ui/card.vue'

const stats = [
  { title: 'Monthly Revenue', value: '$12,480', change: '+18.2%', icon: DollarSign },
  { title: 'Active Clients', value: '148', change: '+9 this week', icon: Users },
  { title: 'Upcoming Bookings', value: '26', change: '3 today', icon: CalendarClock },
]

const activity = [
  { label: 'New creator onboarding', time: '10 minutes ago', badge: 'New' },
  { label: 'Client payment received', time: '42 minutes ago', badge: 'Income' },
  { label: 'Telegram campaign scheduled', time: '2 hours ago', badge: 'Bot' },
]
</script>

<template>
  <section class="grid w-full gap-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="space-y-1">
        <h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p class="text-sm text-muted-foreground md:text-base">
          Minimal overview of revenue, client activity, and quick actions.
        </p>
      </div>
      <UiButton>
        Create report
        <ArrowUpRight class="ml-1.5 h-4 w-4" />
      </UiButton>
    </header>

    <div class="grid gap-4 xl:grid-cols-3">
      <UiCard v-for="item in stats" :key="item.title" class="p-5">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm text-muted-foreground">{{ item.title }}</p>
          <component :is="item.icon" class="h-4 w-4 text-muted-foreground" />
        </div>
        <p class="text-2xl font-semibold">{{ item.value }}</p>
        <p class="mt-2 text-xs text-muted-foreground">{{ item.change }}</p>
      </UiCard>
    </div>

    <div class="grid gap-4 xl:grid-cols-3">
      <UiCard class="p-5 lg:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-medium">Recent Activity</h2>
          <UiBadge variant="secondary">Live</UiBadge>
        </div>

        <ul class="grid gap-3">
          <li
            v-for="event in activity"
            :key="event.label"
            class="flex items-center justify-between rounded-md border border-border p-3"
          >
            <div>
              <p class="text-sm font-medium">{{ event.label }}</p>
              <p class="text-xs text-muted-foreground">{{ event.time }}</p>
            </div>
            <UiBadge variant="outline">{{ event.badge }}</UiBadge>
          </li>
        </ul>
      </UiCard>

      <UiCard class="flex flex-col gap-3 p-5">
        <h2 class="text-sm font-medium">Quick Actions</h2>
        <UiButton class="w-full justify-start" variant="secondary">Add creator</UiButton>
        <UiButton class="w-full justify-start" variant="secondary">Create booking</UiButton>
        <UiButton class="w-full justify-start" variant="outline">Open notifications</UiButton>
      </UiCard>
    </div>
  </section>
</template>
