# UX Issues - Fix Plan

## Issues Identified

### 1. ✅ Duplicate Promotional Banner
**Issue**: "Summer Sale - Up to 50% OFF..." appears twice (header + homepage)
**Solution**: Remove promotional banner from homepage, keep only in sticky header

### 2. ✅ Currency Change ($ → Birr)
**Issue**: All prices show in USD, need Ethiopian Birr (ETB)
**Solution**: Update FormatCurrency utility function

### 3. ✅ Unnecessary "New Arrivals" in Hero
**Issue**: "New Arrivals" text is redundant in hero section
**Solution**: Remove or replace with better copy

### 4. ✅ Product Image Zoom
**Issue**: No zoom functionality on product detail page images
**Solution**: Implement image zoom on hover/click

### 5. ✅ Cart Spinner Issue
**Issue**: All action buttons spin when clicking any +/- button
**Solution**: Track individual item loading states

### 6. ✅ Payment Status Not Updating
**Issue**: After successful Stripe payment, order status shows "Pending"
**Solution**: Fix Stripe webhook to update order status

---

## Implementation Order

1. Remove duplicate promo banner
2. Change currency to Birr
3. Remove "New Arrivals" from hero
4. Fix cart button spinners
5. Fix payment status webhook
6. Add image zoom functionality

