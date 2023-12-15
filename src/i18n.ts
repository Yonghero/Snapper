import { createI18n } from 'vue-i18n'
import enTranslation from './locales/en.json'
import zhTranslation from './locales/zh.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    en: enTranslation,
    zh: zhTranslation,
  },
})
