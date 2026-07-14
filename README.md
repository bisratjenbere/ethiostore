# Ecommerce App

A modular, testable ecommerce web application providing product catalog, cart, checkout, user accounts, and admin management.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Visit: http://localhost:3000

---

## 📚 Documentation

Complete documentation is available in the [`docs/`](docs/) folder:

- **[Getting Started](docs/README.md#-getting-started)** - Setup and quickstart guides
- **[Architecture](docs/README.md#-architecture)** - System design and database schema
- **[Development Guides](docs/README.md#-development-guides)** - Coding standards and patterns
- **[Design System](docs/README.md#-design-system)** - UI components and styling
- **[Features](docs/README.md#-features--integrations)** - Integration guides (Stripe, Google OAuth, etc.)
- **[Project Status](docs/README.md#-project-status)** - Current completion (96%)
- **[Deployment](docs/README.md#-deployment)** - Production deployment guide

**Quick Links**:
- 📖 [Full Documentation Index](docs/README.md)
- 🚀 [Contributing Guide](docs/getting-started/CONTRIBUTING.md)
- 📊 [Project Status](docs/status/PROJECT-STATUS.md)
- 🔧 [Environment Setup](docs/deployment/ENVIRONMENT-SETUP.md)

---

## ✨ Features

### Customer-Facing
- ✅ Product catalog with search & filters
- ✅ Shopping cart (guest + user)
- ✅ Complete checkout flow
- ✅ **Stripe payment processing**
- ✅ **Google Sign-In**
- ✅ Order history & tracking
- ✅ Email notifications

### Admin Panel
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ User management
- ✅ Image upload (Cloudinary)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth v5 (Email/Password + Google OAuth)
- **Payments**: Stripe
- **Images**: Cloudinary
- **Email**: Gmail SMTP / Nodemailer

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- Google Cloud project (for OAuth)
- Cloudinary account (for images)
- Gmail account (for emails)

### Setup Instructions

See [Environment Setup Guide](docs/deployment/ENVIRONMENT-SETUP.md) for detailed configuration.

---

## 🧪 Testing

### Stripe Payments (Test Mode)

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

**CVC**: Any 3 digits  
**Date**: Any future date  
**ZIP**: Any 5 digits

### Google OAuth (Test Mode)

Add test users in Google Cloud Console → OAuth consent screen

### Email Testing

Configure Gmail SMTP with app password - see [Email Setup Guide](docs/features/EMAIL-NOTIFICATIONS.md)

---

## 📊 Project Status

**Completion**: 96% (MVP Complete)

✅ **Completed**:
- Product catalog & search
- Shopping cart & checkout
- Payment processing (Stripe)
- Google OAuth authentication
- Order management
- Admin panel
- Email notifications
- Image upload

⚠️ **Optional** (4%):
- Product reviews
- Guest checkout
- Discount codes

See [Project Status](docs/status/PROJECT-STATUS.md) for details.

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](docs/getting-started/CONTRIBUTING.md) for:
- Development workflow
- Commit message guidelines
- Pull request process
- Code style guidelines

---

## 📝 License

Proprietary. All rights reserved.

---

## 📞 Support

- **Documentation**: [docs/README.md](docs/README.md)
- **Issues**: GitHub Issues
- **Email**: Contact maintainer

---

**Built with ❤️ using Next.js, Prisma, and Stripe**
