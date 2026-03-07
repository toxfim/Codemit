<template>
  <div class="auth-layout">
    <div class="auth-glow auth-glow--one" />
    <div class="auth-glow auth-glow--two" />
    <main class="auth-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(1200px 500px at 10% -20%, rgb(2 132 199 / 25%), transparent),
    radial-gradient(900px 500px at 100% 0%, rgb(14 165 233 / 20%), transparent),
    linear-gradient(160deg, #020617 0%, #0f172a 55%, #111827 100%);
}

.auth-main {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(55px);
}

.auth-glow--one {
  width: 360px;
  height: 360px;
  top: 8%;
  left: -80px;
  background: rgb(14 165 233 / 38%);
}

.auth-glow--two {
  width: 420px;
  height: 420px;
  right: -120px;
  bottom: -100px;
  background: rgb(2 132 199 / 34%);
}
</style>
