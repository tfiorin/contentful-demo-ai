import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchProducts(locale = 'en') {
  try {
    const contentfulLocale = locale === 'de' ? 'de' : 'en-US';
    
    // Fetch pageProduct entries specifically with locale
    const entries = await client.getEntries({
      content_type: 'pageProduct',
      locale: contentfulLocale,
    });
    
    console.log('Found pageProduct entries:', entries.items.length, 'for locale:', contentfulLocale);
    
    // Transform to avoid circular references (exclude relatedProducts)
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
    
    // If German locale fails, fallback to English
    if (locale === 'de') {
      console.log('German locale not available, falling back to English');
      return fetchProducts('en');
    }
    
    return [];
  }
}

export async function fetchProductById(id, locale = 'en') {
  try {
    const entry = await client.getEntry(id, {
      locale: locale === 'de' ? 'de' : 'en-US',
    });
    
    // Transform to avoid circular references (exclude relatedProducts)
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