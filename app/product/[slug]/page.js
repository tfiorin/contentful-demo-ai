'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Package, Minus, Plus, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';

function ProductDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { addToCart, checkout } = useCart();
  const { locale, t } = useLanguage();
  const isPreview = searchParams.get('preview') === '1';
  
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product from Contentful with locale using slug
        const productResponse = await fetch(`/api/products/${params.slug}?locale=${locale}&preview=${isPreview ? '1' : '0'}`);
        if (!productResponse.ok) {
          throw new Error('Product not found');
        }
        const productData = await productResponse.json();
        setProduct(productData.product);
        
        // Extract SKU - handle both reference and plain text formats
        let sku = productData.product.fields.sku;
        
        // If SKU is a reference object, extract the actual SKU value
        if (sku && typeof sku === 'object') {
          // Check if it's a Contentful reference with fields
          if (sku.fields) {
            // Try common field names for SKU
            sku = sku.fields.sku || sku.fields.skuCode || sku.fields.code || sku.fields.value;
          }
          // If still an object, try to find any string value
          if (typeof sku === 'object') {
            console.warn('SKU is still an object after extraction:', sku);
            sku = null;
          }
        }
        
        // Fetch inventory from Shopify using SKU
        if (sku) {
          try {
            const inventoryResponse = await fetch(`/api/shopify/inventory/${sku}`);
            const inventoryData = await inventoryResponse.json();
            setInventory(inventoryData);
          } catch (err) {
            console.error('Error loading inventory:', err);
            setInventory({ quantityAvailable: 0, availableForSale: false });
          }
        } else {
          console.warn('No valid SKU found for product');
          setInventory({ quantityAvailable: 0, availableForSale: false });
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      loadProduct();
    }
  }, [params.slug, locale, isPreview]);

  const handleAddToCart = async () => {
    if (!inventory?.variantId) {
      setError('Product variant not available');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      await addToCart(inventory.variantId, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!inventory?.variantId) {
      setError('Product variant not available');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      await addToCart(inventory.variantId, quantity);
      checkout();
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Failed to proceed to checkout. Please try again.');
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              PayCo
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-muted h-96 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
              <div className="h-24 bg-muted rounded animate-pulse"></div>
              <div className="h-12 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              PayCo
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('productNotFound')}</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToProducts')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract SKU for display - handle both reference and plain text
  let displaySku = product?.fields.sku;
  if (displaySku && typeof displaySku === 'object' && displaySku.fields) {
    displaySku = displaySku.fields.sku || displaySku.fields.skuCode || displaySku.fields.code || displaySku.fields.value || 'N/A';
  }

  const imageUrl = product?.fields.featuredProductImage?.fields?.file?.url;
  const productName = product?.fields.name || 'Product';
  const productDescription = product?.fields.description || t('noDescription');
  const productPrice = product?.fields.price;
  const quantityAvailable = inventory?.quantityAvailable || 0;
  const availableForSale = inventory?.availableForSale && quantityAvailable > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            PayCo
          </Link>
        </div>
      </nav>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToProducts')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative w-full bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
            {imageUrl ? (
              <Image
                src={`https:${imageUrl}`}
                alt={productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{productName}</h1>

              {productPrice && (
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary">
                    ${productPrice}
                  </p>
                </div>
              )}

              {displaySku && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">SKU: {displaySku}</p>
                </div>
              )}

              {/* Availability */}
              <div className="mb-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  {availableForSale ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">{t('inStock')}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <span className="font-semibold text-destructive">{t('outOfStock')}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {quantityAvailable > 0 
                    ? `${quantityAvailable} ${quantityAvailable === 1 ? t('unitAvailable') : t('unitsAvailable')}` 
                    : t('currentlyUnavailable')}
                </p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">{t('description')}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {productDescription}
                </p>
              </div>

              {/* Quantity Selector */}
              {availableForSale && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">{t('quantity')}</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(quantityAvailable, quantity + 1))}
                      disabled={quantity >= quantityAvailable}
                      className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {addedSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {t('addedSuccess')}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!availableForSale || adding}
                  className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {adding ? t('adding') : t('addToCart')}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!availableForSale || adding}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {adding ? t('processing') : t('buyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={isPreview}
      enableLiveUpdates={isPreview}
    >
      <ProductDetailContent />
    </ContentfulLivePreviewProvider>
  );
}