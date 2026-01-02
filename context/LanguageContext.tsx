'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, TranslationDictionary } from '@/types';

interface LanguageContextType {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: TranslationDictionary = {
  en: {
    // Navigation
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Advanced Commerce Solutions',
    heroDescription: 'PayCo provides advanced, technology-based commerce solutions for all types of businesses. Discover our cutting-edge hardware products designed to power your success.',
    shopNow: 'Shop Now',
    learnMore: 'Learn More',
    
    // Features
    fastReliable: 'Fast & Reliable',
    fastReliableDesc: 'Industry-leading performance and reliability for your business operations',
    securePayments: 'Secure Payments',
    securePaymentsDesc: 'Bank-level security with end-to-end encryption for all transactions',
    qualityHardware: 'Quality Hardware',
    qualityHardwareDesc: 'Premium hardware designed and tested for demanding business environments',
    
    // Products
    ourProducts: 'Our Products',
    exploreProducts: 'Explore our range of professional hardware solutions',
    noProducts: 'No products available at the moment.',
    
    // Product Detail
    backToProducts: 'Back to Products',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    unitsAvailable: 'units available',
    unitAvailable: 'unit available',
    currentlyUnavailable: 'Currently unavailable',
    description: 'Description',
    noDescription: 'No description available',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    adding: 'Adding...',
    processing: 'Processing...',
    addedSuccess: 'Added to cart successfully!',
    productNotFound: 'Product Not Found',
    productNotFoundMsg: 'Product not found',
    
    // Footer
    footerTagline: 'Advanced, technology-based commerce solutions for all types of businesses',
    allRightsReserved: 'All rights reserved.',
  },
  de: {
    // Navigation
    products: 'Produkte',
    about: 'Über uns',
    contact: 'Kontakt',
    
    // Hero Section
    heroTitle: 'Fortschrittliche Commerce-Lösungen',
    heroDescription: 'PayCo bietet fortschrittliche, technologiebasierte Commerce-Lösungen für alle Arten von Unternehmen. Entdecken Sie unsere hochmodernen Hardware-Produkte, die Ihren Erfolg vorantreiben.',
    shopNow: 'Jetzt einkaufen',
    learnMore: 'Mehr erfahren',
    
    // Features
    fastReliable: 'Schnell & Zuverlässig',
    fastReliableDesc: 'Branchenführende Leistung und Zuverlässigkeit für Ihren Geschäftsbetrieb',
    securePayments: 'Sichere Zahlungen',
    securePaymentsDesc: 'Sicherheit auf Bankniveau mit Ende-zu-Ende-Verschlüsselung für alle Transaktionen',
    qualityHardware: 'Qualitäts-Hardware',
    qualityHardwareDesc: 'Premium-Hardware, entwickelt und getestet für anspruchsvolle Geschäftsumgebungen',
    
    // Products
    ourProducts: 'Unsere Produkte',
    exploreProducts: 'Entdecken Sie unser Sortiment an professionellen Hardware-Lösungen',
    noProducts: 'Derzeit sind keine Produkte verfügbar.',
    
    // Product Detail
    backToProducts: 'Zurück zu Produkten',
    inStock: 'Auf Lager',
    outOfStock: 'Ausverkauft',
    unitsAvailable: 'Einheiten verfügbar',
    unitAvailable: 'Einheit verfügbar',
    currentlyUnavailable: 'Derzeit nicht verfügbar',
    description: 'Beschreibung',
    noDescription: 'Keine Beschreibung verfügbar',
    quantity: 'Menge',
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt kaufen',
    adding: 'Wird hinzugefügt...',
    processing: 'Wird verarbeitet...',
    addedSuccess: 'Erfolgreich zum Warenkorb hinzugefügt!',
    productNotFound: 'Produkt nicht gefunden',
    productNotFoundMsg: 'Produkt nicht gefunden',
    
    // Footer
    footerTagline: 'Fortschrittliche, technologiebasierte Commerce-Lösungen für alle Arten von Unternehmen',
    allRightsReserved: 'Alle Rechte vorbehalten.',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Load saved language preference
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale || 'en';
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        changeLocale,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}