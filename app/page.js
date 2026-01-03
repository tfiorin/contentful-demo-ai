'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Package, Shield, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Hero from '@/components/Hero';
import {
  ContentfulLivePreviewProvider,
  useContentfulInspectorMode,
} from '@contentful/live-preview/react';

/* ----------------------------------------
   INNER CLIENT (uses useSearchParams)
---------------------------------------- */
function HomeClient() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={isPreview}
      enableLiveUpdates={isPreview}
    >
      <HomeContent isPreview={isPreview} />
    </ContentfulLivePreviewProvider>
  );
}

/* ----------------------------------------
   CONTENT
---------------------------------------- */
function HomeContent({ isPreview }) {
  const [products, setProducts] = useState([]);
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart } = useCart();
  const { locale, t } = useLanguage();

  /* 🔵 Contentful Inspector */
  const inspector = useContentfulInspectorMode({
    entryId: landingPage?.sys?.id,
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/products?locale=${locale}&preview=${isPreview ? '1' : '0'}`
        );
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [locale, isPreview]);

  useEffect(() => {
    async function loadLandingPage() {
      try {
        const response = await fetch(
          `/api/landing?locale=${locale}&preview=${isPreview ? '1' : '0'}`
        );
        const data = await response.json();
        setLandingPage(data.landingPage);
      } catch (error) {
        console.error('Error loading landing page:', error);
      }
    }
    loadLandingPage();
  }, [locale, isPreview]);

  const itemCount = cart?.lines?.edges?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            PayCo
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              {t('products')}
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              {t('about')}
            </Link>
            <LanguageSwitcher />

            <button className="relative p-2 hover:bg-muted rounded-lg">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Now using Hero Component */}
      {landingPage?.fields?.hero && (
        <Hero hero={landingPage.fields.hero} isPreview={isPreview} />
      )}

      {/* Features */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Zap className="w-8 h-8 mx-auto text-primary mb-4" />
            <h3
              {...(isPreview ? inspector({ fieldId: 'leftFeature', target: 'fields.title' }) : {})}
              className="text-xl font-semibold mb-2"
            >
              {landingPage?.fields?.leftFeature?.fields?.title}
            </h3>
            <p
              {...(isPreview ? inspector({
                fieldId: 'leftFeature',
                target: 'fields.description',
              }) : {})}
              className="text-muted-foreground"
            >
              {landingPage?.fields?.leftFeature?.fields?.description}
            </p>
          </div>

          <div className="text-center p-6">
            <Shield className="w-8 h-8 mx-auto text-primary mb-4" />
            <h3
              {...(isPreview ? inspector({
                fieldId: 'middleFeature',
                target: 'fields.title',
              }) : {})}
              className="text-xl font-semibold mb-2"
            >
              {landingPage?.fields?.middleFeature?.fields?.title}
            </h3>
            <p
              {...(isPreview ? inspector({
                fieldId: 'middleFeature',
                target: 'fields.description',
              }) : {})}
              className="text-muted-foreground"
            >
              {landingPage?.fields?.middleFeature?.fields?.description}
            </p>
          </div>

          <div className="text-center p-6">
            <Package className="w-8 h-8 mx-auto text-primary mb-4" />
            <h3
              {...(isPreview ? inspector({
                fieldId: 'rightFeature',
                target: 'fields.title',
              }) : {})}
              className="text-xl font-semibold mb-2"
            >
              {landingPage?.fields?.rightFeature?.fields?.title}
            </h3>
            <p
              {...(isPreview ? inspector({
                fieldId: 'rightFeature',
                target: 'fields.description',
              }) : {})}
              className="text-muted-foreground"
            >
              {landingPage?.fields?.rightFeature?.fields?.description}
            </p>
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
                const productSlug = product.fields.slug || product.sys.id;
                
                return (
                  <Link
                    key={product.sys.id}
                    href={`/product/${productSlug}`}
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
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="font-semibold text-foreground">PayCo</p>
          <p className="text-sm mt-2">{t('footerTagline')}</p>
          <p className="text-sm mt-4">
            © {new Date().getFullYear()} PayCo. {t('allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ----------------------------------------
   PAGE EXPORT
---------------------------------------- */
export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  );
}