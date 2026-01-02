import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchProducts(locale = 'en') {
  try {
    // Try fetching with the requested locale first
    let contentfulLocale = locale === 'de' ? 'de' : 'en-US';
    
    console.log(`Attempting to fetch products with locale: ${contentfulLocale}`);
    
    const entries = await client.getEntries({
      content_type: 'pageProduct',
      locale: contentfulLocale,
    });
    
    console.log(`Found ${entries.items.length} products for locale: ${contentfulLocale}`);
    
    // If no German products found, try fetching with wildcard to get all locales
    if (entries.items.length === 0 && locale === 'de') {
      console.log('No German products found, trying to fetch with locale=*');
      const allEntries = await client.getEntries({
        content_type: 'pageProduct',
        locale: '*',
      });
      
      console.log(`Found ${allEntries.items.length} products with all locales`);
      
      // Transform and return products with German fields if available
      return allEntries.items.map(product => ({
        sys: {
          id: product.sys.id,
          type: product.sys.type,
          createdAt: product.sys.createdAt,
          updatedAt: product.sys.updatedAt,
        },
        fields: {
          internalName: product.fields.internalName?.['de'] || product.fields.internalName?.['en-US'] || product.fields.internalName,
          slug: product.fields.slug?.['de'] || product.fields.slug?.['en-US'] || product.fields.slug,
          name: product.fields.name?.['de'] || product.fields.name?.['en-US'] || product.fields.name,
          description: product.fields.description?.['de'] || product.fields.description?.['en-US'] || product.fields.description,
          price: product.fields.price?.['de'] || product.fields.price?.['en-US'] || product.fields.price,
          featuredProductImage: product.fields.featuredProductImage?.['de'] || product.fields.featuredProductImage?.['en-US'] || product.fields.featuredProductImage,
          productImages: product.fields.productImages?.['de'] || product.fields.productImages?.['en-US'] || product.fields.productImages,
          sku: product.fields.sku?.['de'] || product.fields.sku?.['en-US'] || product.fields.sku,
        }
      }));
    }
    
    // Transform regular response
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

export async function fetchProductById(id, locale = 'en') {
  try {
    let contentfulLocale = locale === 'de' ? 'de' : 'en-US';
    
    console.log(`Attempting to fetch product ${id} with locale: ${contentfulLocale}`);
    
    // First try with specific locale
    try {
      const entry = await client.getEntry(id, {
        locale: contentfulLocale,
      });
      
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
    } catch (localeError) {
      // If German locale fails, try with all locales
      if (locale === 'de') {
        console.log('German locale failed, trying with all locales');
        const entry = await client.getEntry(id, {
          locale: '*',
        });
        
        return {
          sys: {
            id: entry.sys.id,
            type: entry.sys.type,
            createdAt: entry.sys.createdAt,
            updatedAt: entry.sys.updatedAt,
          },
          fields: {
            internalName: entry.fields.internalName?.['de'] || entry.fields.internalName?.['en-US'] || entry.fields.internalName,
            slug: entry.fields.slug?.['de'] || entry.fields.slug?.['en-US'] || entry.fields.slug,
            name: entry.fields.name?.['de'] || entry.fields.name?.['en-US'] || entry.fields.name,
            description: entry.fields.description?.['de'] || entry.fields.description?.['en-US'] || entry.fields.description,
            price: entry.fields.price?.['de'] || entry.fields.price?.['en-US'] || entry.fields.price,
            featuredProductImage: entry.fields.featuredProductImage?.['de'] || entry.fields.featuredProductImage?.['en-US'] || entry.fields.featuredProductImage,
            productImages: entry.fields.productImages?.['de'] || entry.fields.productImages?.['en-US'] || entry.fields.productImages,
            sku: entry.fields.sku?.['de'] || entry.fields.sku?.['en-US'] || entry.fields.sku,
          }
        };
      }
      throw localeError;
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export default client;