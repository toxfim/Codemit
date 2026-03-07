<template>
  <header>
    <a class="header-link" href="/">
      <img class="logo" src="/logo.png" alt="Codemit Logo" />
      <span>Codemit.</span>
    </a>
  </header>
</template>

<style scoped>
header {
  padding-bottom: 18px;
}
.header-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #111827;
}

.logo {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgb(17 24 39 / 16%);
}

.header-link span {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
</style>
