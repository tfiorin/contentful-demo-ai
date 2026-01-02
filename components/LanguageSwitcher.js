'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useLanguage();

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        onClick={() => changeLocale(locale === 'en' ? 'de' : 'en')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{locale}</span>
      </button>
    </div>
  );
}