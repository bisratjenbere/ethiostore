# Design System - Part 5: Mobile-First Responsive Design

**Version**: 1.0  
**Date**: July 13, 2026

---

## 📱 Mobile-First Philosophy

### Why Mobile-First?

**Statistics** (2026):
- 54% of e-commerce traffic is mobile
- 40% of mobile users abandon sites that take > 3 seconds to load
- Mobile conversion rates are 64% lower than desktop (due to poor UX)

**Approach**:
1. Design for 375px width first (iPhone SE)
2. Enhance for tablet (768px)
3. Optimize for desktop (1024px+)

---

## 📐 Breakpoint System

```css
/* Tailwind breakpoints (default) */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Custom Breakpoints for E-Commerce:

```typescript
// tailwind.config.ts
screens: {
  'xs': '375px',  // iPhone SE
  'sm': '640px',  // Large phones
  'md': '768px',  // Tablets
  'lg': '1024px', // Laptops
  'xl': '1280px', // Desktops
  '2xl': '1536px' // Large displays
}
```

---

## 🎨 Mobile Component Adaptations

### Navigation - Mobile vs Desktop

**Mobile (< 768px)**:
```tsx
<header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
  <div className="flex items-center justify-between h-14 px-4">
    {/* Hamburger Menu */}
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <nav className="space-y-4">
          <Link href="/shop" className="block text-lg font-medium">
            Shop
          </Link>
          {/* More links */}
        </nav>
      </SheetContent>
    </Sheet>
    
    {/* Logo - Center */}
    <Link href="/" className="absolute left-1/2 -translate-x-1/2">
      <Image src="/logo.svg" width={32} height={32} />
    </Link>
    
    {/* Cart - Right */}
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
            {cartCount}
          </Badge>
        )}
      </Button>
    </Link>
  </div>
  
  {/* Search Bar - Full Width Below */}
  <div className="px-4 pb-3">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-10 h-10"
      />
    </div>
  </div>
</header>
```

**Desktop (≥ 768px)**:
```tsx
<header className="sticky top-0 z-50 bg-background border-b">
  <div className="wrapper">
    <div className="flex items-center justify-between h-16">
      {/* Logo - Left */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" width={40} height={40} />
        <span className="font-bold text-xl">ProStore</span>
      </Link>
      
      {/* Search - Center */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
      </div>
      
      {/* Nav & Actions - Right */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-6">
          <Link href="/shop" className="font-medium hover:text-primary">
            Shop
          </Link>
          <Link href="/deals" className="font-medium hover:text-primary">
            Deals
          </Link>
        </nav>
        
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
        
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1">{cartCount}</Badge>
            )}
          </Button>
        </Link>
        
        <Button>Sign In</Button>
      </div>
    </div>
  </div>
</header>
```

### Product Card - Responsive

```tsx
<Card className="group h-full">
  <CardHeader className="p-3 md:p-4">
    <Link href={`/product/${product.slug}`}>
      <div className="relative aspect-square">
        <Image
          src={product.images[0]}
          fill
          alt={product.name}
          className="object-cover rounded-md"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
    </Link>
  </CardHeader>
  
  <CardContent className="p-3 md:p-6 space-y-2 md:space-y-3">
    {/* Brand - Smaller on mobile */}
    <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">
      {product.brand}
    </p>
    
    {/* Product Name - Fewer lines on mobile */}
    <Link href={`/product/${product.slug}`}>
      <h3 className="text-sm md:text-base font-semibold line-clamp-1 md:line-clamp-2">
        {product.name}
      </h3>
    </Link>
    
    {/* Rating - Hide reviews count on mobile */}
    <div className="flex items-center gap-1 md:gap-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <span className="hidden md:inline text-xs text-muted-foreground">
        ({product.numReviews})
      </span>
    </div>
    
    {/* Price - Smaller on mobile, button hidden */}
    <div className="flex items-center justify-between pt-1 md:pt-2">
      <p className="text-base md:text-xl font-bold">
        ${product.price}
      </p>
      
      {/* Button only visible on hover on desktop */}
      <Button
        size="sm"
        className="hidden md:inline-flex opacity-0 group-hover:opacity-100"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </CardContent>
</Card>
```

### Product Grid - Responsive Columns

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

---

## 👆 Touch-Friendly Interactions

### Minimum Tap Target Sizes

```typescript
// All interactive elements should be at least 44x44px
const MIN_TOUCH_TARGET = 44; // 44px × 44px (Apple guideline)

// Examples:
<Button size="sm" className="h-11 px-4"> // 44px height
<Button size="icon" className="h-11 w-11"> // 44x44px
<Checkbox className="h-5 w-5 m-2.5"> // 5 + (2.5*2) = 44px total
```

### Increase Tap Targets on Mobile

```tsx
<Button className={cn(
  "h-10 px-4",           // Desktop
  "md:h-10 md:px-4",     // Keep desktop size
  "h-12 px-6"            // Larger on mobile
)}>
  Add to Cart
</Button>
```

### Swipeable Product Gallery

```tsx
'use client';
import { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';

const SwipeableGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleDragEnd = (e: any, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  return (
    <div className="relative aspect-square overflow-hidden">
      <motion.div
        className="flex h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative min-w-full h-full">
            <Image src={img} fill alt="" className="object-cover" />
          </div>
        ))}
      </motion.div>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 📱 Mobile-Specific UI Patterns

### Bottom Sheet for Filters

```tsx
// Instead of sidebar on mobile
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" className="w-full md:hidden">
      <SlidersHorizontal className="mr-2 h-4 w-4" />
      Filters
    </Button>
  </SheetTrigger>
  
  <SheetContent side="bottom" className="h-[80vh]">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    
    <div className="py-6 space-y-6 overflow-y-auto">
      {/* Filter Options */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* More filters */}
    </div>
    
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">
          Clear All
        </Button>
        <Button className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

### Sticky Add to Cart (Mobile)

```tsx
'use client';
import { useEffect, useState } from 'react';

const StickyBuyButton = ({ product }: { product: Product }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const buyButton = document.querySelector('[data-buy-button]');
      if (buyButton) {
        const rect = buyButton.getBoundingClientRect();
        setIsVisible(rect.top < 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t shadow-lg transition-transform duration-300 md:hidden",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-bold text-lg">${product.price}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.name}
          </p>
        </div>
        <Button size="lg" className="flex-shrink-0">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
```

### Mobile Sort & Filter Bar

```tsx
<div className="sticky top-14 z-30 bg-background border-b md:hidden">
  <div className="flex items-center divide-x">
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex-1 flex items-center justify-center gap-2 h-12">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        {/* Filters */}
      </SheetContent>
    </Sheet>
    
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex-1 flex items-center justify-center gap-2 h-12">
          <ArrowUpDown className="h-4 w-4" />
          <span className="text-sm font-medium">Sort</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <RadioGroup defaultValue="newest">
          <div className="flex items-center space-x-2 py-3">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest" className="flex-1">Newest First</Label>
          </div>
          {/* More options */}
        </RadioGroup>
      </SheetContent>
    </Sheet>
  </div>
</div>
```

---

## 🖼️ Image Optimization

### Responsive Images with Next.js

```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority={isAboveFold} // Only for above-the-fold images
  quality={85} // 85% quality is sweet spot
/>
```

### Lazy Loading

```tsx
// Images below the fold
<Image
  src={product.image}
  fill
  loading="lazy" // Native lazy loading
  placeholder="blur" // Show blur placeholder
  blurDataURL={product.blurHash} // Low-quality placeholder
/>
```

---

## 📏 Typography Scale - Mobile Adjustments

```css
/* Desktop First Approach (Old Way) */
.h1 { font-size: 3rem; }       /* 48px */
.h1-mobile { font-size: 2rem; } /* 32px */

/* Mobile First Approach (Better) */
.h1 {
  font-size: 2rem;              /* 32px mobile */
}

@media (min-width: 768px) {
  .h1 {
    font-size: 3rem;            /* 48px desktop */
  }
}
```

### Tailwind Mobile-First Classes

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
  Product Name
</h1>

<p className="text-sm md:text-base lg:text-lg leading-relaxed">
  Description text
</p>

<Button className="text-sm md:text-base px-4 md:px-6 h-11 md:h-12">
  Add to Cart
</Button>
```

---

## ⚡ Mobile Performance

### Code Splitting for Mobile

```tsx
// Lazy load heavy components
const ProductReviews = dynamic(() => import('./product-reviews'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false // Don't render on server for mobile
});

// Conditional loading based on viewport
const HeavyDesktopFeature = dynamic(() => import('./desktop-feature'), {
  ssr: false
});

export function ProductPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <>
      {/* Always load */}
      <ProductImages />
      <ProductInfo />
      
      {/* Load on scroll */}
      <Suspense fallback={<Skeleton />}>
        <ProductReviews />
      </Suspense>
      
      {/* Desktop only */}
      {!isMobile && <HeavyDesktopFeature />}
    </>
  );
}
```

### Reduce Bundle Size

```typescript
// Use tree-shakeable imports
import { Button } from '@/components/ui/button'; // ✅ Good
import * as UI from '@/components/ui'; // ❌ Bad

// Dynamic imports for mobile-specific features
const MobileMenu = dynamic(() => import('./mobile-menu'), {
  ssr: false
});
```

---

## 🎯 Mobile UX Best Practices

### 1. **Thumb Zone Optimization**

```
┌─────────────────┐
│                 │ ← Hard to reach (top)
│                 │
│                 │
│ Primary Actions │ ← Easy to reach (bottom 1/3)
│ [Buy Now]       │
└─────────────────┘
```

Place primary actions in bottom third of screen for easy thumb access.

### 2. **Reduce Form Fields**

```tsx
// Desktop: 8 fields
// Mobile: 4 essential fields + "Add more" button

<form className="space-y-4">
  {/* Always visible */}
  <Input placeholder="Email" />
  <Input placeholder="Password" />
  
  {/* Optional - collapsed on mobile */}
  <Collapsible className="md:hidden">
    <CollapsibleTrigger className="text-sm text-primary">
      + More options
    </CollapsibleTrigger>
    <CollapsibleContent className="space-y-4 mt-4">
      <Input placeholder="Phone (optional)" />
      <Input placeholder="Company (optional)" />
    </CollapsibleContent>
  </Collapsible>
</form>
```

### 3. **Smart Input Types**

```tsx
// Trigger correct mobile keyboard
<Input type="email" inputMode="email" /> // Email keyboard
<Input type="tel" inputMode="tel" />     // Phone keyboard
<Input type="number" inputMode="numeric" /> // Number keyboard
<Input type="search" inputMode="search" /> // Search keyboard with "Go"
```

### 4. **Prevent Zoom on Input Focus**

```html
<!-- In layout.tsx or _document.tsx -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>
```

Or use larger input text:
```tsx
<Input className="text-base" /> // 16px minimum to prevent zoom
```

---

This completes Part 5. Ready for Part 6 (Implementation Guide)?
