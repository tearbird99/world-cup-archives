import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enNav from '@/locales/en/nav.json'
import enHome from '@/locales/en/home.json'
import enPlayers from '@/locales/en/players.json'
import enCommon from '@/locales/en/common.json'

import koNav from '@/locales/ko/nav.json'
import koHome from '@/locales/ko/home.json'
import koPlayers from '@/locales/ko/players.json'
import koCommon from '@/locales/ko/common.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        nav: enNav,
        home: enHome,
        players: enPlayers,
        common: enCommon,
      },
      ko: {
        nav: koNav,
        home: koHome,
        players: koPlayers,
        common: koCommon,
      },
    },
    lng: localStorage.getItem('language') ?? 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n