// Contentful Types
export interface ContentfulSys {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentfulAsset {
  metadata: {
    tags: string[];
    concepts: string[];
  };
  sys: {
    space: {
      sys: {
        type: string;
        linkType: string;
        id: string;
      };
    };
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: string;
        linkType: string;
      };
    };
    publishedVersion: number;
    revision: number;
    locale: string;
  };
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface Product {
  sys: ContentfulSys;
  fields: {
    internalName: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    featuredProductImage: ContentfulAsset;
    productImages?: ContentfulAsset[];
    sku: string;
  };
}

// Shopify Types
export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyInventory {
  productId: string;
  variantId: string;
  sku: string;
  quantityAvailable: number;
  availableForSale: boolean;
  price: ShopifyPrice;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
    };
    price: ShopifyPrice;
    image?: {
      url: string;
      altText: string;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines?: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  estimatedCost?: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
  };
}

// Language Types
export type Locale = 'en' | 'de';

export interface Translations {
  [key: string]: string;
}

export interface TranslationDictionary {
  en: Translations;
  de: Translations;
}