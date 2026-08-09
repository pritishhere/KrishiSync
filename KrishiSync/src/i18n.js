import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './Locales/en.json';
import hiTranslation from './Locales/hi.json';
import bnTranslation from './Locales/bn.json';

const savedLang = localStorage.getItem('krishi_lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
    bn: { translation: bnTranslation }
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('krishi_lang', lng);
});

export default i18n;
