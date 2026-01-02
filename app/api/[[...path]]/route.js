import { NextResponse } from 'next/server';
import { fetchProducts, fetchProductById } from '@/lib/contentful';
import { getShopifyClient } from '@/lib/shopify';
import { QUERY_PRODUCT_BY_SKU } from '@/lib/shopify/queries';
import { CREATE_CART, ADD_TO_CART } from '@/lib/shopify/mutations';

export async function GET(request) {
  const pathname = new URL(request.url).pathname;
  const searchParams = new URL(request.url).searchParams;
  const locale = searchParams.get('locale') || 'en';
  const segments = pathname.split('/').filter(Boolean);

  // Remove 'api' from segments
  const apiIndex = segments.indexOf('api');
  if (apiIndex !== -1) {
    segments.splice(0, apiIndex + 1);
  }

  try {
    // GET /api/products - Fetch all products from Contentful
    if (segments[0] === 'products' && segments.length === 1) {
      const products = await fetchProducts(locale);
      return NextResponse.json({ products });
    }

    // GET /api/products/:id - Fetch single product from Contentful
    if (segments[0] === 'products' && segments.length === 2) {
      const productId = segments[1];
      const product = await fetchProductById(productId, locale);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ product });
    }

    // GET /api/shopify/inventory/:sku - Fetch inventory from Shopify by SKU
    if (segments[0] === 'shopify' && segments[1] === 'inventory' && segments.length === 3) {
      const sku = segments[2];
      const client = getShopifyClient();
      
      const data = await client.request(QUERY_PRODUCT_BY_SKU, {
        query: `sku:${sku}`,
      });
      
      if (!data.products.edges.length) {
        return NextResponse.json(
          { error: 'Product not found in Shopify', quantityAvailable: 0, availableForSale: false },
          { status: 404 }
        );
      }
      
      const product = data.products.edges[0].node;
      const variant = product.variants.edges[0]?.node;
      
      return NextResponse.json({
        productId: product.id,
        variantId: variant?.id,
        sku: variant?.sku,
        quantityAvailable: variant?.quantityAvailable || 0,
        availableForSale: variant?.availableForSale || false,
        price: variant?.price,
      });
    }

    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split('/').filter(Boolean);

  // Remove 'api' from segments
  const apiIndex = segments.indexOf('api');
  if (apiIndex !== -1) {
    segments.splice(0, apiIndex + 1);
  }

  try {
    // POST /api/cart/create - Create a new Shopify cart
    if (segments[0] === 'cart' && segments[1] === 'create') {
      const client = getShopifyClient();
      const data = await client.request(CREATE_CART);
      
      if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
        return NextResponse.json(
          { error: data.cartCreate.userErrors[0].message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        cartId: data.cartCreate.cart.id,
        checkoutUrl: data.cartCreate.cart.checkoutUrl,
      });
    }

    // POST /api/cart/add - Add item to cart
    if (segments[0] === 'cart' && segments[1] === 'add') {
      const { cartId, variantId, quantity = 1 } = await request.json();
      
      if (!cartId || !variantId) {
        return NextResponse.json(
          { error: 'Cart ID and variant ID are required' },
          { status: 400 }
        );
      }
      
      const client = getShopifyClient();
      const data = await client.request(ADD_TO_CART, {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      });
      
      if (data.cartLinesAdd.userErrors && data.cartLinesAdd.userErrors.length > 0) {
        return NextResponse.json(
          { error: data.cartLinesAdd.userErrors[0].message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        cart: data.cartLinesAdd.cart,
      });
    }

    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
