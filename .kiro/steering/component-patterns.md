# Component Patterns & UI Guidelines

## Component Organization

### File Structure
```
components/
├── ui/                    # Base shadcn/ui components (generated, rarely edit)
│   ├── button.tsx
│   ├── card.tsx
│   ├── form.tsx
│   └── ...
└── shared/               # Business logic components
    ├── product/
    │   ├── product-card.tsx
    │   ├── product-list.tsx
    │   └── add-to-cart.tsx
    ├── order/
    │   ├── order-items.tsx
    │   └── order-price.tsx
    └── user/
        ├── add-address.tsx
        └── add-payment-method.tsx
```

## Server vs Client Components

### Server Components (Default)
Use for:
- Data fetching pages
- Static content
- Layout components
- SEO-sensitive content

```tsx
// No "use client" directive
import { getProducts } from "@/lib/actions/product.actions";

const ProductPage = async () => {
  const products = await getProducts();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductPage;
```

### Client Components
Use ONLY when you need:
- User interaction (onClick, onChange)
- React hooks (useState, useEffect, useTransition)
- Browser APIs (localStorage, window)
- Third-party libraries requiring client-side

```tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

const InteractiveComponent = () => {
  const [isPending, startTransition] = useTransition();
  
  const handleClick = () => {
    startTransition(async () => {
      await serverAction();
    });
  };
  
  return <Button onClick={handleClick}>Click Me</Button>;
};
```

## Common Component Patterns

### Product Card Pattern
```tsx
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-square mb-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <ProductPrice value={Number(product.price)} />
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
```

### List Pattern
```tsx
import ProductCard from "./product-card";
import { Product } from "@/types";

const ProductList = ({ 
  title, 
  data 
}: { 
  title: string; 
  data: Product[] 
}) => {
  if (data.length === 0) {
    return <div>No products found</div>;
  }
  
  return (
    <section className="space-y-4">
      <h2 className="h2-bold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
```

### Interactive Button with Loading State
```tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

const AddButton = ({ onAdd }: { onAdd: () => Promise<any> }) => {
  const [isPending, startTransition] = useTransition();
  
  const handleClick = () => {
    startTransition(async () => {
      const res = await onAdd();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };
  
  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Add
    </Button>
  );
};

export default AddButton;
```

## Form Component Pattern

### Full Form with Validation
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { schema } from "@/lib/validators";
import { serverAction } from "@/lib/actions/module.actions";

const FormComponent = ({ 
  defaultValues 
}: { 
  defaultValues?: z.infer<typeof schema> 
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      // default values here
    },
  });
  
  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(async () => {
      const res = await serverAction(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push("/next-page");
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Label</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter value" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FormComponent;
```

## Display Components

### Price Display
```tsx
import { FormatCurrency } from "@/lib/utils";

const ProductPrice = ({ 
  value, 
  className 
}: { 
  value: number; 
  className?: string 
}) => {
  return (
    <p className={className}>
      {FormatCurrency(value)}
    </p>
  );
};

export default ProductPrice;
```

### Status Badge
```tsx
import { Badge } from "@/components/ui/badge";

const OrderStatus = ({ 
  isPaid, 
  isDelivered 
}: { 
  isPaid: boolean; 
  isDelivered: boolean 
}) => {
  return (
    <div className="flex gap-2">
      {isPaid ? (
        <Badge variant="outline" className="bg-green-100">Paid</Badge>
      ) : (
        <Badge variant="destructive">Not Paid</Badge>
      )}
      
      {isDelivered ? (
        <Badge variant="outline" className="bg-blue-100">Delivered</Badge>
      ) : (
        <Badge variant="outline">Pending</Badge>
      )}
    </div>
  );
};

export default OrderStatus;
```

### Card Layout Pattern
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InfoCard = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
```

## Table Pattern

### Data Table
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types";
import { FormatCurrency } from "@/lib/utils";

const OrdersTable = ({ orders }: { orders: Order[] }) => {
  if (orders.length === 0) {
    return <p>No orders found</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id.slice(0, 8)}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{FormatCurrency(order.totalPrice)}</TableCell>
            <TableCell>
              {order.isPaid ? "Paid" : "Pending"}
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
```

## Layout Patterns

### Page Layout with Header
```tsx
const PageLayout = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode 
}) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="h2-bold mb-6">{title}</h1>
      {children}
    </div>
  );
};

export default PageLayout;
```

### Grid Layout
```tsx
const OrderSummaryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {/* Main content */}
      </div>
      <div>
        {/* Sidebar */}
      </div>
    </div>
  );
};
```

## Image Handling

### Next.js Image Component
```tsx
import Image from "next/image";

const ProductImage = ({ 
  src, 
  alt 
}: { 
  src: string; 
  alt: string 
}) => {
  return (
    <div className="relative aspect-square">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-md"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
```

## Navigation Patterns

### Link Component
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NavigationLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link href={href}>
      <Button variant="link">{label}</Button>
    </Link>
  );
};
```

### Router Navigation
```tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NavigateButton = () => {
  const router = useRouter();
  
  return (
    <Button onClick={() => router.push("/destination")}>
      Go to Page
    </Button>
  );
};
```

## Conditional Rendering

### Loading State
```tsx
import { Loader } from "lucide-react";

const Component = ({ isLoading, data }: { isLoading: boolean; data: any }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return <div>{/* Render data */}</div>;
};
```

### Empty State
```tsx
const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};
```

## Accessibility Patterns

### Button with Aria Label
```tsx
<Button 
  onClick={handleClick}
  aria-label="Add to cart"
>
  <Plus className="h-4 w-4" />
</Button>
```

### Form Accessibility
```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="email">Email</FormLabel>
      <FormControl>
        <Input 
          id="email"
          type="email"
          {...field} 
          aria-describedby="email-error"
        />
      </FormControl>
      <FormMessage id="email-error" />
    </FormItem>
  )}
/>
```

## Performance Patterns

### Lazy Loading
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <Loader className="animate-spin" />,
});
```

### Memoization (Use Sparingly)
```tsx
"use client";

import { useMemo } from "react";

const ExpensiveComponent = ({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);
  
  return <div>{/* render */}</div>;
};
```

## Component Composition Rules

1. **Keep components small** - Single responsibility principle
2. **Extract reusable logic** - Don't repeat yourself
3. **Use proper TypeScript types** - Type all props
4. **Handle all states** - Loading, error, empty, success
5. **Make accessible** - Use semantic HTML and ARIA when needed
6. **Optimize images** - Use Next.js Image component
7. **Minimize client components** - Keep server components as default
8. **Use proper imports** - Organize imports logically
9. **Style consistently** - Use Tailwind and cn() utility
10. **Test interactivity** - Ensure loading states and error handling work
