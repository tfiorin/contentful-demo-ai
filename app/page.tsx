'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Package, Shield, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Product } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { cart } = useCart();
  const { locale, t } = useLanguage();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?locale=${locale}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [locale]);

  const itemCount = cart?.lines?.edges?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              PayCo
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                {t('products')}
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t('about')}
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t('contact')}
              </Link>
              <LanguageSwitcher />
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('heroDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#products" 
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
              >
                {t('shopNow')}
              </a>
              <a 
                href="#features" 
                className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                {t('learnMore')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('fastReliable')}</h3>
              <p className="text-muted-foreground">
                {t('fastReliableDesc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('securePayments')}</h3>
              <p className="text-muted-foreground">
                {t('securePaymentsDesc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('qualityHardware')}</h3>
              <p className="text-muted-foreground">
                {t('qualityHardwareDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('ourProducts')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('exploreProducts')}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden bg-card animate-pulse">
                  <div className="bg-muted h-48"></div>
                  <div className="p-4">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t('noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const imageUrl = product.fields.featuredProductImage?.fields?.file?.url;
                const productName = product.fields.name || 'Product';
                const productPrice = product.fields.price || 'N/A';
                
                return (
                  <Link
                    key={product.sys.id}
                    href={`/product/${product.sys.id}`}
                    className="group border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-card"
                  >
                    <div className="relative w-full bg-muted overflow-hidden" style={{ height: '192px' }}>
                      {imageUrl ? (
                        <Image
                          src={`https:${imageUrl}`}
                          alt={productName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {productName}
                      </h3>
                      {productPrice !== 'N/A' && (
                        <p className="text-primary font-bold">
                          ${productPrice}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">PayCo</p>
            <p className="text-sm">
              {t('footerTagline')}
            </p>
            <p className="text-sm mt-4">
              © {new Date().getFullYear()} PayCo. {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
