import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('lang', selectedLang);
  };

  return (
    <select
      className="form-select form-select-sm"
      style={{ width: 'auto' }}
      value={i18n.language}
      onChange={handleChange}
    >
      <option value="fr">Français 🇫🇷</option>
      <option value="en">English 🇬🇧</option>
      <option value="de">Deutsch 🇩🇪</option>
    </select>
  );
};

export default LanguageSelector;
