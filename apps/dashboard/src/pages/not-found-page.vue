<template>
  <section class="error-page" role="alert" aria-live="polite">
    <p class="code">404</p>
    <h1>Page not found</h1>
    <p class="message">The page you are looking for does not exist or has been moved.</p>
    <RouterLink to="/dashboard" class="action">Go to dashboard</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.error-page {
  min-height: calc(100vh - 140px);
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  gap: 12px;
}

.code {
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.08em;
  color: #64748b;
}

h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  color: #0f172a;
}

.message {
  margin: 0;
  max-width: 420px;
  color: #475569;
}

.action {
  margin-top: 8px;
  text-decoration: none;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  color: #0f172a;
  background: #fff;
}

.action:hover {
  background: #f8fafc;
}
</style>
