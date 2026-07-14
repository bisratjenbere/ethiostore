# Product Search & Filtering - Quick Start Guide

## 🚀 Getting Started

This guide will help you implement the Product Search & Filtering feature step by step.

---

## 📚 Required Reading

Before starting, read these documents in order:

1. **Requirements** (`.kiro/specs/product-search-filter/requirements.md`)
   - Understand what we're building
   - Review feature requirements
   - Check UI/UX designs

2. **Design** (`.kiro/specs/product-search-filter/design.md`)
   - Understand technical architecture
   - Review component structure
   - Study data flow

3. **Tasks** (`.kiro/specs/product-search-filter/tasks.md`)
   - See detailed implementation tasks
   - Understand dependencies
   - Plan your work

4. **Project Patterns** (`.kiro/steering/`)
   - `coding-standards.md` - Code patterns
   - `component-patterns.md` - React patterns
   - `database-patterns.md` - Prisma patterns

---

## 🎯 Implementation Strategy

### Recommended Approach: **Incremental Development**

Build the feature in phases, testing each phase before moving to the next:

```
Phase 1: Backend
   ↓
Phase 2: Basic Shop Page
   ↓
Phase 3: Search
   ↓
Phase 4: Filters
   ↓
Phase 5: Polish
```

---

## 🔨 Step-by-Step Implementation

### Step 1: Backend Setup (2-3 hours)

**Goal**: Create the server actions that power search/filter

**Tasks**:
1. Open `lib/actions/product.actions.ts`
2. Add these functions:
   - `searchProducts(params)` - Main search/filter
   - `getAllCategories()` - Get category list
   - `getAllBrands()` - Get brand list
   
**Test**: Use Prisma Studio or create a test page to verify queries work

**Success Criteria**:
- Can search products by name
- Can filter by category and brand
- Can sort results
- Returns correct data structure

---

### Step 2: Create Shop Page (1-2 hours)

**Goal**: Create the main product listing page

**Tasks**:
1. Create `app/(root)/shop/page.tsx`
2. Parse URL search parameters
3. Call `searchProducts()` with params
4. Display products in grid
5. Handle loading and error states

**Test**: Navigate to `/shop` and verify products display

**Success Criteria**:
- Products display in grid
- Can access via URL
- Loading state shows
- Error state works

---

### Step 3: Add Search (1 hour)

**Goal**: Let users search for products

**Tasks**:
1. Create `components/shared/product/search-bar.tsx`
2. Add debounced input (500ms)
3. Update URL with search query
4. Add clear button

**Test**: Type in search bar and verify URL updates after 500ms

**Success Criteria**:
- Search updates URL
- Results filter based on search
- Clear button works
- Debouncing prevents excessive queries

---

### Step 4: Add Filters (3-4 hours)

**Goal**: Let users filter products

**Tasks**:
1. Create filter wrapper: `product-filters.tsx`
2. Create category filter: `category-filter.tsx`
3. Create brand filter: `brand-filter.tsx`
4. Create price range filter: `price-range-filter.tsx`
5. Create stock filter: `stock-filter.tsx`
6. Create mobile filter sheet: `product-filters-mobile.tsx`

**Test**: Click each filter and verify:
- URL updates
- Products re-filter
- Filter state shows in UI

**Success Criteria**:
- All filters work
- Mobile sheet works
- Multiple filters combine correctly
- URL reflects all active filters

---

### Step 5: Add Sorting (1 hour)

**Goal**: Let users sort results

**Tasks**:
1. Create `components/shared/product/product-sort.tsx`
2. Add dropdown with sort options
3. Update URL on selection

**Test**: Select different sort options and verify order changes

**Success Criteria**:
- Sorting changes product order
- Current sort shows in UI
- URL updates correctly

---

### Step 6: Add Active Filters Display (1 hour)

**Goal**: Show active filters with ability to remove

**Tasks**:
1. Create `components/shared/product/active-filters.tsx`
2. Display badges for active filters
3. Add remove button per filter
4. Add "Clear All" button

**Test**: Apply filters and verify badges appear with working remove buttons

**Success Criteria**:
- Active filters display as badges
- Can remove individual filters
- Can clear all filters
- Updates URL correctly

---

### Step 7: Add Pagination (1.5 hours)

**Goal**: Split results into pages

**Tasks**:
1. Create `components/shared/pagination.tsx`
2. Add page buttons
3. Add previous/next navigation
4. Update URL on page change

**Test**: Navigate through pages and verify products change

**Success Criteria**:
- Page numbers display
- Previous/Next work
- Page parameter in URL
- Disabled at boundaries

---

### Step 8: Polish & Test (3-4 hours)

**Goal**: Improve UX and fix issues

**Tasks**:
1. Add loading skeletons
2. Add empty states
3. Improve mobile responsiveness
4. Add accessibility features
5. Test all combinations
6. Fix any bugs

**Test**: Full manual testing of all features

**Success Criteria**:
- Works on all devices
- No bugs found
- Good loading/empty states
- Accessible

---

## 🧪 Testing Checklist

After each step, test these scenarios:

### Basic Functionality
- [ ] Products display on `/shop` page
- [ ] Search updates results
- [ ] Each filter works individually
- [ ] Sorting changes order
- [ ] Pagination works

### Combined Functionality  
- [ ] Search + filters work together
- [ ] Multiple filters combine correctly
- [ ] Sorting works with filters
- [ ] Pagination works with filters
- [ ] Active filters display correctly

### URL & Navigation
- [ ] URL parameters update correctly
- [ ] Shareable URLs work (copy/paste)
- [ ] Browser back/forward work
- [ ] Page refresh maintains filters

### Edge Cases
- [ ] Empty search results
- [ ] No products match filters
- [ ] Very long search query
- [ ] Invalid URL parameters
- [ ] First/last page boundaries

### Responsive Design
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Filter sheet works on mobile
- [ ] Touch targets are adequate

### Performance
- [ ] Page loads in < 2 seconds
- [ ] Search responds in < 500ms
- [ ] Filter changes in < 500ms
- [ ] No console errors
- [ ] No excessive re-renders

---

## 🐛 Common Issues & Solutions

### Issue: Search doesn't update
**Solution**: Check debounce implementation and useEffect dependencies

### Issue: Filters don't combine
**Solution**: Verify `AND` logic in Prisma where clause

### Issue: URL doesn't update
**Solution**: Check router.push() and URLSearchParams usage

### Issue: Slow queries
**Solution**: Verify database indexes exist and are being used

### Issue: Mobile filters don't work
**Solution**: Check Sheet component z-index and mobile breakpoints

### Issue: Empty state always shows
**Solution**: Check products array length and conditional rendering

---

## 📦 Required Dependencies

Most dependencies are already in the project. You may need:

```bash
# Check if these are installed
npm list react-hook-form zod @hookform/resolvers
npm list lucide-react
npm list sonner

# If shadcn UI components are missing:
npx shadcn-ui@latest add select
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
```

---

## 🎨 UI Components Checklist

Verify you have these shadcn/ui components:

- [x] Button
- [x] Input
- [x] Card
- [x] Badge
- [ ] Select (may need to add)
- [ ] Sheet (may need to add)
- [ ] Skeleton (may need to add)
- [x] Checkbox

**To add missing components**:
```bash
npx shadcn-ui@latest add select sheet skeleton
```

---

## 📊 Expected File Structure After Implementation

```
app/
└── (root)/
    └── shop/
        └── page.tsx                    # Main shop page

components/
└── shared/
    └── product/
        ├── search-bar.tsx              # Search input
        ├── product-filters.tsx         # Filter sidebar
        ├── product-filters-mobile.tsx  # Mobile filter sheet
        ├── category-filter.tsx         # Category filter
        ├── brand-filter.tsx            # Brand filter
        ├── price-range-filter.tsx      # Price range filter
        ├── stock-filter.tsx            # Stock filter
        ├── active-filters.tsx          # Active filter badges
        ├── product-sort.tsx            # Sort dropdown
        ├── filter-item.tsx             # Reusable filter item
        └── product-list.tsx            # (existing, may modify)

components/
└── shared/
    └── pagination.tsx                  # Pagination component

lib/
└── actions/
    └── product.actions.ts              # (extend existing file)
```

---

## 💡 Pro Tips

1. **Start with backend** - Get data flowing before building UI
2. **Test incrementally** - Don't build everything then test
3. **Use existing patterns** - Follow patterns from admin panel
4. **Mobile first** - Build mobile filter sheet first
5. **Log URL params** - Console.log searchParams to debug
6. **Check database** - Use Prisma Studio to verify queries
7. **Reuse components** - DRY principle for filters
8. **Handle edge cases** - Empty states, no results, etc.
9. **Test on real devices** - Emulators don't catch everything
10. **Ask for help** - If stuck for >30 minutes, take a break

---

## 🎓 Learning Resources

### Relevant Next.js Docs
- [Search Params](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)
- [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)

### Relevant Prisma Docs
- [Filtering](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)
- [Grouping](https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing)

### shadcn/ui Components
- [Select](https://ui.shadcn.com/docs/components/select)
- [Sheet](https://ui.shadcn.com/docs/components/sheet)
- [Badge](https://ui.shadcn.com/docs/components/badge)

---

## 🚦 Ready to Start?

### Before You Begin:
1. ✅ Read all spec documents
2. ✅ Understand the architecture
3. ✅ Set up development environment
4. ✅ Familiarize with existing codebase
5. ✅ Review project patterns

### First Task:
**Start with Phase 1, Task 1.1**: Implement `searchProducts()` in `lib/actions/product.actions.ts`

### Questions to Answer Before Starting:
- Do you understand how URL parameters work in Next.js?
- Do you know how to build Prisma where clauses?
- Have you reviewed similar code in the project (admin filters)?
- Do you have a testing plan?

---

## 📞 Need Help?

If you get stuck:

1. **Check existing code** - Look at admin panel filters for reference
2. **Review patterns** - Check `.kiro/steering/` for guidance
3. **Test incrementally** - Don't build too much without testing
4. **Read error messages** - They usually tell you what's wrong
5. **Use console.log** - Debug data flow
6. **Check Prisma Studio** - Verify database state

---

## ✅ Definition of Done

The feature is complete when:

- [ ] All tasks in tasks.md are checked off
- [ ] All tests in this guide pass
- [ ] Code follows project patterns
- [ ] Works on mobile and desktop
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Documentation is updated
- [ ] Code is committed

---

**Good luck with the implementation! 🚀**

*Remember: Build incrementally, test often, and follow existing patterns.*
