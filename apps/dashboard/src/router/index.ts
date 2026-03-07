import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { getAccessToken } from '@/services/session'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workspace',
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/pages/auth-page.vue'),
    meta: { layout: 'auth', title: 'Auth', public: true },
  },
  {
    path: '/register',
    redirect: '/auth?mode=register',
  },
  {
    path: '/login',
    redirect: '/auth?mode=login',
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/pages/onboarding-page.vue'),
    meta: { layout: 'auth', title: 'Onboarding', public: true },
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('@/pages/workspace-page.vue'),
    meta: { layout: 'default', title: 'Workspace', requiresAuth: true },
  },
  {
    path: '/business/:businessId',
    name: 'business',
    component: () => import('@/pages/business-page.vue'),
    meta: { layout: 'default', title: 'Business', requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard-page.vue'),
    meta: { layout: 'default', title: 'Dashboard', requiresAuth: true },
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: () => import('@/pages/bookings-page.vue'),
    meta: { layout: 'default', title: 'Bookings', requiresAuth: true },
  },
  {
    path: '/creators',
    name: 'creators',
    component: () => import('@/pages/creators-page.vue'),
    meta: { layout: 'default', title: 'Creators', requiresAuth: true },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/pages/services-page.vue'),
    meta: { layout: 'default', title: 'Services', requiresAuth: true },
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('@/pages/clients-page.vue'),
    meta: { layout: 'default', title: 'Clients', requiresAuth: true },
  },
  {
    path: '/ai-assistant',
    name: 'ai-assistant',
    component: () => import('@/pages/ai-assistant-page.vue'),
    meta: { layout: 'default', title: 'AI Assistant', requiresAuth: true },
  },
  {
    path: '/telegram-bot',
    name: 'telegram-bot',
    component: () => import('@/pages/telegram-bot-page.vue'),
    meta: { layout: 'default', title: 'Telegram Bot', requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/notifications-page.vue'),
    meta: { layout: 'default', title: 'Notifications', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings-page.vue'),
    meta: { layout: 'default', title: 'Settings', requiresAuth: true },
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

router.beforeEach((to) => {
  const token = getAccessToken()
  const isPublic = Boolean(to.meta.public)
  const requiresAuth = Boolean(to.meta.requiresAuth)

  if (requiresAuth && !token) {
    return '/auth?mode=login'
  }

  if (isPublic && token && (to.path === '/auth' || to.path === '/login' || to.path === '/register')) {
    return '/workspace'
  }

  return true
})
