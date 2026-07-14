# Design System - Part 2: Component Library (Complete)

**Version**: 1.0  
**Date**: July 13, 2026

---

## 🎨 Component Design Standards

All components should follow these principles:
1. **Accessibility First** - WCAG 2.1 AA compliance minimum
2. **Mobile-First** - Design for smallest screen, enhance upward
3. **Touch-Friendly** - Minimum 44px tap targets
4. **Loading States** - Every interactive component needs loading state
5. **Error States** - Clear error messaging with recovery actions
6. **Empty States** - Helpful guidance when no data exists

---

## 🔘 Buttons

### Current Issues:
- Only basic variants (default, outline, ghost)
- No size variety beyond sm/lg
- No icon button optimization
- Missing loading states
- No hover animations

### Button Hierarchy:

**Primary** - Main call-to-action
```tsx
<Button size="lg" className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all">
  Add to Cart
</Button>
```
- **Use**: Main actions (Add to Cart, Checkout, Sign Up)
- **Color**: Primary brand color
- **Max per page**: 1-2
- **When**: The one thing you want user to do

**Secondary** - Supporting actions
```tsx
<Button variant="outline" size="lg" className="hover:bg-muted">
  Add to Wishlist
</Button>
```
- **Use**: Secondary actions (Wishlist, Compare, Learn More)
- **Color**: Outline with border
- **Max per page**: 3-4
- **When**: Alternative actions

**Tertiary** - Subtle actions
```tsx
<Button variant="ghost" className="hover:bg-muted">
  View Details
</Button>
```
- **Use**: Less important actions (View, Edit, Cancel)
- **Color**: No background, text only
- **Unlimited usage**
- **When**: Low-priority actions

### Complete Size Scale:

```tsx
// Extra Small - Inline actions, mobile compact
<Button size="xs" className="h-7 px-2 text-xs">
  Remove
</Button>

// Small - Compact areas, secondary actions
<Button size="sm" className="h-9 px-3 text-sm">
  Edit
</Button>

// Default - Standard UI elements
<Button size="default" className="h-10 px-4 text-sm">
  Save Changes
</Button>

// Large - Primary CTAs, emphasis
<Button size="lg" className="h-12 px-6 text-base font-semibold">
  Add to Cart
</Button>

// Extra Large - Hero sections, landing pages
<Button size="xl" className="h-14 px-8 text-lg font-bold">
  Shop Now
</Button>

// Icon - Square buttons for icons only
<Button size="icon" className="h-10 w-10">
  <Heart className="h-5 w-5" />
</Button>
```

### Button States (Complete):

**Default State**:
```tsx
<Button className="bg-primary text-primary-foreground">
  Click Me
</Button>
```

**Hover State**:
```tsx
<Button className="hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300">
  Hover Effect
</Button>
```

**Active/Pressed State**:
```tsx
<Button className="active:scale-95 active:shadow-sm transition-transform">
  Press Me
</Button>
```

**Loading State**:
```tsx
<Button disabled={isPending}>
  {isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Processing...
    </>
  ) : (
    'Add to Cart'
  )}
</Button>
```

**Disabled State**:
```tsx
<Button disabled className="opacity-50 cursor-not-allowed">
  Unavailable
</Button>
```

**Success State** (After action):
```tsx
<Button className="bg-green-600 hover:bg-green-700">
  <Check className="mr-2 h-4 w-4" />
  Added to Cart
</Button>
```

### Button with Icon Patterns:

**Icon Left**:
```tsx
<Button>
  <ShoppingCart className="mr-2 h-4 w-4" />
  Add to Cart
</Button>
```

**Icon Right**:
```tsx
<Button>
  Continue
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
```

**Icon Only** (with accessible label):
```tsx
<Button size="icon" variant="ghost" aria-label="Add to wishlist">
  <Heart className="h-5 w-5" />
</Button>
```

**Icon with Badge**:
```tsx
<Button size="icon" variant="ghost" className="relative">
  <ShoppingCart className="h-5 w-5" />
  {cartCount > 0 && (
    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
      {cartCount}
    </Badge>
  )}
</Button>
```

### Advanced Button Styles:

**Gradient Button** (For promotions, special offers):
```tsx
<Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all">
  <Zap className="mr-2 h-4 w-4" />
  Limited Offer - Save 50%
</Button>
```

**Outlined with Icon**:
```tsx
<Button variant="outline" className="border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
  <Download className="mr-2 h-4 w-4" />
  Download Receipt
</Button>
```

**Pill Button** (For tags, categories, filters):
```tsx
<Button variant="outline" className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground">
  Electronics
</Button>
```

**Full Width** (Mobile-friendly):
```tsx
<Button className="w-full md:w-auto">
  Proceed to Checkout
</Button>
```

**Button Group**:
```tsx
<div className="flex gap-2">
  <Button variant="outline" className="flex-1">
    <Minus className="h-4 w-4" />
  </Button>
  <span className="flex items-center justify-center min-w-[3rem] font-medium">
    {quantity}
  </span>
  <Button variant="outline" className="flex-1">
    <Plus className="h-4 w-4" />
  </Button>
</div>
```

**Shimmer Effect Button** (For emphasis):
```tsx
<Button className="relative overflow-hidden group">
  <span className="relative z-10">Shop Now</span>
  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
</Button>
```

---

## 📝 Form Inputs

### Input Field Anatomy:

```
┌─────────────────────────────────────┐
│ Label * Required                     │  ← Label with indicator
├─────────────────────────────────────┤
│ [🔍  Enter search term...       ] ⓘ │  ← Input with icon + helper
├─────────────────────────────────────┤
│ Helper text or error message        │  ← Contextual help
└─────────────────────────────────────┘
```

### Text Input - All States:

**Basic Input**:
```tsx
<div className="space-y-2">
  <Label htmlFor="email" className="text-sm font-medium">
    Email Address
    <span className="text-destructive ml-1">*</span>
  </Label>
  
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    className="h-11 rounded-lg"
    aria-describedby="email-description"
  />
  
  <p id="email-description" className="text-sm text-muted-foreground">
    We'll never share your email with anyone
  </p>
</div>
```

**Input with Left Icon**:
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  <Input
    placeholder="Search products..."
    className="pl-10 h-11 rounded-lg"
  />
</div>
```

**Input with Right Icon** (Clear button):
```tsx
<div className="relative">
  <Input
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search..."
    className="pr-10 h-11"
  />
  {searchTerm && (
    <button
      onClick={() => setSearchTerm('')}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      <X className="h-4 w-4" />
    </button>
  )}
</div>
```

**Input with Both Icons**:
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Search..."
    className="px-10 h-11"
  />
  <button className="absolute right-3 top-1/2 -translate-y-1/2">
    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
  </button>
</div>
```

### Input States:

**Default/Normal**:
```tsx
<Input
  placeholder="Enter text"
  className="border-input focus-visible:ring-2 focus-visible:ring-ring"
/>
```

**Error State**:
```tsx
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    className="border-destructive focus-visible:ring-destructive"
    aria-invalid="true"
    aria-describedby="password-error"
  />
  <p id="password-error" className="text-sm text-destructive flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    Password must be at least 8 characters
  </p>
</div>
```

**Success/Valid State**:
```tsx
<div className="space-y-2">
  <Label>Email</Label>
  <div className="relative">
    <Input
      value="valid@email.com"
      className="border-green-500 pr-10"
    />
    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
  </div>
  <p className="text-sm text-green-600">Email is valid</p>
</div>
```

**Disabled State**:
```tsx
<Input
  disabled
  value="Cannot edit this"
  className="opacity-50 cursor-not-allowed bg-muted"
/>
```

**Loading State**:
```tsx
<div className="relative">
  <Input placeholder="Checking availability..." disabled />
  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
</div>
```

### Specialized Inputs:

**Password Input with Toggle**:
```tsx
'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
```

**Number Input with Increment/Decrement**:
```tsx
<div className="flex items-center gap-2">
  <Button
    variant="outline"
    size="icon"
    onClick={() => setValue(Math.max(1, value - 1))}
  >
    <Minus className="h-4 w-4" />
  </Button>
  
  <Input
    type="number"
    value={value}
    onChange={(e) => setValue(parseInt(e.target.value) || 1)}
    className="w-20 text-center"
    min="1"
  />
  
  <Button
    variant="outline"
    size="icon"
    onClick={() => setValue(value + 1)}
  >
    <Plus className="h-4 w-4" />
  </Button>
</div>
```

**Search Input with Autocomplete**:
```tsx
'use client';
import { useState } from 'react';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';

const SearchWithAutocomplete = ({ suggestions }: { suggestions: string[] }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Command className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <CommandInput
          placeholder="Search products..."
          className="pl-10"
          onFocus={() => setOpen(true)}
        />
      </div>
      
      {open && (
        <CommandList className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50">
          {suggestions.map((item) => (
            <CommandItem key={item} onSelect={() => setOpen(false)}>
              {item}
            </CommandItem>
          ))}
        </CommandList>
      )}
    </Command>
  );
};
```

### Select / Dropdown:

**Basic Select**:
```tsx
<Select>
  <SelectTrigger className="h-11 rounded-lg">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="electronics">Electronics</SelectItem>
    <SelectItem value="fashion">Fashion</SelectItem>
    <SelectItem value="home">Home & Garden</SelectItem>
    <SelectItem value="sports">Sports & Outdoors</SelectItem>
  </SelectContent>
</Select>
```

**Select with Icons**:
```tsx
<Select>
  <SelectTrigger className="h-11">
    <SelectValue placeholder="Sort by" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="newest">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>Newest First</span>
      </div>
    </SelectItem>
    <SelectItem value="price-low">
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4" />
        <span>Price: Low to High</span>
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

### Textarea:

```tsx
<div className="space-y-2">
  <Label htmlFor="review">Your Review</Label>
  <Textarea
    id="review"
    placeholder="Tell us what you think about this product..."
    className="min-h-[120px] rounded-lg resize-none"
    maxLength={500}
  />
  <div className="flex items-center justify-between text-sm">
    <p className="text-muted-foreground">
      Share your honest opinion
    </p>
    <p className="text-muted-foreground">
      {value.length}/500 characters
    </p>
  </div>
</div>
```

### Checkbox:

**Basic Checkbox**:
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label
    htmlFor="terms"
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
  >
    I agree to the{' '}
    <Link href="/terms" className="underline hover:text-primary">
      terms and conditions
    </Link>
  </label>
</div>
```

**Checkbox List** (Filters):
```tsx
<div className="space-y-3">
  <h3 className="font-semibold mb-3">Categories</h3>
  {categories.map((category) => (
    <div key={category} className="flex items-center space-x-2">
      <Checkbox
        id={category}
        checked={selectedCategories.includes(category)}
        onCheckedChange={(checked) => {
          if (checked) {
            setSelectedCategories([...selectedCategories, category]);
          } else {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
          }
        }}
      />
      <label
        htmlFor={category}
        className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
      >
        {category}
      </label>
    </div>
  ))}
</div>
```

### Radio Group:

```tsx
<RadioGroup defaultValue="standard" className="space-y-3">
  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
    <RadioGroupItem value="standard" id="standard" />
    <div className="flex-1">
      <Label htmlFor="standard" className="font-medium cursor-pointer">
        Standard Shipping
      </Label>
      <p className="text-sm text-muted-foreground">
        5-7 business days • FREE
      </p>
    </div>
  </div>
  
  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
    <RadioGroupItem value="express" id="express" />
    <div className="flex-1">
      <Label htmlFor="express" className="font-medium cursor-pointer">
        Express Shipping
      </Label>
      <p className="text-sm text-muted-foreground">
        2-3 business days • $15.00
      </p>
    </div>
    <Badge className="bg-amber-500">Fast</Badge>
  </div>
  
  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
    <RadioGroupItem value="overnight" id="overnight" />
    <div className="flex-1">
      <Label htmlFor="overnight" className="font-medium cursor-pointer">
        Overnight Shipping
      </Label>
      <p className="text-sm text-muted-foreground">
        Next business day • $30.00
      </p>
    </div>
    <Badge variant="destructive">Urgent</Badge>
  </div>
</RadioGroup>
```

### Switch/Toggle:

```tsx
<div className="flex items-center justify-between p-4 border rounded-lg">
  <div className="space-y-0.5">
    <Label htmlFor="notifications" className="text-base font-medium">
      Email Notifications
    </Label>
    <p className="text-sm text-muted-foreground">
      Receive updates about your orders
    </p>
  </div>
  <Switch id="notifications" />
</div>
```

---

## 🎴 Cards

### Product Card (Ultimate Version):

```tsx
import { Product } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Eye, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-md">
      {/* Badge Overlays */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isFeatured && (
          <Badge className="bg-amber-500 shadow-md">
            ⭐ Featured
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-blue-500 shadow-md">
            🆕 New
          </Badge>
        )}
        {product.discount && (
          <Badge className="bg-red-500 shadow-md font-bold">
            -{product.discount}%
          </Badge>
        )}
      </div>
      
      {product.stock > 0 && product.stock < 10 && (
        <Badge variant="destructive" className="absolute top-3 right-3 z-10 shadow-md animate-pulse">
          Only {product.stock} left!
        </Badge>
      )}
      
      {/* Image Container */}
      <CardHeader className="p-0 relative overflow-hidden group/image">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-square bg-gray-50">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        </Link>
        
        {/* Quick Actions - Desktop Only */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="shadow-lg"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {/* Content */}
      <CardContent className="p-4 md:p-6 space-y-2 md:space-y-3">
        {/* Brand */}
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {product.brand}
        </p>
        
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3 md:h-3.5 md:w-3.5",
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground hidden md:inline">
            ({product.numReviews})
          </span>
        </div>
        
        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-lg md:text-xl font-bold text-foreground">
              ${product.price}
            </p>
            {product.compareAtPrice && (
              <p className="text-sm text-muted-foreground line-through">
                ${product.compareAtPrice}
              </p>
            )}
          </div>
          
          {product.stock > 0 ? (
            <Button
              size="sm"
              className="hidden md:inline-flex opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <Plus className="h-4 w-4" />
            </Button>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
```

This completes the component library! The document now includes comprehensive examples for all major component types. Would you like me to continue with more component patterns or shall we move to implementing these designs?

