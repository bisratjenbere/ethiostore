# Contributing to EthioStore

Thank you for considering contributing to EthioStore! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Questions?](#questions)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- Cloudinary account (for image uploads)
- Stripe account (for payment testing)

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ethiostore.git
   cd ethiostore
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/bisratjenbere/ethiostore.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

6. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma db seed  # Optional: Add sample data
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

We use **GitHub Flow** - a lightweight, branch-based workflow. See [GIT-WORKFLOW-STRATEGY.md](.kiro/GIT-WORKFLOW-STRATEGY.md) for comprehensive details.

### Quick Start

1. **Sync with upstream**
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write code
   - Test locally
   - Commit frequently

4. **Commit with conventional format**
   ```bash
   git commit -m "feat(products): add review system"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Request review

### Branch Naming Convention

Use the following format: `<type>/<short-description>`

**Types:**
- `feature/` - New functionality (e.g., `feature/admin-dashboard`)
- `bugfix/` - Bug fixes (e.g., `bugfix/cart-validation`)
- `hotfix/` - Critical production fixes (e.g., `hotfix/payment-webhook`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/` - Documentation only (e.g., `docs/api-guide`)
- `refactor/` - Code improvements (e.g., `refactor/product-actions`)

**Examples:**
```bash
git checkout -b feature/product-reviews
git checkout -b bugfix/checkout-address-validation
git checkout -b hotfix/stripe-timeout
git checkout -b docs/deployment-guide
```

## Commit Message Guidelines

We use **Conventional Commits** specification for clear and standardized commit messages.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring (no functional changes)
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `build` - Build system or dependency changes
- `ci` - CI/CD configuration changes

### Scope (Optional)

The scope provides context about what part of the codebase is affected:

- `products` - Product-related features
- `cart` - Shopping cart
- `checkout` - Checkout flow
- `auth` - Authentication
- `admin` - Admin panel
- `payments` - Payment processing
- `db` - Database/Prisma
- `api` - API routes
- `ui` - UI components

### Examples

**Good commits:**
```bash
feat(products): add product review system

Implemented review submission form, display component,
and server actions for creating and fetching reviews.

Closes #123

fix(cart): prevent negative quantity values

Added validation in updateCartQuantity to prevent
quantities from going below 1.

Fixes #67

docs(readme): update Stripe setup instructions

Clarified webhook configuration steps and added
troubleshooting section.

chore(deps): upgrade Next.js to 16.0.8

Updated Next.js, React, and related dependencies.
Tested build and development server.
```

**Bad commits:**
```bash
added stuff           ❌ Not descriptive
Fixed bug            ❌ No context
Update               ❌ What was updated?
cart                 ❌ What about cart?
```

### Commit Rules

1. Use **imperative mood** ("add" not "added" or "adds")
2. Don't capitalize first letter of subject
3. No period at end of subject
4. Keep subject line ≤ 50 characters
5. Wrap body text at 72 characters
6. Separate subject from body with blank line
7. Use body to explain **what** and **why**, not **how**
8. Reference issues in footer: `Fixes #123`, `Closes #456`, `Refs #789`

## Pull Request Process

### Before Creating a PR

1. **Ensure code quality**
   ```bash
   npm run lint        # ESLint
   npx tsc --noEmit   # TypeScript check
   npm run build      # Build check
   ```

2. **Test locally**
   - Run the application
   - Test your changes thoroughly
   - Test affected integrations (Stripe, Cloudinary, etc.)

3. **Update documentation**
   - Update README if needed
   - Add comments for complex logic
   - Update JSDoc for functions

4. **Clean commit history**
   ```bash
   # If needed, squash WIP commits before PR
   git rebase -i HEAD~3
   ```

### Creating the PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```

2. **Open PR on GitHub**
   - Use the provided template
   - Write clear description
   - Link related issues
   - Add screenshots for UI changes
   - Mark as draft if work in progress

3. **Request review**
   - Wait for CI checks to pass
   - Address reviewer feedback
   - Push additional commits if needed

### PR Review Criteria

Your PR will be reviewed for:

- ✅ Code quality and readability
- ✅ Follows project conventions and patterns
- ✅ Includes appropriate error handling
- ✅ TypeScript types are correct
- ✅ No console.log statements
- ✅ Commit messages follow convention
- ✅ Tests pass (if applicable)
- ✅ Documentation updated
- ✅ No sensitive data committed

### After PR Approval

1. **Squash and Merge** - Maintainer will merge using squash strategy
2. **Delete branch** - Delete your feature branch after merge
3. **Sync fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## Code Style Guidelines

### TypeScript

- Use **TypeScript** for all files
- Avoid `any` type - use proper types
- Use **Zod** for runtime validation
- Export types from `types/index.ts`

### Components

- Use **Server Components** by default
- Mark client components with `"use client"`
- Keep components small and focused
- Use proper TypeScript prop types

**Example:**
```tsx
// Server Component (default)
const ProductList = async () => {
  const products = await getProducts();
  return <div>...</div>;
};

// Client Component (when needed)
"use client";

import { useState } from "react";

const AddToCart = ({ productId }: { productId: string }) => {
  const [isPending, startTransition] = useTransition();
  // ...
};
```

### Server Actions

- All server actions in `lib/actions/`
- Use `"use server"` directive
- Always return `{ success: boolean; message: string }`
- Use try-catch with `formatError()`
- Validate inputs with Zod

**Example:**
```typescript
"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { productSchema } from "@/lib/validators";

export async function createProduct(data: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    
    const validated = productSchema.parse(data);
    
    await prisma.product.create({
      data: validated
    });
    
    return { success: true, message: "Product created" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
```

### Styling

- Use **Tailwind CSS** classes
- Use `cn()` utility for conditional classes
- Follow existing component patterns
- Use semantic spacing (`gap-4`, `space-y-4`)
- Use responsive prefixes (`md:grid-cols-3`)

### File Naming

- Pages: `page.tsx` (Next.js convention)
- Components: `kebab-case.tsx` (e.g., `product-card.tsx`)
- Server Actions: `*.actions.ts` (e.g., `cart.actions.ts`)
- Utilities: `utils.ts`, `validators.ts`

### Import Organization

Order imports as follows:

```typescript
// 1. React imports
import { useState, useTransition } from "react";

// 2. Next.js imports
import { useRouter } from "next/navigation";

// 3. Third-party libraries
import { toast } from "sonner";

// 4. UI components
import { Button } from "@/components/ui/button";

// 5. Local components
import ProductCard from "@/components/shared/product/product-card";

// 6. Actions/utilities
import { addToCart } from "@/lib/actions/cart.actions";
import { formatError } from "@/lib/utils";

// 7. Types
import { Product } from "@/types";

// 8. Constants
import { APP_NAME } from "@/lib/constants";
```

## Testing Guidelines

### Local Testing

1. **Development server**
   ```bash
   npm run dev
   ```

2. **TypeScript check**
   ```bash
   npx tsc --noEmit
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

4. **Build**
   ```bash
   npm run build
   ```

### Database Testing

1. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```

2. **Reset database** (development only)
   ```bash
   npx prisma migrate reset
   ```

3. **Open Prisma Studio**
   ```bash
   npx prisma studio
   ```

### Integration Testing

#### Stripe Payment Flow

1. Use Stripe CLI for webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. Test with test card: `4242 4242 4242 4242`

#### Cloudinary Image Upload

1. Test upload in admin panel
2. Verify images appear correctly
3. Check image optimization settings

#### Email Notifications

1. Configure test SMTP or use services like Mailtrap
2. Test order confirmation emails
3. Verify email formatting

## Questions?

If you have questions:

1. Check existing documentation:
   - [Project Overview](.kiro/steering/project-overview.md)
   - [Git Workflow Strategy](.kiro/GIT-WORKFLOW-STRATEGY.md)
   - [Database Patterns](.kiro/steering/database-patterns.md)
   - [Component Patterns](.kiro/steering/component-patterns.md)

2. Check existing issues on GitHub

3. Open a new issue with the question label

4. Contact the maintainer: @bisratjenbere

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the contribution guidelines

---

Thank you for contributing to EthioStore! 🎉
