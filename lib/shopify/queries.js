export const QUERY_PRODUCT_BY_SKU = `
  query GetProductBySKU($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          id
          title
          handle
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Define the query directly here
export const QUERY_PRODUCT_BY_ID = `
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 10) {
        edges {
          node {
            id
            title
            sku
            quantityAvailable
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const QUERY_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      variants(first: 10) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;