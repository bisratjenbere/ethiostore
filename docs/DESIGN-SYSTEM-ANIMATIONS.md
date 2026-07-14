# Design System - Part 4: Animations & Micro-interactions

**Version**: 1.0  
**Date**: July 13, 2026

---

## 🎬 Animation Principles

### 2026 E-Commerce Animation Trends:
1. **Purposeful** - Every animation serves a UX goal
2. **Performant** - 60fps minimum, GPU-accelerated
3. **Subtle** - Enhance, don't distract
4. **Responsive** - Respect `prefers-reduced-motion`
5. **Branded** - Consistent timing and easing

### Timing Scale:

```css
/* Instant - State changes */
--duration-instant: 0ms

/* Fast - Micro-interactions */
--duration-fast: 150ms

/* Default - Most transitions */
--duration-default: 300ms

/* Slow - Page transitions, large movements */
--duration-slow: 500ms

/* Very Slow - Hero animations */
--duration-very-slow: 700ms
```

### Easing Functions:

```css
/* Default - Smooth in-out */
--ease-default: cubic-bezier(0.4, 0.0, 0.2, 1)

/* Sharp - Quick in, slow out */
--ease-sharp: cubic-bezier(0.4, 0.0, 0.6, 1)

/* Bounce - Playful spring */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Smooth - Very gentle */
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1)
```

---

## 🎨 Component Animations

### Button Hover States:

**Scale & Shadow**:
```tsx
<Button className="transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
  Add to Cart
</Button>
```

**Shimmer Effect** (For primary CTAs):
```tsx
<Button className="relative overflow-hidden group">
  <span className="relative z-10">Shop Now</span>
  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
</Button>
```

**Icon Slide**:
```tsx
<Button className="group">
  <span>Continue</span>
  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
</Button>
```

### Product Card Hover:

**Complete Interaction**:
```tsx
<Card className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  {/* Image Zoom */}
  <div className="overflow-hidden">
    <Image 
      className="transition-transform duration-700 group-hover:scale-110"
      src={product.image}
    />
  </div>
  
  {/* Price Color Change */}
  <p className="transition-colors duration-300 group-hover:text-primary">
    ${product.price}
  </p>
  
  {/* Button Reveal */}
  <Button className="opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
    Quick View
  </Button>
</Card>
```

### Image Gallery Transitions:

**Fade Between Images**:
```tsx
<div className="relative aspect-square">
  {images.map((img, i) => (
    <Image
      key={i}
      src={img}
      fill
      className={cn(
        "object-cover transition-opacity duration-500",
        i === currentIndex ? "opacity-100" : "opacity-0"
      )}
    />
  ))}
</div>
```

**Thumbnail Selection**:
```tsx
<button
  className={cn(
    "relative h-20 w-20 rounded-md overflow-hidden transition-all duration-300",
    isSelected 
      ? "ring-2 ring-primary ring-offset-2 scale-110" 
      : "opacity-60 hover:opacity-100"
  )}
>
  <Image src={thumbnail} fill />
</button>
```

---

## 🎭 Page Transitions

### Fade In On Load:

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

### Stagger Children:

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {products.map(product => (
    <motion.div
      key={product.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <ProductCard product={product} />
    </motion.div>
  ))}
</motion.div>
```

### Slide In From Side:

```tsx
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 100, opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  {content}
</motion.div>
```

---

## 🎪 Micro-interactions

### Add to Cart Animation:

**Flying Cart Icon**:
```tsx
const handleAddToCart = async (e: React.MouseEvent) => {
  const button = e.currentTarget.getBoundingClientRect();
  const cart = document.querySelector('[data-cart-icon]')!.getBoundingClientRect();
  
  // Create flying icon
  const flyingIcon = document.createElement('div');
  flyingIcon.className = 'fixed z-50 pointer-events-none';
  flyingIcon.style.left = `${button.left}px`;
  flyingIcon.style.top = `${button.top}px`;
  flyingIcon.innerHTML = '🛒';
  document.body.appendChild(flyingIcon);
  
  // Animate to cart
  flyingIcon.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${cart.left - button.left}px, ${cart.top - button.top}px) scale(0.3)`, opacity: 0 }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }).onfinish = () => flyingIcon.remove();
  
  // Add to cart
  await addToCart(product);
  
  // Animate cart badge
  document.querySelector('[data-cart-badge]')!.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.3)' },
    { transform: 'scale(1)' }
  ], { duration: 300 });
};
```

### Number Counter Animation:

```tsx
'use client';
import { useEffect, useState } from 'react';

const AnimatedNumber = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const start = performance.now();
    const startValue = display;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplay(Math.floor(startValue + (value - startValue) * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return <span>{display}</span>;
};

// Usage
<div className="text-4xl font-bold">
  $<AnimatedNumber value={totalPrice} />
</div>
```

### Progress Bar:

```tsx
const ProgressBar = ({ value, max = 100 }: { value: number; max?: number }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-primary transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
};

// Add to tailwind.config
{
  animation: {
    shimmer: 'shimmer 2s infinite',
  },
  keyframes: {
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  },
}
```

### Skeleton Loading:

```tsx
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

// Product card skeleton
<Card>
  <CardHeader>
    <Skeleton className="aspect-square w-full" />
  </CardHeader>
  <CardContent className="space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-6 w-1/4" />
  </CardContent>
</Card>
```

---

## 🔔 Notification Animations

### Toast Slide In:

```tsx
// Custom toast with animation
toast.custom((t) => (
  <div
    className={cn(
      "flex items-center gap-3 bg-card p-4 rounded-lg shadow-lg border transition-all duration-300",
      t.visible ? "animate-slide-in" : "animate-slide-out"
    )}
  >
    <CheckCircle className="h-5 w-5 text-green-500" />
    <div>
      <p className="font-semibold">Success!</p>
      <p className="text-sm text-muted-foreground">Product added to cart</p>
    </div>
  </div>
));

// Add to tailwind.config
{
  keyframes: {
    'slide-in': {
      '0%': { transform: 'translateX(100%)', opacity: 0 },
      '100%': { transform: 'translateX(0)', opacity: 1 },
    },
    'slide-out': {
      '0%': { transform: 'translateX(0)', opacity: 1 },
      '100%': { transform: 'translateX(100%)', opacity: 0 },
    },
  },
}
```

### Badge Pulse:

```tsx
<Badge className="relative animate-pulse-scale">
  New
  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
</Badge>

// Add to tailwind.config
{
  animation: {
    'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
  },
  keyframes: {
    'pulse-scale': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    },
  },
}
```

---

## 🎯 Scroll Animations

### Fade In On Scroll:

```tsx
'use client';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(50px)',
      }}
    >
      {children}
    </div>
  );
};
```

### Parallax Effect:

```tsx
'use client';
import { useScroll, useTransform, motion } from 'framer-motion';

const ParallaxImage = ({ src }: { src: string }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  return (
    <div className="relative h-96 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src={src} fill className="object-cover" />
      </motion.div>
    </div>
  );
};
```

### Sticky Header Shrink:

```tsx
'use client';
import { useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';

const Header = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 100);
    });
  }, [scrollY]);
  
  return (
    <header className={cn(
      "sticky top-0 z-50 border-b bg-background transition-all duration-300",
      isScrolled ? "h-14 shadow-md" : "h-20"
    )}>
      <div className="wrapper flex items-center justify-between h-full">
        {/* Logo shrinks when scrolled */}
        <Image
          src="/logo.svg"
          width={isScrolled ? 32 : 48}
          height={isScrolled ? 32 : 48}
          className="transition-all duration-300"
        />
        {/* Rest of header */}
      </div>
    </header>
  );
};
```

---

## ⚡ Performance Optimization

### Use CSS Transforms (GPU Accelerated):

✅ **DO THIS**:
```css
/* GPU accelerated */
transform: translateX(10px);
transform: scale(1.1);
opacity: 0.5;
```

❌ **NOT THIS**:
```css
/* CPU intensive */
left: 10px;
width: 110%;
visibility: hidden;
```

### Prefers Reduced Motion:

```tsx
// Respect user preferences
const Animation = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        // Disable for users who prefer reduced motion
        type: window.matchMedia('(prefers-reduced-motion: reduce)').matches 
          ? false 
          : "spring"
      }}
    >
      {children}
    </motion.div>
  );
};

// Or use CSS
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Will-Change Property:

```css
/* Tell browser to optimize for animation */
.product-card:hover .product-image {
  will-change: transform;
  transform: scale(1.1);
}

/* Remove after animation */
.product-card:not(:hover) .product-image {
  will-change: auto;
}
```

---

## 🎨 Loading States

### Button Loading:

```tsx
<Button disabled={isLoading} className="relative">
  <span className={cn(isLoading && "opacity-0")}>
    Add to Cart
  </span>
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </span>
  )}
</Button>
```

### Page Loading:

```tsx
const PageLoader = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="space-y-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);
```

### Shimmer Loading Cards:

```tsx
const ShimmerCard = () => (
  <Card className="overflow-hidden">
    <div className="relative">
      <Skeleton className="aspect-square w-full" />
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
    <CardContent className="p-6 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/4" />
    </CardContent>
  </Card>
);
```

---

This completes Part 4. Continue to Part 5 (Mobile Design) and Part 6 (Implementation)?
