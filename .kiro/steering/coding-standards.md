# Coding Standards & Patterns

## File Naming Conventions
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Components**: `kebab-case.tsx` (e.g., `add-to-cart.tsx`, `product-card.tsx`)
- **Server Actions**: `*.actions.ts` (e.g., `cart.actions.ts`, `user.actions.ts`)
- **Types**: `index.ts` in `types/` directory
- **Validators**: `validators.ts` with Zod schemas
- **Utilities**: `utils.ts` for helper functions

## Component Structure

### Server Components (Default)
```tsx
import { ComponentType } from 'react';

// Async server component - can fetch data directly
const PageName = async () => {
  const data = await getDataFromServer();
  
  return (
    <>
      <Component data={data} />
    </>
  );
};

export default PageName;
```

### Client Components
```tsx
"use client"; // MUST be at the very top

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const ClientComponent = ({ data }: { data: Type }) => {
  const [isPending, startTransition] = useTransition();
  
  const handleAction = () => {
    startTransition(async () => {
      const res = await serverAction(data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };
  
  return <div>...</div>;
};

export default ClientComponent;
```

## Server Actions Pattern

### Standard Server Action Structure
```tsx
"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { schemaName } from "../validators";

export async function actionName(data: InputType) {
  try {
    // 1. Get session if authentication required
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");
    
    // 2. Validate input with Zod
    const validated = schemaName.parse(data);
    
    // 3. Check permissions/business rules
    const entity = await prisma.model.findFirst({
      where: { id: validated.id }
    });
    if (!entity) throw new Error("Entity not found");
    
    // 4. Perform database operation
    await prisma.model.update({
      where: { id: entity.id },
      data: validated
    });
    
    // 5. Revalidate affected pages
    revalidatePath('/affected-path');
    
    // 6. Return success response
    return {
      success: true,
      message: "Action completed successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    };
  }
}
```

### Action Response Pattern
All server actions MUST return:
```typescript
{
  success: boolean;
  message: string;
  data?: any; // optional
}
```

## Form Handling Pattern

### Form Component Structure
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const FormComponent = ({ defaultValues }: { defaultValues?: Type }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || defaultValues
  });
  
  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(async () => {
      const res = await serverAction(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push('/next-page');
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Placeholder" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          {isPending ? <Loader className="animate-spin" /> : <Icon />}
          Submit
        </Button>
      </form>
    </Form>
  );
};
```

## Error Handling

### Error Formatting
Use `formatError()` utility for consistent error messages:
```typescript
import { formatError } from "@/lib/utils";

try {
  // operation
} catch (error) {
  return {
    success: false,
    message: formatError(error) // Handles Zod, Prisma, and generic errors
  };
}
```

### Toast Notifications
```typescript
// Success
toast.success("Operation successful");

// Error
toast.error("Operation failed");

// Custom toast
toast.custom((t) => (
  <div className="flex items-center gap-3">
    <span>Message</span>
    <button onClick={() => router.push('/path')}>
      Action
    </button>
  </div>
));
```

## Validation Pattern

### Zod Schema Definition
```typescript
// lib/validators.ts
import { z } from "zod";

export const entitySchema = z.object({
  field: z.string().min(3, "Field must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  number: z.coerce.number().int().positive(),
  price: currency, // Use existing currency validator
});

// With refinement
export const schemaWithValidation = z
  .object({
    password: z.string().min(3),
    confirmPassword: z.string().min(3),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

## Type Definitions

### Type from Zod Schema
```typescript
// types/index.ts
import { z } from "zod";
import { schemaName } from "@/lib/validators";

export type TypeName = z.infer<typeof schemaName> & {
  id: string;
  createdAt: Date;
  // Additional fields from database
};
```

## Database Operations

### Query Pattern
```typescript
// Simple query
const entity = await prisma.model.findFirst({
  where: { id: entityId }
});

// With relations
const entity = await prisma.model.findFirst({
  where: { id: entityId },
  include: {
    relation: true,
    nestedRelation: {
      include: {
        deepRelation: true
      }
    }
  }
});

// Convert to plain object for client
return convertToPlainObject(entity);
```

### Transaction Pattern
```typescript
await prisma.$transaction(async (tx) => {
  // Multiple related operations
  await tx.model1.update({ ... });
  await tx.model2.create({ ... });
});
```

## Import Organization

### Import Order
1. React imports
2. Next.js imports
3. Third-party libraries
4. Local components
5. Actions/utilities
6. Types
7. Constants

```typescript
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serverAction } from "@/lib/actions/module.actions";
import { formatError } from "@/lib/utils";
import { Type } from "@/types";
import { CONSTANT } from "@/lib/constants";
```

## Metadata Pattern

### Page Metadata
```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
};
```

## Path Revalidation

### When to Revalidate
Revalidate paths after mutations that affect displayed data:
```typescript
import { revalidatePath } from "next/cache";

// After updating product
revalidatePath(`/product/${product.slug}`);

// After cart changes
revalidatePath('/cart');

// Revalidate multiple paths
revalidatePath('/');
revalidatePath('/product/[slug]', 'page');
```

## Async Component Props Pattern

### Props Awaiting
```typescript
const Page = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q: string }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  // Use params.slug, searchParams.q
};
```

## Styling Conventions

### Tailwind Classes
- Use `cn()` utility for conditional classes
- Prefer semantic spacing (e.g., `gap-4`, `space-y-4`)
- Use responsive prefixes (e.g., `md:grid-cols-3`)

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow override via props
)}>
```

## Constants Usage

### Define in constants/index.ts
```typescript
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "prostore";
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;
```

### Use throughout app
```typescript
import { APP_NAME, LATEST_PRODUCT_LIMIT } from "@/lib/constants";
```

## Code Quality Rules

1. **No console.log in production** - Use proper error handling
2. **Always handle loading states** - Use `isPending` from `useTransition`
3. **Type everything** - No `any` types unless absolutely necessary
4. **Validate all inputs** - Use Zod schemas
5. **Handle errors gracefully** - Always try/catch server actions
6. **Use async/await** - No raw promises
7. **Prefer server components** - Only use "use client" when necessary
8. **Revalidate after mutations** - Keep UI in sync with data
9. **Use semantic HTML** - Proper accessibility
10. **Follow existing patterns** - Consistency over cleverness
