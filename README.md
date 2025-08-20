# Freddy River - Digital Products Store

A complete Next.js application for selling digital beats and sample packs with Stripe and PayPal integration, secure file delivery, and revenue splitting for collaborators.

## Features

- **Product Management**: Manage beats and samples with pricing, availability, and file attachments
- **Dual Payment Processing**: Stripe Checkout and PayPal integration
- **Revenue Splitting**: Automatic payouts to collaborators via Stripe Connect
- **Secure File Delivery**: Time-limited download links with usage tracking
- **Admin Dashboard**: Complete management interface for products, collaborators, and orders
- **Email Notifications**: Automated download links and collaborator invitations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Payments**: Stripe, PayPal
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Email**: Resend
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- Stripe account
- PayPal developer account
- Cloudflare R2 or AWS S3 bucket
- Resend account for emails

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd freddy-river
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/freddy_river_db"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CONNECT_CLIENT_ID="ca_..."

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_WEBHOOK_ID="your_paypal_webhook_id"
PAYPAL_MODE="sandbox" # or "live"

# Email (using Resend)
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@freddyriver.com"

# File Storage (Cloudflare R2)
R2_ACCOUNT_ID="your_r2_account_id"
R2_ACCESS_KEY_ID="your_r2_access_key"
R2_SECRET_ACCESS_KEY="your_r2_secret_key"
R2_BUCKET_NAME="freddy-river-files"
R2_PUBLIC_URL="https://your-bucket.r2.dev"

# Download Settings
DOWNLOAD_LINK_TTL_HOURS=48
MAX_DOWNLOADS_PER_ITEM=3

# App Settings
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@freddyriver.com"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

The application uses the following tables:

### Existing Tables (preserved)
- `fr_beats` - Beat products with pricing and metadata
- `fr_samples` - Sample products and packs

### New Tables
- `fr_customers` - Customer information
- `fr_orders` - Order records with payment provider info
- `fr_order_items` - Individual items within orders
- `fr_collaborators` - Producer/collaborator accounts
- `fr_beat_collaborators` - Revenue split percentages for beats
- `fr_sample_collaborators` - Revenue split percentages for samples
- `fr_product_files` - File storage keys for downloadable content
- `fr_download_tokens` - Secure, time-limited download tokens
- `fr_webhooks_log` - Webhook event logging

## API Endpoints

### Public Endpoints
- `GET /api/products` - List available products
- `POST /api/checkout/stripe` - Create Stripe checkout session
- `POST /api/checkout/paypal` - Create PayPal order
- `PUT /api/checkout/paypal` - Capture PayPal payment
- `GET /api/download/[token]` - Secure file download

### Admin Endpoints
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/[type]/[id]` - Update product
- `DELETE /api/admin/products/[type]/[id]` - Delete product
- `POST /api/admin/upload` - Upload product files
- `GET /api/admin/collaborators` - List collaborators
- `POST /api/admin/collaborators` - Create collaborator
- `GET /api/admin/orders` - List orders

### Webhook Endpoints
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/paypal` - PayPal webhook handler

## Testing the Purchase Flow

### Stripe Test Flow
1. Add products to cart
2. Go to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check email for download links
6. Test download links

### PayPal Test Flow
1. Add products to cart
2. Select PayPal payment
3. Use PayPal sandbox credentials
4. Complete payment
5. Check email for download links

## Webhook Setup

### Stripe Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### PayPal Webhooks
1. Go to PayPal Developer Dashboard
2. Create webhook: `https://yourdomain.com/api/webhooks/paypal`
3. Select events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`
4. Copy webhook ID to `PAYPAL_WEBHOOK_ID`

## File Storage Setup

### Cloudflare R2
1. Create R2 bucket
2. Generate API tokens with read/write permissions
3. Configure CORS for your domain
4. Set environment variables

### AWS S3 (Alternative)
Update the storage configuration in `lib/storage.ts` to use standard S3 endpoints.

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Other Platforms
Ensure your platform supports:
- Node.js 18+
- MySQL database connection
- Environment variables
- Webhook endpoints

## Admin Access

The admin dashboard is available at `/admin-new`. You can customize authentication in the admin components or integrate with NextAuth.js for proper authentication.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@freddyriver.com or create an issue in the repository.