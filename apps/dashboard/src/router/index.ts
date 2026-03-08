import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workspace',
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('@/pages/workspace-page.vue'),
    meta: { layout: 'default', title: 'Workspace' },
  },
  {
    path: '/business/:businessId',
    name: 'business',
    component: () => import('@/pages/business-page.vue'),
    meta: { layout: 'default', title: 'Business' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard-page.vue'),
    meta: { layout: 'default', title: 'Dashboard' },
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: () => import('@/pages/bookings-page.vue'),
    meta: { layout: 'default', title: 'Bookings' },
  },
  {
    path: '/creators',
    name: 'creators',
    component: () => import('@/pages/creators-page.vue'),
    meta: { layout: 'default', title: 'Creators' },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/pages/services-page.vue'),
    meta: { layout: 'default', title: 'Services' },
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('@/pages/clients-page.vue'),
    meta: { layout: 'default', title: 'Clients' },
  },
  {
    path: '/ai-assistant',
    name: 'ai-assistant',
    component: () => import('@/pages/ai-assistant-page.vue'),
    meta: { layout: 'default', title: 'AI Assistant' },
  },
  {
    path: '/telegram-bot',
    name: 'telegram-bot',
    component: () => import('@/pages/telegram-bot-page.vue'),
    meta: { layout: 'default', title: 'Telegram Bot' },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/notifications-page.vue'),
    meta: { layout: 'default', title: 'Notifications' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings-page.vue'),
    meta: { layout: 'default', title: 'Settings' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found-page.vue'),
    meta: { layout: 'default', title: '404 Not Found' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
