import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchProducts() {
  try {
    // Try to fetch all entries to see what content types are available
    const entries = await client.getEntries();
    console.log('Available entries:', entries.items.length);
    if (entries.items.length > 0) {
      console.log('First entry content type:', entries.items[0].sys.contentType.sys.id);
    }
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