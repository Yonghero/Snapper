<script setup="ts">
function toggleDarkMode() {
  toggleDark()

  if (!Array.from(document.getElementsByTagName('html')[0].classList).includes('dark'))
    document.body.setAttribute('arco-theme', 'dark')

  else
    document.body.removeAttribute('arco-theme')
}
</script>

<template>
  <nav mt-6 inline-flex gap-2 text-xl>
    <button
      icon-btn @click="toggleDarkMode"
    >
      <div i-carbon-sun dark:i-carbon-moon />
    </button>

    <a
      icon-btn i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/Yonghero/Snapper"
      target="_blank"
      title="GitHub"
    />
  </nav>
</template>
