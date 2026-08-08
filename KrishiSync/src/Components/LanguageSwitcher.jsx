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

  return (
    <div className="flex flex-wrap gap-1.5 p-1 w-full sm:w-auto items-center justify-start">
      {languages.map((lang) => {
        const isActive = currentLang.startsWith(lang.code);
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => i18n?.changeLanguage && i18n.changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm active:scale-95 border ${
              isActive
                ? 'bg-[#166534] text-white border-green-800 ring-2 ring-green-400/20'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
