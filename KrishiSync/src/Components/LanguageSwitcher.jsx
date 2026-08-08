import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2 p-2">
      <button onClick={() => i18n.changeLanguage('en')} className="px-3 py-1 bg-gray-200 rounded font-bold">EN</button>
      <button onClick={() => i18n.changeLanguage('hi')} className="px-3 py-1 bg-green-200 rounded font-bold">हिंदी</button>
      <button onClick={() => i18n.changeLanguage('bn')} className="px-3 py-1 bg-yellow-200 rounded font-bold">বাংলা</button>
    </div>
  );
}