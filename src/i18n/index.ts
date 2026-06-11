import { createI18n } from 'vue-i18n'
import en from './en'
import sk from './sk'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, sk },
  // Slovak plural rule: 1 → one, 2-4 → few, else → many. We use a simple
  // 3-form scheme (0/none | 1 | many) which the messages above follow.
  pluralRules: {
    sk: (choice: number, choicesLength: number) => {
      if (choice === 0) return 0
      if (choice === 1) return 1
      return choicesLength > 2 ? 2 : 1
    },
  },
})

export const t = i18n.global.t
