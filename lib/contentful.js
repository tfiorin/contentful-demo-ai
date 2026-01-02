import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchProducts(locale = 'en') {
  try {
    // Map our locale to Contentful locale codes
    let contentfulLocale = locale === 'de' ? 'de-DE' : 'en-US';
    
    console.log(`Attempting to fetch products with locale: ${contentfulLocale}`);
    
    let entries;
    try {
      entries = await client.getEntries({
        content_type: 'pageProduct',
        locale: contentfulLocale,
      });
      console.log(`Found ${entries.items.length} products for locale: ${contentfulLocale}`);
    } catch (localeError) {
      // If German locale fails with error, fallback to English
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
    
    // Transform response
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

export async function fetchProductBySlug(slug, locale = 'en') {
  try {
    let contentfulLocale = locale === 'de' ? 'de-DE' : 'en-US';
    
    console.log(`Attempting to fetch product with slug: ${slug} and locale: ${contentfulLocale}`);
    
    let entries;
    try {
      entries = await client.getEntries({
        content_type: 'pageProduct',
        'fields.slug': slug,
        locale: contentfulLocale,
        limit: 1,
      });
    } catch (localeError) {
      // If German locale fails, fallback to English
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

export async function fetchProductById(id, locale = 'en') {
  try {
    let contentfulLocale = locale === 'de' ? 'de-DE' : 'en-US';
    
    console.log(`Attempting to fetch product ${id} with locale: ${contentfulLocale}`);
    
    let entry;
    try {
      entry = await client.getEntry(id, {
        locale: contentfulLocale,
      });
    } catch (localeError) {
      // If German locale fails, fallback to English
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

export default client;