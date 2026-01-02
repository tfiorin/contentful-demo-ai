# PayCo - E-commerce Platform

PayCo provides advanced, technology-based commerce solutions for all types of businesses. This is a Next.js e-commerce website that integrates with **Contentful CMS** for content management and **Shopify Storefront API** for inventory and checkout functionality.

## Features

- 🎨 **Beautiful Landing Page** with hero section and product grid
- 📦 **Product Management** via Contentful CMS
- 📊 **Real-time Inventory** from Shopify Storefront API
- 🛒 **Shopping Cart** with Shopify checkout integration
- 📱 **Responsive Design** built with Tailwind CSS and shadcn/ui
- ⚡ **Fast Performance** with Next.js 14 App Router

## Architecture

### Content Management (Contentful)
- Products are managed in Contentful CMS
- Content type: `pageProduct`
- Fields include: name, description, price, images, SKU

### Inventory & Checkout (Shopify)
- Real-time inventory checking via Shopify Storefront API
- SKU-based product matching between Contentful and Shopify
- Native Shopify checkout experience

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **CMS:** Contentful
- **E-commerce:** Shopify Storefront API
- **API:** GraphQL (Shopify), REST (Contentful)

## Environment Variables

The following environment variables are configured in `.env`:

```env
# MongoDB (for future features)
MONGO_URL=mongodb://localhost:27017/payco

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Contentful CMS
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_API_VERSION=2024-01
```

## Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js    # API routes (products, inventory, cart)
│   ├── page.js                      # Landing page with product grid
│   ├── product/[id]/page.js         # Product detail page
│   ├── layout.js                    # Root layout with CartProvider
│   └── globals.css                  # Global styles
├── lib/
│   ├── contentful.js                # Contentful client
│   ├── shopify.js                   # Shopify GraphQL client
│   └── shopify/
│       ├── queries.js               # GraphQL queries
│       └── mutations.js             # GraphQL mutations
├── context/
│   └── CartContext.js               # Cart state management
└── components/
    └── ui/                          # shadcn/ui components
```

## API Endpoints

### Products (Contentful)
- `GET /api/products` - Fetch all products from Contentful
- `GET /api/products/:id` - Fetch single product by ID

### Inventory (Shopify)
- `GET /api/shopify/inventory/:sku` - Get inventory data for a product SKU

### Cart (Shopify)
- `POST /api/cart/create` - Create a new cart
- `POST /api/cart/add` - Add item to cart

## How It Works

1. **Product Listing**: Landing page fetches products from Contentful CMS
2. **Product Details**: Product detail page shows Contentful data + Shopify inventory
3. **Add to Cart**: Items are added to Shopify cart using the variant ID
4. **Checkout**: User is redirected to Shopify's native checkout page

## Key Integration Points

### Contentful → Shopify Mapping
- Products in Contentful have a `sku` field
- This SKU is used to query Shopify's Storefront API
- Shopify returns real-time inventory and variant information
- The variant ID is used for cart operations

### Cart Flow
1. Create cart when user first visits (stored in localStorage)
2. Add items using Shopify variant IDs
3. Redirect to Shopify checkout URL for payment

## Design System

The application uses a consistent design system:
- **Primary Color**: Commerce theme with shadcn/ui defaults
- **Typography**: Inter font family
- **Components**: Built with shadcn/ui for consistency
- **Responsive**: Mobile-first design with Tailwind breakpoints

## Running the Application

The application runs on `http://localhost:3000`

Services are managed by supervisor:
```bash
# Restart all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/nextjs.out.log
```

## Future Enhancements

- [ ] Search and filtering
- [ ] Product categories
- [ ] Customer accounts
- [ ] Order history
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Related products
- [ ] Analytics integration

## Notes

- Products currently show "dresses" as they are using Contentful's sample data
- User mentioned these will be updated to hardware products later
- SKU field in Contentful links products to Shopify inventory
- Cart management uses localStorage for persistence
- Checkout is handled entirely by Shopify for security and PCI compliance
