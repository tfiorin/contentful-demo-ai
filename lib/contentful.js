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
    
    // Find pageProduct entries
    let products = entries.items.filter(item => 
      item.sys.contentType.sys.id === 'pageProduct'
    );
    
    console.log('Found pageProduct entries:', products.length);
    
    if (products.length > 0) {
      // Log the fields of the first product to see what's available
      console.log('First product fields:', Object.keys(products[0].fields));
    }
    
    // Transform to avoid circular references
    return products.map(product => ({
      sys: product.sys,
      fields: {
        ...product.fields,
        name: product.fields.name || product.fields.productName || product.fields.title,
        description: product.fields.description || product.fields.productDescription,
        price: product.fields.price,
        image: product.fields.image || product.fields.productImages?.[0],
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