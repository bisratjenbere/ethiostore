# Design System - Part 3: Page Layouts

**Version**: 1.0  
**Date**: July 13, 2026

---

## 📄 Product Detail Page

### Visual Layout:

```
Desktop Layout:
┌──────────────────────────────────────────────┐
│  Breadcrumb: Home > Category > Product      │
├─────────────────┬────────────────────────────┤
│                 │                            │
│                 │  Product Name (H1)         │
│   Product       │  Brand | SKU | Rating     │
│   Gallery       │                            │
│   (Zoom)        │  Price (Large, Bold)       │
│                 │  [Add to Cart] [Wishlist]  │
│   Thumbnails    │                            │
│                 │  Description               │
│                 │  • Feature 1               │
├─────────────────┤  • Feature 2               │
│                 │                            │
│  Sticky Buy Box │  [Accordion: Specs]        │
│  (on scroll)    │  [Accordion: Shipping]     │
│                 │  [Accordion: Returns]      │
└─────────────────┴────────────────────────────┘
│                                              │
│  Customer Reviews (★★★★★ 4.5/5)            │
│  [Write Review Button]                       │
│  ┌────────────────────────────────────┐     │
│  │ Review Card 1                      │     │
│  └────────────────────────────────────┘     │
│                                              │
│  Related Products                            │
│  [Product Card] [Product Card] ...           │
└──────────────────────────────────────────────┘
```

### Key Elements:

**1. Product Gallery**
- Main image: Large, zoomable (800x800px minimum)
- Thumbnails: Vertical strip on desktop, horizontal on mobile
- Zoom on hover (desktop), pinch-to-zoom (mobile)
- Image counter: "1/5"
- Video support if available

**2. Sticky Buy Box** (Appears after scrolling past main CTA)
```tsx
<div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t p-4 md:hidden shadow-lg">
  <div className="flex items-center justify-between">
    <div>
      <p className="font-bold text-lg">${product.price}</p>
      <p className="text-sm text-muted-foreground">{product.name}</p>
    </div>
    <Button size="lg">Add to Cart</Button>
  </div>
</div>
```

**3. Product Information Hierarchy**
- Product Name: 32px, bold
- Brand: 14px, uppercase, gray
- Price: 36px, bold, primary color
- Description: 16px, line-height 1.6
- Bullets: Clear, scannable features

**4. Trust Signals**
- Free shipping badge
- Return policy link
- Secure checkout badge
- Stock availability
- Estimated delivery date

---

## 🛒 Cart Page

### Visual Layout:

```
Desktop Layout:
┌──────────────────────────────────────────────┐
│  Shopping Cart (3 items)                     │
├──────────────────────────┬───────────────────┤
│                          │                   │
│  Cart Items (Scrollable) │  Order Summary    │
│  ┌────────────────────┐  │  ┌─────────────┐ │
│  │ [Img] Product 1   │  │  │ Subtotal    │ │
│  │ Qty: [▼] | $99.99 │  │  │ Shipping    │ │
│  └────────────────────┘  │  │ Tax         │ │
│                          │  │ ──────────  │ │
│  ┌────────────────────┐  │  │ Total       │ │
│  │ [Img] Product 2   │  │  │             │ │
│  │ Qty: [▼] | $49.99 │  │  │ [Checkout]  │ │
│  └────────────────────┘  │  │             │ │
│                          │  │ [PayPal]    │ │
│  Free Shipping Bar       │  └─────────────┘ │
│  ████████░░░░ Add $25    │                   │
│                          │  Accepted Cards   │
│  [Continue Shopping]     │  💳 Visa Master   │
│                          │                   │
└──────────────────────────┴───────────────────┘
│                                              │
│  Recommendations: "You May Also Like"        │
│  [Product Card] [Product Card] ...           │
└──────────────────────────────────────────────┘
```

### Cart Item Component:

```tsx
<div className="flex gap-4 p-4 border rounded-lg">
  {/* Image */}
  <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
    <Image src={item.image} fill alt={item.name} className="object-cover" />
  </div>
  
  {/* Details */}
  <div className="flex-1 min-w-0">
    <Link href={`/product/${item.slug}`} className="font-semibold hover:text-primary line-clamp-2">
      {item.name}
    </Link>
    <p className="text-sm text-muted-foreground mt-1">{item.brand}</p>
    
    {/* Quantity & Price */}
    <div className="flex items-center justify-between mt-3">
      <Select value={item.qty.toString()} onValueChange={handleQtyChange}>
        <SelectTrigger className="w-20 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[...Array(10)].map((_, i) => (
            <SelectItem key={i + 1} value={(i + 1).toString()}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="font-bold text-lg">${(item.price * item.qty).toFixed(2)}</p>
    </div>
  </div>
  
  {/* Remove */}
  <Button
    variant="ghost"
    size="icon"
    onClick={handleRemove}
    className="flex-shrink-0"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</div>
```

### Order Summary (Sticky on Desktop):

```tsx
<Card className="lg:sticky lg:top-20">
  <CardHeader>
    <CardTitle>Order Summary</CardTitle>
  </CardHeader>
  
  <CardContent className="space-y-4">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Subtotal</span>
      <span className="font-medium">${itemsPrice}</span>
    </div>
    
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Shipping</span>
      <span className="font-medium">
        {shippingPrice === 0 ? 'FREE' : `$${shippingPrice}`}
      </span>
    </div>
    
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Tax</span>
      <span className="font-medium">${taxPrice}</span>
    </div>
    
    <Separator />
    
    <div className="flex justify-between">
      <span className="font-semibold text-lg">Total</span>
      <span className="font-bold text-2xl">${totalPrice}</span>
    </div>
    
    <Button size="lg" className="w-full">
      Proceed to Checkout
    </Button>
    
    <Button variant="outline" size="lg" className="w-full gap-2">
      <Image src="/paypal-logo.svg" width={20} height={20} alt="PayPal" />
      PayPal
    </Button>
    
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <Shield className="h-3 w-3" />
      Secure checkout
    </div>
  </CardContent>
</Card>
```

---

## 💳 Checkout Flow

### Step Indicator:

```tsx
<div className="flex items-center justify-between mb-8">
  {['Shipping', 'Payment', 'Review'].map((step, index) => (
    <div key={step} className="flex items-center">
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full",
        index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {index < currentStep ? (
          <Check className="h-5 w-5" />
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
      
      <span className={cn(
        "ml-3 text-sm font-medium hidden md:block",
        index <= currentStep ? "text-foreground" : "text-muted-foreground"
      )}>
        {step}
      </span>
      
      {index < 2 && (
        <div className={cn(
          "w-12 h-0.5 mx-4",
          index < currentStep ? "bg-primary" : "bg-muted"
        )} />
      )}
    </div>
  ))}
</div>
```

### Checkout Page Layout:

```
Desktop Layout:
┌──────────────────────────────────────────────┐
│  ← Back to Cart    [Step Indicator]          │
├──────────────────────────┬───────────────────┤
│                          │                   │
│  Shipping Address        │  Order Summary    │
│  ┌────────────────────┐  │  (Sticky)         │
│  │ [Form Fields]     │  │                   │
│  │ • Full Name       │  │  [Item List]      │
│  │ • Address         │  │  Subtotal: $149   │
│  │ • City            │  │  Shipping: FREE   │
│  │ • Postal Code     │  │  Tax: $22.35      │
│  │                   │  │  Total: $171.35   │
│  │ [Save Address]    │  │                   │
│  └────────────────────┘  │  🔒 Secure        │
│                          │                   │
│  Payment Method          │                   │
│  ○ Credit Card           │                   │
│  ○ PayPal                │                   │
│  ○ Apple Pay             │                   │
│                          │                   │
│  [Place Order Button]    │                   │
│                          │                   │
└──────────────────────────┴───────────────────┘
```

### Express Checkout:

```tsx
<div className="space-y-3">
  <p className="text-center text-sm text-muted-foreground">
    Express checkout
  </p>
  
  <div className="grid grid-cols-2 gap-3">
    <Button variant="outline" className="h-12">
      <Image src="/apple-pay.svg" width={40} height={20} alt="Apple Pay" />
    </Button>
    <Button variant="outline" className="h-12">
      <Image src="/google-pay.svg" width={40} height={20} alt="Google Pay" />
    </Button>
  </div>
  
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <Separator />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">
        Or continue with
      </span>
    </div>
  </div>
</div>
```

---

## 📦 Order Confirmation Page

### Success Message:

```tsx
<div className="max-w-2xl mx-auto text-center py-16">
  <div className="mb-6">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
      <CheckCircle className="h-10 w-10 text-green-600" />
    </div>
    
    <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
    <p className="text-muted-foreground">
      Thank you for your purchase. We've sent a confirmation email to{' '}
      <span className="font-medium text-foreground">{user.email}</span>
    </p>
  </div>
  
  <Card className="text-left">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-6">
      {/* Order Items */}
      <div className="space-y-3">
        {order.items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 rounded-md overflow-hidden">
              <Image src={item.image} fill alt={item.name} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
            </div>
            <p className="font-medium">${item.price * item.qty}</p>
          </div>
        ))}
      </div>
      
      <Separator />
      
      {/* Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${order.itemsPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${order.shippingPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${order.taxPrice}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${order.totalPrice}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button className="flex-1" asChild>
          <Link href={`/user/order/${order.id}`}>View Order</Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
</div>
```

---

## 📋 User Dashboard

### Order History:

```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold">Order History</h2>
    <Select defaultValue="all">
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Orders</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  {orders.map(order => (
    <Card key={order.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-lg">${order.totalPrice}</p>
            <Badge variant={order.isDelivered ? "success" : "secondary"}>
              {order.isDelivered ? 'Delivered' : 'In Transit'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="relative h-16 w-16 rounded-md overflow-hidden">
              <Image src={item.image} fill alt="" />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex items-center justify-center h-16 w-16 bg-muted rounded-md text-sm font-medium">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/user/order/${order.id}`}>View Details</Link>
          </Button>
          {order.isDelivered && (
            <Button size="sm">Leave Review</Button>
          )}
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 🎨 Empty States

### Empty Cart:

```tsx
<div className="flex flex-col items-center justify-center py-16 px-4">
  <div className="mb-6">
    <ShoppingCart className="h-24 w-24 text-muted-foreground/30" />
  </div>
  
  <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
  <p className="text-muted-foreground mb-8 text-center max-w-md">
    Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
  </p>
  
  <Button size="lg" asChild>
    <Link href="/shop">
      <Plus className="mr-2 h-4 w-4" />
      Start Shopping
    </Link>
  </Button>
</div>
```

### No Orders:

```tsx
<div className="flex flex-col items-center justify-center py-16 px-4">
  <div className="mb-6">
    <Package className="h-24 w-24 text-muted-foreground/30" />
  </div>
  
  <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
  <p className="text-muted-foreground mb-8 text-center max-w-md">
    When you place orders, they will appear here. Ready to make your first purchase?
  </p>
  
  <Button size="lg" asChild>
    <Link href="/shop">Browse Products</Link>
  </Button>
</div>
```

---

This completes Part 3. Continue to Part 4?
