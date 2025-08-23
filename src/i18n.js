import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';

// Ressources traduites
const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  de: { translation: translationDE },
};

// Récupérer la langue manuellement choisie si elle existe
const savedLang = localStorage.getItem('lang');

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang || undefined, // Utilise celle enregistrée sinon laisse détecter
    fallbackLng: 'fr', // Langue par défaut
    interpolation: {
      escapeValue: false, // React gère l’échappement
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
