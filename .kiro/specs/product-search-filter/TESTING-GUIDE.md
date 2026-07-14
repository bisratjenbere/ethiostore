# Product Search & Filtering - Testing Guide

## 🧪 Comprehensive Testing Checklist

Use this guide to thoroughly test the product search and filtering feature.

---

## 🚀 Getting Started

### Prerequisites
```bash
# 1. Start the development server
npm run dev

# 2. Ensure database is seeded with products
npx prisma db seed

# 3. Open browser to
http://localhost:3000/shop
```

---

## ✅ Test Scenarios

### 1. Basic Navigation (2 minutes)

#### Test 1.1: Access Shop Page
- [ ] Click "Shop" link in header
- [ ] Verify redirects to `/shop`
- [ ] Verify products display in grid
- [ ] Verify product count shows (e.g., "6 products found")

#### Test 1.2: Homepage Link
- [ ] Go to homepage (`/`)
- [ ] Click "Browse All Products" button
- [ ] Verify redirects to `/shop`

**Expected Result**: Easy access to shop from multiple places

---

### 2. Search Functionality (5 minutes)

#### Test 2.1: Basic Search
- [ ] Type "shirt" in search bar
- [ ] Wait 500ms
- [ ] Verify URL updates to `?q=shirt`
- [ ] Verify only matching products display
- [ ] Verify product count updates

#### Test 2.2: Clear Search
- [ ] Click X button in search bar
- [ ] Verify search clears
- [ ] Verify URL parameter `q` removed
- [ ] Verify all products display again

#### Test 2.3: Search with No Results
- [ ] Search for "xyz123nonexistent"
- [ ] Verify empty state message displays
- [ ] Verify message suggests adjusting filters
- [ ] Clear search and verify products return

#### Test 2.4: Case Insensitive Search
- [ ] Search for "SHIRT"
- [ ] Verify returns same results as "shirt"
- [ ] Try "ShIrT" mixed case
- [ ] Verify still works

#### Test 2.5: Debounce Behavior
- [ ] Type "s"
- [ ] Immediately type "h"
- [ ] Immediately type "i"
- [ ] Immediately type "rt"
- [ ] Wait 500ms
- [ ] Verify URL only updated once with "shrt"

**Expected Result**: Fast, intuitive search with proper debouncing

---

### 3. Category Filter (3 minutes)

#### Test 3.1: Select Category
- [ ] Click "Men's Dress Shirts" category
- [ ] Verify URL shows `?category=Men's+Dress+Shirts`
- [ ] Verify only products from that category display
- [ ] Verify product count updates
- [ ] Verify category is highlighted in filter

#### Test 3.2: Change Category
- [ ] Click different category
- [ ] Verify URL updates
- [ ] Verify products change
- [ ] Verify previous category unhighlighted

#### Test 3.3: Clear Category
- [ ] Click "All Categories"
- [ ] Verify `category` parameter removed from URL
- [ ] Verify all products display again

#### Test 3.4: Category Counts
- [ ] Verify each category shows product count in parentheses
- [ ] Verify counts are accurate

**Expected Result**: Categories filter products correctly with accurate counts

---

### 4. Brand Filter (3 minutes)

#### Test 4.1: Select Brand
- [ ] Click a brand (e.g., "Polo")
- [ ] Verify URL shows `?brand=Polo`
- [ ] Verify only products from that brand display
- [ ] Verify product count updates
- [ ] Verify brand is highlighted

#### Test 4.2: Change Brand
- [ ] Click different brand
- [ ] Verify URL updates
- [ ] Verify products change

#### Test 4.3: Clear Brand
- [ ] Click "All Brands"
- [ ] Verify `brand` parameter removed from URL
- [ ] Verify all products display

#### Test 4.4: Brand Counts
- [ ] Verify each brand shows product count
- [ ] Verify counts match actual products

**Expected Result**: Brands filter products correctly with accurate counts

---

### 5. Price Range Filter (3 minutes)

#### Test 5.1: Select Price Range
- [ ] Click "$50 - $100" price range
- [ ] Verify URL shows `?minPrice=50&maxPrice=100`
- [ ] Verify only products in that range display
- [ ] Verify all products have prices between $50-$100

#### Test 5.2: Try Different Ranges
- [ ] Click "Under $50"
- [ ] Verify URL shows `?maxPrice=50`
- [ ] Verify all products under $50
- [ ] Click "$500+"
- [ ] Verify URL shows `?minPrice=500`
- [ ] Verify all products over $500

#### Test 5.3: Clear Price Range
- [ ] Click "All Prices"
- [ ] Verify price parameters removed from URL
- [ ] Verify all products display

**Expected Result**: Price filtering works accurately for all ranges

---

### 6. Stock Filter (2 minutes)

#### Test 6.1: Enable Stock Filter
- [ ] Check "In Stock Only" checkbox
- [ ] Verify URL shows `?inStock=true`
- [ ] Verify only in-stock products display
- [ ] Verify no out-of-stock products shown

#### Test 6.2: Disable Stock Filter
- [ ] Uncheck "In Stock Only"
- [ ] Verify `inStock` parameter removed from URL
- [ ] Verify all products display (including out of stock)

**Expected Result**: Stock filter shows only available products

---

### 7. Combined Filters (5 minutes)

#### Test 7.1: Search + Category
- [ ] Search for "shirt"
- [ ] Select a category
- [ ] Verify both filters work together
- [ ] Verify URL has both parameters
- [ ] Verify results match both criteria

#### Test 7.2: Category + Brand
- [ ] Select a category
- [ ] Select a brand
- [ ] Verify products match both filters
- [ ] Verify URL has both parameters

#### Test 7.3: All Filters Combined
- [ ] Search for a term
- [ ] Select category
- [ ] Select brand
- [ ] Select price range
- [ ] Enable in-stock only
- [ ] Verify all filters work together
- [ ] Verify URL has all parameters
- [ ] Verify results match all criteria

#### Test 7.4: No Results with Multiple Filters
- [ ] Apply filters that result in no products
- [ ] Verify empty state displays
- [ ] Verify suggestions to adjust filters

**Expected Result**: Multiple filters combine correctly with AND logic

---

### 8. Sorting (4 minutes)

#### Test 8.1: Sort by Price (Low to High)
- [ ] Open sort dropdown
- [ ] Select "Price: Low to High"
- [ ] Verify URL shows `?sortBy=price&order=asc`
- [ ] Verify products ordered by price ascending
- [ ] Check first and last products

#### Test 8.2: Sort by Price (High to Low)
- [ ] Select "Price: High to Low"
- [ ] Verify URL shows `?sortBy=price&order=desc`
- [ ] Verify products ordered by price descending

#### Test 8.3: Sort by Name
- [ ] Select "Name: A-Z"
- [ ] Verify alphabetical order
- [ ] Select "Name: Z-A"
- [ ] Verify reverse alphabetical order

#### Test 8.4: Sort with Filters
- [ ] Apply a category filter
- [ ] Change sort order
- [ ] Verify filtered products are sorted correctly
- [ ] Verify both filter and sort parameters in URL

**Expected Result**: Sorting works correctly for all options and with filters

---

### 9. Active Filters Display (3 minutes)

#### Test 9.1: Display Active Filters
- [ ] Apply search
- [ ] Verify badge shows "Search: [term]"
- [ ] Apply category filter
- [ ] Verify badge shows "Category: [name]"
- [ ] Apply brand filter
- [ ] Verify badge shows "Brand: [name]"
- [ ] Apply price range
- [ ] Verify badge shows "Price: $X - $Y"

#### Test 9.2: Remove Individual Filter
- [ ] Click X on search badge
- [ ] Verify search filter removed
- [ ] Verify other filters remain
- [ ] Repeat for each filter type

#### Test 9.3: Clear All Filters
- [ ] Apply multiple filters
- [ ] Click "Clear All" button
- [ ] Verify all filters removed
- [ ] Verify URL cleared
- [ ] Verify all products display

**Expected Result**: Active filters display correctly and can be removed

---

### 10. Pagination (4 minutes)

#### Test 10.1: Basic Pagination
- [ ] Verify pagination shows if > 12 products
- [ ] Click "Next" button
- [ ] Verify URL shows `?page=2`
- [ ] Verify different products display
- [ ] Verify page 2 is highlighted

#### Test 10.2: Page Numbers
- [ ] Click page number 3
- [ ] Verify URL shows `?page=3`
- [ ] Verify correct products display
- [ ] Verify page 3 is highlighted

#### Test 10.3: Previous Button
- [ ] Click "Previous" button from page 3
- [ ] Verify goes to page 2
- [ ] Verify URL updates

#### Test 10.4: Boundary Conditions
- [ ] Go to page 1
- [ ] Verify "Previous" button is disabled
- [ ] Go to last page
- [ ] Verify "Next" button is disabled

#### Test 10.5: Pagination with Filters
- [ ] Apply a filter
- [ ] Navigate to page 2
- [ ] Verify filter parameter maintained in URL
- [ ] Verify correct filtered products on page 2

#### Test 10.6: Filter Change Resets Page
- [ ] Go to page 3
- [ ] Change a filter
- [ ] Verify resets to page 1
- [ ] Verify URL shows `page=1`

**Expected Result**: Pagination works smoothly with proper boundaries and maintains filters

---

### 11. Mobile Responsiveness (5 minutes)

#### Test 11.1: Resize to Mobile
- [ ] Resize browser to mobile width (< 768px)
- [ ] Verify filter sidebar hides
- [ ] Verify "Filters" button appears
- [ ] Verify product grid adjusts to 2 columns (or 1 on small screens)

#### Test 11.2: Filter Sheet
- [ ] Click "Filters" button
- [ ] Verify filter sheet slides in from left
- [ ] Verify all filters visible in sheet
- [ ] Apply a filter
- [ ] Verify sheet closes (or stays open - check behavior)
- [ ] Verify filter applied

#### Test 11.3: Search on Mobile
- [ ] Search for a product
- [ ] Verify search bar responsive
- [ ] Verify results update correctly

#### Test 11.4: Sort on Mobile
- [ ] Open sort dropdown
- [ ] Verify dropdown works on mobile
- [ ] Select a sort option
- [ ] Verify sorting works

#### Test 11.5: Pagination on Mobile
- [ ] Navigate pages on mobile
- [ ] Verify pagination responsive
- [ ] Verify buttons sized appropriately for touch

#### Test 11.6: Header on Mobile
- [ ] Open mobile menu (hamburger)
- [ ] Verify "Shop" link appears in menu
- [ ] Click and verify navigation works

**Expected Result**: All features work perfectly on mobile with appropriate touch targets

---

### 12. URL & Browser Integration (4 minutes)

#### Test 12.1: URL Updates
- [ ] Apply various filters
- [ ] Verify URL updates for each change
- [ ] Verify URL parameters are readable

#### Test 12.2: Direct URL Access
- [ ] Copy URL with filters
- [ ] Open in new tab
- [ ] Verify filters applied correctly
- [ ] Verify same products display

#### Test 12.3: Browser Back Button
- [ ] Apply filter 1
- [ ] Apply filter 2
- [ ] Click browser back
- [ ] Verify returns to filter 1 state
- [ ] Click browser back again
- [ ] Verify returns to no filters

#### Test 12.4: Browser Forward Button
- [ ] After clicking back twice
- [ ] Click browser forward
- [ ] Verify moves forward through filter states

#### Test 12.5: Page Refresh
- [ ] Apply multiple filters
- [ ] Refresh page (F5 or Cmd+R)
- [ ] Verify filters maintained
- [ ] Verify same products display

#### Test 12.6: Shareable Links
- [ ] Apply filters
- [ ] Copy URL
- [ ] Send to another browser/device
- [ ] Open and verify same view

**Expected Result**: URL state management works flawlessly with browser features

---

### 13. Edge Cases (5 minutes)

#### Test 13.1: Empty Database
- [ ] Test with no products (if possible)
- [ ] Verify empty state displays
- [ ] Verify no errors in console

#### Test 13.2: Single Product
- [ ] Filter to show only 1 product
- [ ] Verify displays correctly
- [ ] Verify no pagination shows

#### Test 13.3: Exact 12 Products
- [ ] Filter to show exactly 12 products
- [ ] Verify no pagination shows (1 page)

#### Test 13.4: Long Product Names
- [ ] Check products with very long names
- [ ] Verify names wrap/truncate appropriately
- [ ] Verify layout doesn't break

#### Test 13.5: Special Characters in Search
- [ ] Search with special characters: !@#$%
- [ ] Verify doesn't break
- [ ] Verify no SQL injection (shouldn't match anything)

#### Test 13.6: Very Long Search Query
- [ ] Type a very long search string (100+ characters)
- [ ] Verify doesn't break
- [ ] Verify search still works

#### Test 13.7: Rapid Filter Changes
- [ ] Rapidly click different filters
- [ ] Verify UI doesn't break
- [ ] Verify final state is correct

#### Test 13.8: Invalid URL Parameters
- [ ] Manually edit URL with invalid values
- [ ] Example: `?page=-1` or `?page=9999`
- [ ] Verify app handles gracefully
- [ ] Verify no crash

**Expected Result**: App handles edge cases gracefully without errors

---

### 14. Performance (3 minutes)

#### Test 14.1: Initial Page Load
- [ ] Open `/shop` page
- [ ] Verify loads in < 2 seconds
- [ ] Check network tab for excessive requests

#### Test 14.2: Search Response Time
- [ ] Type in search
- [ ] Wait for debounce
- [ ] Verify results appear in < 500ms

#### Test 14.3: Filter Response Time
- [ ] Click a filter
- [ ] Verify products update in < 500ms
- [ ] Check for smooth transitions

#### Test 14.4: Multiple Requests
- [ ] Change filter
- [ ] Immediately change another filter
- [ ] Verify doesn't create excessive requests
- [ ] Verify proper state after all updates

**Expected Result**: Fast response times and efficient queries

---

### 15. Accessibility (4 minutes)

#### Test 15.1: Keyboard Navigation
- [ ] Tab through all filter options
- [ ] Verify focus indicators visible
- [ ] Press Enter to select filters
- [ ] Verify keyboard-only usage works

#### Test 15.2: Screen Reader (if available)
- [ ] Enable screen reader
- [ ] Navigate through filters
- [ ] Verify meaningful announcements
- [ ] Verify labels are read correctly

#### Test 15.3: Focus Management
- [ ] Open mobile filter sheet
- [ ] Verify focus trapped in sheet
- [ ] Close sheet
- [ ] Verify focus returns appropriately

#### Test 15.4: ARIA Labels
- [ ] Inspect filter elements
- [ ] Verify appropriate ARIA labels
- [ ] Verify sr-only text for icons

**Expected Result**: Fully accessible to keyboard and screen reader users

---

## 📊 Test Results Summary

After completing all tests, fill in this summary:

### ✅ Passed Tests: __ / 70

### ❌ Failed Tests:
1. [Test number and description]
2. ...

### 🐛 Bugs Found:
1. [Description and severity]
2. ...

### 💡 Improvement Suggestions:
1. ...
2. ...

---

## 🔍 Console Error Check

Throughout testing, monitor browser console for:
- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] No accessibility warnings
- [ ] No network errors

---

## 📱 Device Testing Matrix

Test on these devices if available:

| Device | Screen Size | Status |
|--------|-------------|--------|
| Desktop | 1920x1080 | [ ] |
| Laptop | 1366x768 | [ ] |
| Tablet | 768x1024 | [ ] |
| iPhone | 375x667 | [ ] |
| Android | 360x640 | [ ] |

---

## 🎯 Critical Path Test (5 minutes)

This is the most common user flow. Test this path completely:

1. [ ] User visits homepage
2. [ ] Clicks "Browse All Products"
3. [ ] Searches for "shirt"
4. [ ] Filters by category "Men's Dress Shirts"
5. [ ] Filters by brand "Polo"
6. [ ] Sorts by "Price: Low to High"
7. [ ] Clicks on a product
8. [ ] Clicks back button
9. [ ] Filters are still applied
10. [ ] Clears all filters
11. [ ] All products display

**This flow MUST work perfectly!**

---

## ✅ Sign-Off

After completing all tests:

- [ ] All critical tests passed
- [ ] No blocking bugs found
- [ ] Performance is acceptable
- [ ] Mobile experience is good
- [ ] Accessibility requirements met
- [ ] Ready for production

**Tester Name**: _______________  
**Date**: _______________  
**Status**: [ ] APPROVED / [ ] NEEDS WORK

---

**Happy Testing! 🧪**
