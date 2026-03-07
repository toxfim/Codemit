<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppHeader from '@/components/app-header.vue'

const route = useRoute()

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/services', label: 'Services' },
  { to: '/creators', label: 'Creators' },
  { to: '/clients', label: 'Clients' },
  { to: '/ai-assistant', label: 'AI Assistant' },
  { to: '/telegram-bot', label: 'Telegram Bot' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/settings', label: 'Settings' },
] as const

const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <app-header />

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="nav-link--active"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <footer class="sidebar-footer">
        <div class="user">
          <span class="avatar">JD</span>
          <div>
            <p>John Doe</p>
            <small>Business Owner</small>
          </div>
        </div>
      </footer>
    </aside>

    <div class="main">
      <header class="header">
        <h2>{{ pageTitle }}</h2>

        <div class="header-actions">
          <button class="notification-btn" type="button">Alerts</button>
        </div>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 248px 1fr;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.sidebar {
  display: grid;
  grid-template-rows: auto 1fr auto;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  background: #fff;
}

.sidebar-nav {
  display: grid;
  gap: 8px;
  align-content: start;
  margin-top: 12px;
}

.nav-link {
  text-decoration: none;
  color: #334155;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 500;
  transition: background-color 0.15s ease;
}

.nav-link:hover {
  background: #f1f5f9;
}

.nav-link--active {
  background: #dbeafe;
  color: #0f172a;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: 12px;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
}

.user {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #0ea5e9;
  color: #fff;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
}

.user p,
.user small {
  margin: 0;
}

.main {
  display: grid;
  grid-template-rows: 64px 1fr;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #e2e8f0;
  background: rgb(248 250 252 / 75%);
  backdrop-filter: blur(6px);
}

.header h2 {
  margin: 0;
}

.content {
  padding: 28px;
  overflow-y: auto;
}

.notification-btn {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #fff;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 500;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: 0;
    border-bottom: 1px solid #e5e7eb;
    grid-template-rows: auto auto auto;
  }

  .main {
    grid-template-rows: auto 1fr;
  }
}
</style>
