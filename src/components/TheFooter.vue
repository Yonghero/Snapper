<script setup="ts">
import { i18n } from '~/i18n'

function toggleDarkMode() {
  toggleDark()

  if (!Array.from(document.getElementsByTagName('html')[0].classList).includes('dark'))
    document.body.setAttribute('arco-theme', 'dark')

  else
    document.body.removeAttribute('arco-theme')
}

const localeValue = ref('zh')

const options = [
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
]

function changeLanguage(v) {
  i18n.global.locale.value = v
}
toggleDarkMode()
</script>

<template>
  <nav mt-6 inline-flex gap-2 text-xl>
    <img src="../assets/logo.png" alt="" class="w-10">

    <a-trigger
      trigger="hover"
      :popup-translate="[0, -10]"
    >
      <div i-uil:english-to-chinese cursor-pointer />

      <template #content>
        <div
          class="bg-[var(--color-bg-popup)]"
          h-20 w-20 rounded p-3 shadow
          flex="~ col items-center gap-y-3"
        >
          <a-radio-group
            v-model="localeValue"
            direction="vertical"
            :options="options"
            @change="changeLanguage"
          />
        </div>
      </template>
    </a-trigger>

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
