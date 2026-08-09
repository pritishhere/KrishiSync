import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = typeof i18n?.language === 'string' ? i18n.language : 'en';

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'bn', label: 'বাংলা' },
  ];

  const handleLanguageChange = (langCode) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(langCode);
      localStorage.setItem('krishi_lang', langCode);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-1 w-full sm:w-auto items-center justify-start">
      {languages.map((lang) => {
        const isActive = currentLang.startsWith(lang.code);
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all duration-200 shadow-sm active:scale-95 border ${
              isActive
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-emerald-700/30 ring-2 ring-emerald-400/30 scale-102'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}