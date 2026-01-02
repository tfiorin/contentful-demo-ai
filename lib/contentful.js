import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchProducts() {
  try {
    // Fetch pageProduct entries specifically
    const entries = await client.getEntries({
      content_type: 'pageProduct',
    });
    
    console.log('Found pageProduct entries:', entries.items.length);
    
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
    return [];
  }
}

export async function fetchProductById(id) {
  try {
    const entry = await client.getEntry(id);
    return entry;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export default client;