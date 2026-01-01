import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchProducts() {
  try {
    const entries = await client.getEntries({
      content_type: 'product',
    });
    return entries.items;
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