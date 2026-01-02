import { createClient } from 'contentful';

// Helper function to determine if we're in preview mode
export function isPreviewMode(searchParams) {
  return searchParams?.preview === '1';
}

// Create client based on preview mode
export function getContentfulClient(preview = false) {
  return createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: preview 
      ? process.env.CONTENTFUL_PREVIEW_TOKEN
      : process.env.CONTENTFUL_ACCESS_TOKEN,
    host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  });
}

export async function fetchProducts(locale = 'en', preview = false) {
  const client = getContentfulClient(preview);
  
  try {
    let contentfulLocale = locale === 'de' ? 'de-DE' : 'en-US';
    
    console.log(`Attempting to fetch products with locale: ${contentfulLocale}, preview: ${preview}`);
    
    let entries;
    try {
      entries = await client.getEntries({
        content_type: 'pageProduct',
        locale: contentfulLocale,
      });
      console.log(`Found ${entries.items.length} products for locale: ${contentfulLocale}`);
    } catch (localeError) {
      if (locale === 'de') {
        console.log('German locale not available in Contentful, falling back to English');
        entries = await client.getEntries({
          content_type: 'pageProduct',
          locale: 'en-US',
        });
        console.log(`Found ${entries.items.length} products with English fallback`);
      } else {
        throw localeError;
      }
    }
    console.log('Products fetched:', entries.items[0]?.fields.sku);
    
    return entries.items.map(product => ({
      sys: {
        id: product.sys.id,
        type: product.sys.type,
        createdAt: product.sys.createdAt,
        updatedAt: product.sys.updatedAt,
      },
      fields: {
        internalName: product.fields.internalName,
        slug: product.fields.slug,
        name: product.fields.name,
        description: product.fields.description,
        price: product.fields.price,
        featuredProductImage: product.fields.featuredProductImage,
        productImages: product.fields.productImages,
        sku: product.fields.sku,
      }
    }));
  } catch (error) {
    console.error('Error fetching products from Contentful:', error);
    return [];
  }
}

export async function fetchLandingPage(locale = 'en', preview = false) {
  const client = getContentfulClient(preview);

  console.log(`Fetching landing page with locale: ${locale}, preview: ${preview}`);
  
  try {
    let contentfulLocale = locale === 'de' ? 'de-DE' : 'en-US';
    
    console.log(`Attempting to fetch landing page with locale: ${contentfulLocale}, preview: ${preview}`);
    
    let entries;
    try {
      entries = await client.getEntries({
        content_type: 'pageLanding',
        locale: contentfulLocale,
        limit: 1,
        include: 2,
      });
      console.log(`Found ${entries.items.length} landing page for locale: ${contentfulLocale}`);
    } catch (localeError) {
      if (locale === 'de') {
        console.log('German locale not available for landing page, falling back to English');
        entries = await client.getEntries({
          content_type: 'pageLanding',
          locale: 'en-US',
          limit: 1,
          include: 2,
        });
        console.log(`Found ${entries.items.length} landing page with English fallback`);
      } else {
        throw localeError;
      }
    }
    
    if (entries.items.length === 0) {
      return null;
    }
    
    const landingPage = entries.items[0];

    return {
      sys: {
        id: landingPage.sys.id,
        type: landingPage.sys.type,
        createdAt: landingPage.sys.createdAt,
        updatedAt: landingPage.sys.updatedAt,
      },
      fields: {
        internalName: landingPage.fields.internalName,
        heroBannerImage: landingPage.fields.heroBannerImage,
        heroBannerHeadline: landingPage.fields.heroBannerHeadline,
        heroBannerHeadlineColor: landingPage.fields.heroBannerHeadlineColor,
        leftFeature: landingPage.fields.leftFeature,
        rightFeature: landingPage.fields.rightFeature,
        middleFeature: landingPage.fields.middleFeature,
      }
    };
  } catch (error) {
    console.error('Error fetching landing page from Contentful:', error);
    return null;
  }
}

export async function fetchProductBySlug(slug, locale = 'en', preview = false) {
  const client = getContentfulClient(preview);
  
  try {
    let contentfulLocale = locale === 'de' ? 'de-DE' : 'en-US';
    
    console.log(`Attempting to fetch product with slug: ${slug} and locale: ${contentfulLocale}, preview: ${preview}`);
    
    let entries;
    try {
      entries = await client.getEntries({
        content_type: 'pageProduct',
        'fields.slug': slug,
        locale: contentfulLocale,
        limit: 1,
      });
    } catch (localeError) {
      if (locale === 'de') {
        console.log('German locale not available for product, falling back to English');
        entries = await client.getEntries({
          content_type: 'pageProduct',
          'fields.slug': slug,
          locale: 'en-US',
          limit: 1,
        });
      } else {
        throw localeError;
      }
    }
    
    if (entries.items.length === 0) {
      return null;
    }
    
    const product = entries.items[0];
    return {
      sys: {
        id: product.sys.id,
        type: product.sys.type,
        createdAt: product.sys.createdAt,
        updatedAt: product.sys.updatedAt,
      },
      fields: {
        internalName: product.fields.internalName,
        slug: product.fields.slug,
        name: product.fields.name,
        description: product.fields.description,
        price: product.fields.price,
        featuredProductImage: product.fields.featuredProductImage,
        productImages: product.fields.productImages,
        sku: product.fields.sku,
      }
    };
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function fetchProductById(id, locale = 'en', preview = false) {
  const client = getContentfulClient(preview);
  
  try {
    let contentfulLocale = locale === 'de' ? 'de-DE' : 'en-US';
    
    console.log(`Attempting to fetch product ${id} with locale: ${contentfulLocale}, preview: ${preview}`);
    
    let entry;
    try {
      entry = await client.getEntry(id, {
        locale: contentfulLocale,
      });
    } catch (localeError) {
      if (locale === 'de') {
        console.log('German locale not available for product, falling back to English');
        entry = await client.getEntry(id, {
          locale: 'en-US',
        });
      } else {
        throw localeError;
      }
    }
    
    return {
      sys: {
        id: entry.sys.id,
        type: entry.sys.type,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      fields: {
        internalName: entry.fields.internalName,
        slug: entry.fields.slug,
        name: entry.fields.name,
        description: entry.fields.description,
        price: entry.fields.price,
        featuredProductImage: entry.fields.featuredProductImage,
        productImages: entry.fields.productImages,
        sku: entry.fields.sku,
      }
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

// Keep the default export for backward compatibility
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export default client;