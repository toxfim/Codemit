<template>
  <div class="layout">
    <header class="topbar">Dashboard Workspace</header>

    <main class="body">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 56px 1fr;
  background: #f8fafc;
}

.topbar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.body {
  padding: 20px;
}
</style>
