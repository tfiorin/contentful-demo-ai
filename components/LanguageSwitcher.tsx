'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { Locale } from '@/types';

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useLanguage();

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'de' : 'en';
    changeLocale(newLocale);
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        onClick={toggleLanguage}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{locale}</span>
      </button>
    </div>
  );
}