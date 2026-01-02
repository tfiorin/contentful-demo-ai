import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchProducts() {
  try {
    // Fetch all entries
    const entries = await client.getEntries();
    console.log('Available entries:', entries.items.length);
    
    // Log all unique content types
    const contentTypes = new Set();
    entries.items.forEach(item => {
      contentTypes.add(item.sys.contentType.sys.id);
    });
    console.log('Content types found:', Array.from(contentTypes));
    
    // Filter for products (try common product content type names)
    const productContentTypes = ['product', 'shopifyProduct', 'products', 'dress'];
    let products = entries.items.filter(item => 
      productContentTypes.includes(item.sys.contentType.sys.id)
    );
    
    console.log('Found products:', products.length);
    
    // Transform to avoid circular references
    return products.map(product => ({
      sys: product.sys,
      fields: {
        name: product.fields.name || product.fields.title,
        description: product.fields.description,
        price: product.fields.price,
        image: product.fields.image,
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