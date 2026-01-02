import { GraphQLClient } from 'graphql-request';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';

export function getShopifyClient() {
  return new GraphQLClient(
    `https://${domain}/api/${apiVersion}/graphql.json`,
    {
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        'Content-Type': 'application/json',
      },
    }
  );
}