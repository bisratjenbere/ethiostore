# Currency Update: USD → Ethiopian Birr (ETB)

## Changes Made

All currency displays across the application have been updated from US Dollars ($) to Ethiopian Birr.

### Files Modified

#### 1. `lib/utils.ts`
- **Changed**: `CURRENCY_FORMATTER` locale and currency
- **From**: `"am-ET"` locale with `"ETB"` currency
- **To**: `"en-ET"` locale with explicit "Birr" text replacement
- **Result**: All currency values now display as "Birr X.XX" instead of "$ X.XX"

```typescript
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-ET", {
  currency: "ETB",
  style: "currency",
  minimumFractionDigits: 2,
});

export function FormatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount).replace('ETB', 'Birr');
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount)).replace('ETB', 'Birr');
  } else {
    return "NaN";
  }
}
```

#### 2. `components/shared/product/product-price.tsx`
- **Changed**: Currency symbol in ProductPrice component
- **From**: `$` (dollar sign)
- **To**: `Birr ` (Ethiopian Birr with space)
- **Affects**: Product cards on home page, shop page, product detail pages

```typescript
<span className="text-xs align-super">Birr </span>
```

#### 3. `lib/actions/stripe.actions.ts`
- **Changed**: Stripe payment currency
- **From**: `currency: "usd"`
- **To**: `currency: "etb"` (Ethiopian Birr)
- **Affects**: All Stripe checkout sessions for product items, shipping, and tax
- **Note**: Prices are still calculated in minor units (cents/santim) as per Stripe requirements

### Where Currency is Now Displayed as "Birr"

✅ **Home Page**
- Featured products
- Latest products
- Product pricing

✅ **Shop Page**
- All product listings
- Product cards
- Price filters

✅ **Product Detail Page**
- Product price display
- Cart addition

✅ **Cart Page**
- Item prices
- Items price total
- Shipping cost
- Tax amount
- Total price

✅ **Checkout Pages**
- Shipping address summary
- Payment method summary
- Order review

✅ **Order Pages**
- Order confirmation
- Order history
- Order details
- Admin order management

✅ **Stripe Checkout**
- Payment line items
- Total amount
- Receipt emails

### Components Using FormatCurrency

The `FormatCurrency` utility function is used throughout the application:
- Cart totals
- Order summaries
- Admin dashboards
- Order confirmation emails
- Receipt displays

### Important Notes

#### Stripe Payment Processing
- Stripe now processes payments in Ethiopian Birr (ETB)
- Prices are automatically converted to minor units (santim = cents)
- Example: 100 Birr = 10,000 santim in Stripe

#### Testing Stripe with ETB
When testing Stripe payments with Ethiopian Birr:
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Amounts will be charged in ETB instead of USD

#### Display Format
- **Before**: $123.45
- **After**: Birr 123.45

### Verification Checklist

- [x] Product prices show "Birr" on home page
- [x] Product prices show "Birr" on shop page
- [x] Product detail page shows "Birr"
- [x] Cart totals show "Birr"
- [x] Order summaries show "Birr"
- [x] Stripe checkout uses ETB currency
- [x] No remaining "$" symbols in price displays

## No Database Changes Required

All prices in the database remain as numeric values (Decimal). Only the display formatting has changed. This means:
- ✅ No migration needed
- ✅ No data conversion required
- ✅ Existing orders remain valid
- ✅ Backward compatible

## Environment Variables

No changes required to `.env` file for currency settings.

## Future Considerations

If you need to support multiple currencies in the future:
1. Add a `CURRENCY` environment variable
2. Update `FormatCurrency` to use dynamic currency
3. Update Stripe integration to use dynamic currency
4. Consider exchange rate handling for international sales
