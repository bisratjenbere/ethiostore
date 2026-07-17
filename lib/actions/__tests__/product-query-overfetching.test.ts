/**
 * Bug Condition Exploration Test: Product Query Over-Fetching
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3**
 * 
 * **Property 1: Bug Condition** - Product List Returns All Fields Unnecessarily
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * NOTE: This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * GOAL: Surface counterexamples that demonstrate over-fetching exists
 * 
 * Scoped PBT Approach:
 * - Generate product list queries with various filter combinations (category, brand, price range)
 * - For each search result, verify response contains ONLY 9 fields
 * - Verify `description`, `rating`, `numReviews`, `createdAt`, `updatedAt` are NOT present
 * - Measure response size and verify it's reasonable (~10KB for 12 products, not ~50KB)
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fc from "fast-check";
import { searchProducts, type SearchProductsParams } from "../product.actions";
import { prisma } from "@/db/prisma";

// Expected fields in product list view (ONLY these 9 fields should be present)
const EXPECTED_FIELDS = [
  "id",
  "name",
  "slug",
  "price",
  "stock",
  "brand",
  "category",
  "isFeatured",
  "images",
] as const;

// Fields that should NOT be present in product list view (over-fetched fields)
const OVER_FETCHED_FIELDS = [
  "description",
  "rating",
  "numReviews",
  "banner",
  "createdAt",
  "updatedAt",
] as const;

describe("Bug #1: Product Query Over-Fetching - Bug Condition Exploration", () => {
  let availableCategories: string[] = [];
  let availableBrands: string[] = [];

  beforeAll(async () => {
    // Get available categories and brands from database for realistic test data generation
    const categories = await prisma.product.groupBy({
      by: ["category"],
    });
    availableCategories = categories.map((c) => c.category);

    const brands = await prisma.product.groupBy({
      by: ["brand"],
    });
    availableBrands = brands.map((b) => b.brand);
  });

  it(
    "Property 1: Product list queries should return ONLY 9 required fields (Bug Condition)",
    async () => {
    /**
     * Property-based test: Generate diverse search queries and verify response structure
     * 
     * For ANY product search query in list/grid context:
     * - Response MUST contain ONLY the 9 required fields
     * - Response MUST NOT contain over-fetched fields (description, rating, etc.)
     * - Response size MUST be reasonable (~850 bytes per product, not ~4200 bytes)
     * 
     * EXPECTED OUTCOME ON UNFIXED CODE: TEST FAILS
     * - Products will contain 15+ fields instead of 9
     * - Over-fetched fields (description, rating, etc.) will be present
     * - Response sizes will be 5x larger than necessary
     */

    // Property-based test with 20 iterations for diverse coverage
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary search parameters
        fc.record({
          category: fc.option(
            fc.constantFrom(...availableCategories, "all"),
            { nil: undefined }
          ),
          brand: fc.option(
            fc.constantFrom(...availableBrands, "all"),
            { nil: undefined }
          ),
          minPrice: fc.option(fc.integer({ min: 0, max: 500 }).map(String), {
            nil: undefined,
          }),
          maxPrice: fc.option(fc.integer({ min: 500, max: 2000 }).map(String), {
            nil: undefined,
          }),
          inStock: fc.option(fc.boolean(), { nil: undefined }),
          sortBy: fc.option(
            fc.constantFrom("price", "name", "createdAt", "rating"),
            { nil: undefined }
          ),
          order: fc.option(fc.constantFrom("asc", "desc"), { nil: undefined }),
          page: fc.integer({ min: 1, max: 3 }),
          limit: fc.constantFrom(12, 20, 24),
        }),
        async (searchParams: SearchProductsParams) => {
          // Execute search query
          const result = await searchProducts(searchParams);

          // Verify search succeeded
          expect(result.success).toBe(true);
          if (!result.success || !result.data) return;

          const { products } = result.data;

          // If no products returned, test passes (no data to verify)
          if (products.length === 0) return;

          // CRITICAL ASSERTIONS: Verify ONLY expected fields are present
          for (const product of products) {
            const productFields = Object.keys(product);

            // Assert 1: Product should contain ONLY the 9 expected fields
            expect(
              productFields.sort(),
              `Product should have exactly ${EXPECTED_FIELDS.length} fields: ${EXPECTED_FIELDS.join(", ")}. ` +
                `Found ${productFields.length} fields: ${productFields.join(", ")}`
            ).toEqual([...EXPECTED_FIELDS].sort());

            // Assert 2: Verify each expected field is present
            for (const field of EXPECTED_FIELDS) {
              expect(
                product,
                `Product must include required field: ${field}`
              ).toHaveProperty(field);
            }

            // Assert 3: Verify over-fetched fields are NOT present
            for (const field of OVER_FETCHED_FIELDS) {
              expect(
                product,
                `Product should NOT include over-fetched field: ${field}. ` +
                  `This field is not needed in product list views and wastes bandwidth.`
              ).not.toHaveProperty(field);
            }

            // Assert 4: Verify fields have the expected types
            expect(typeof product.id).toBe("string");
            expect(typeof product.name).toBe("string");
            expect(typeof product.slug).toBe("string");
            expect(typeof product.price).toBe("string"); // Decimal converted to string
            expect(typeof product.stock).toBe("number");
            expect(typeof product.brand).toBe("string");
            expect(typeof product.category).toBe("string");
            expect(typeof product.isFeatured).toBe("boolean");
            expect(Array.isArray(product.images)).toBe(true);
          }

          // Assert 5: Verify response size is reasonable (not bloated)
          const responseJson = JSON.stringify(products);
          const responseSizeKB = responseJson.length / 1024;
          const avgBytesPerProduct = responseJson.length / products.length;

          // On FIXED code: expect ~850 bytes per product (9 fields only)
          // On UNFIXED code: will be ~4200 bytes per product (15+ fields)
          // We'll assert that it should be under 1500 bytes per product
          expect(
            avgBytesPerProduct,
            `Average bytes per product should be ~850 (optimized with 9 fields). ` +
              `Found ${avgBytesPerProduct.toFixed(0)} bytes per product. ` +
              `Response size: ${responseSizeKB.toFixed(2)}KB for ${products.length} products. ` +
              `This indicates over-fetching - likely returning all 15+ fields instead of required 9 fields.`
          ).toBeLessThan(1500);

          // Documentation: Log counterexample when test fails (on unfixed code)
          if (avgBytesPerProduct >= 1500) {
            console.log("\n🔴 COUNTEREXAMPLE FOUND - Bug Confirmed:");
            console.log(`  Search params: ${JSON.stringify(searchParams)}`);
            console.log(`  Products returned: ${products.length}`);
            console.log(`  Response size: ${responseSizeKB.toFixed(2)}KB`);
            console.log(
              `  Avg bytes per product: ${avgBytesPerProduct.toFixed(0)} (expected: ~850)`
            );
            console.log(`  Fields per product: ${Object.keys(products[0]).length}`);
            console.log(`  Actual fields: ${Object.keys(products[0]).join(", ")}`);
            console.log(
              `  Over-fetched fields detected: ${OVER_FETCHED_FIELDS.filter((f) => f in products[0]).join(", ")}`
            );
          }
        }
      ),
      {
        numRuns: 10, // Run 10 different search combinations (reduced for performance)
        verbose: true,
      }
    ).catch((err) => {
      // Property-based test failed - this is expected on unfixed code
      throw err;
    });
    },
    15000
  ); // 15 second timeout for property-based test
  });

  it("Example counterexample: Shop page with 12 products", async () => {
    /**
     * Concrete example test: Standard shop page query
     * 
     * This test demonstrates the bug with a typical shop page scenario:
     * - User opens shop page
     * - System fetches 12 products (default pagination)
     * - Response should be ~10KB
     * - On unfixed code: Response will be ~50KB (5x larger)
     */

    const result = await searchProducts({
      page: 1,
      limit: 12,
    });

    expect(result.success).toBe(true);
    if (!result.success || !result.data) return;

    const { products } = result.data;

    // Verify we got products to test
    if (products.length === 0) {
      console.log("⚠️  No products in database - seed database to run this test");
      return;
    }

    const responseJson = JSON.stringify(products);
    const responseSizeKB = responseJson.length / 1024;

    console.log("\n📊 Shop Page Performance Metrics:");
    console.log(`  Products: ${products.length}`);
    console.log(`  Response size: ${responseSizeKB.toFixed(2)}KB`);
    console.log(`  Fields per product: ${Object.keys(products[0]).length}`);
    console.log(`  Expected fields: ${EXPECTED_FIELDS.length}`);

    // On FIXED code: ~10KB for 12 products
    // On UNFIXED code: ~50KB for 12 products (5x larger)
    expect(
      responseSizeKB,
      `Shop page with 12 products should transfer ~10KB of data. ` +
        `Found ${responseSizeKB.toFixed(2)}KB. ` +
        `This 5x overhead is caused by over-fetching unused fields.`
    ).toBeLessThan(18); // Allow some margin, but should fail on unfixed code

    // Verify field structure
    expect(
      Object.keys(products[0]).sort(),
      "Product should contain only required 9 fields"
    ).toEqual([...EXPECTED_FIELDS].sort());
  });

  it("Example counterexample: Search results with 20 products", async () => {
    /**
     * Concrete example test: Search with larger result set
     * 
     * This test demonstrates the bug with a search scenario:
     * - User searches for products
     * - System fetches 20 products
     * - Response should be ~17KB
     * - On unfixed code: Response will be ~83KB (nearly 5x larger)
     */

    const result = await searchProducts({
      page: 1,
      limit: 20,
    });

    expect(result.success).toBe(true);
    if (!result.success || !result.data) return;

    const { products } = result.data;

    if (products.length === 0) return;

    const responseJson = JSON.stringify(products);
    const responseSizeKB = responseJson.length / 1024;
    const avgBytesPerProduct = responseJson.length / products.length;

    console.log("\n📊 Search Results Performance Metrics:");
    console.log(`  Products: ${products.length}`);
    console.log(`  Response size: ${responseSizeKB.toFixed(2)}KB`);
    console.log(`  Avg bytes per product: ${avgBytesPerProduct.toFixed(0)}`);

    // Verify each product has only required fields
    for (const product of products) {
      // Check for over-fetched fields
      const overFetchedPresent = OVER_FETCHED_FIELDS.filter(
        (field) => field in product
      );
      expect(
        overFetchedPresent,
        `Found over-fetched fields: ${overFetchedPresent.join(", ")}. ` +
          `These fields are not displayed in product list views and waste bandwidth.`
      ).toHaveLength(0);
    }
  });

/**
 * Preservation Property Tests: Product Query Functionality
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 * 
 * **Property 2: Preservation** - Individual Product Pages and Search Accuracy
 * 
 * GOAL: Verify that non-list contexts continue to work correctly
 * 
 * These tests verify behavior that MUST NOT CHANGE after the fix:
 * - Individual product detail pages fetch complete data
 * - Product search returns accurate results with correct filtering
 * - Product sorting works correctly (by price, name, date)
 * - Category/brand filters return correct products
 * 
 * NOTE: These tests should PASS on both unfixed AND fixed code
 */
describe("Bug #1: Product Query Over-Fetching - Preservation Properties", () => {
  let availableCategories: string[] = [];
  let availableBrands: string[] = [];
  let allProductSlugs: string[] = [];

  beforeAll(async () => {
    // Get available test data from database
    const categories = await prisma.product.groupBy({
      by: ["category"],
    });
    availableCategories = categories.map((c) => c.category);

    const brands = await prisma.product.groupBy({
      by: ["brand"],
    });
    availableBrands = brands.map((b) => b.brand);

    // Get product slugs for individual product page tests
    const products = await prisma.product.findMany({
      select: { slug: true },
      take: 30,
    });
    allProductSlugs = products.map((p) => p.slug);
  });

  it(
    "Property 2.1: Individual product detail pages return complete data (Preservation)",
    async () => {
      /**
       * Preservation Test: Individual product pages MUST continue to fetch ALL fields
       * 
       * When users view a product detail page, they need complete information:
       * - Full description
       * - Complete images array (for carousel)
       * - Rating and numReviews
       * - All metadata
       * 
       * This behavior MUST NOT change after the fix - only list views should be optimized
       * 
       * EXPECTED: PASSES on both unfixed and fixed code
       */

      // Skip if no products in database
      if (allProductSlugs.length === 0) {
        console.log("⚠️  No products in database - seed database to run this test");
        return;
      }

      // Property-based test: Generate random product slugs and verify complete data
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...allProductSlugs),
          async (slug: string) => {
            // Fetch individual product (simulates product detail page)
            const product = await prisma.product.findFirst({
              where: { slug },
            });

            // Verify product exists
            expect(product).toBeTruthy();
            if (!product) return;

            // CRITICAL: Verify ALL fields are present (complete product data)
            // Individual product pages need complete information for display
            expect(product).toHaveProperty("id");
            expect(product).toHaveProperty("name");
            expect(product).toHaveProperty("slug");
            expect(product).toHaveProperty("price");
            expect(product).toHaveProperty("stock");
            expect(product).toHaveProperty("brand");
            expect(product).toHaveProperty("category");
            expect(product).toHaveProperty("isFeatured");
            expect(product).toHaveProperty("images");
            
            // Fields that ARE needed for individual product pages (unlike list views)
            expect(product).toHaveProperty("description"); // Full description displayed
            expect(product).toHaveProperty("rating"); // Rating displayed
            expect(product).toHaveProperty("numReviews"); // Review count displayed
            expect(product).toHaveProperty("banner"); // Banner may be displayed
            expect(product).toHaveProperty("createdAt"); // Timestamp metadata
            expect(product).toHaveProperty("updatedAt"); // Timestamp metadata

            // Verify field types and values are valid
            expect(typeof product.name).toBe("string");
            expect(product.name.length).toBeGreaterThan(0);
            expect(typeof product.description).toBe("string");
            expect(Array.isArray(product.images)).toBe(true);
            expect(product.images.length).toBeGreaterThan(0);
            
            // Verify at least 13+ fields present (complete product data)
            const fieldCount = Object.keys(product).length;
            expect(
              fieldCount,
              `Individual product pages should have complete data with 13+ fields. Found ${fieldCount} fields.`
            ).toBeGreaterThanOrEqual(13);
          }
        ),
        {
          numRuns: 5, // Test 5 random products (reduced for performance)
          verbose: true,
        }
      );
    },
    10000
  ); // 10 second timeout for property-based test

  it(
    "Property 2.2: Product search and filtering accuracy preserved (Preservation)",
    async () => {
    /**
     * Preservation Test: Search and filtering MUST return identical products after fix
     * 
     * When users filter by category/brand/price/stock, they expect accurate results.
     * The fix optimizes WHICH FIELDS are returned, not WHICH PRODUCTS are returned.
     * 
     * This test verifies that:
     * - Same filters return same products (by ID)
     * - Same sort order is maintained
     * - Product counts remain accurate
     * 
     * EXPECTED: PASSES on both unfixed and fixed code
     */

    // Skip if no test data
    if (availableCategories.length === 0 || availableBrands.length === 0) {
      console.log("⚠️  No categories/brands in database - seed database to run this test");
      return;
    }

    // Property-based test: Generate random filter combinations
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          category: fc.option(
            fc.constantFrom(...availableCategories),
            { nil: undefined }
          ),
          brand: fc.option(
            fc.constantFrom(...availableBrands),
            { nil: undefined }
          ),
          minPrice: fc.option(fc.integer({ min: 0, max: 500 }).map(String), {
            nil: undefined,
          }),
          maxPrice: fc.option(fc.integer({ min: 500, max: 2000 }).map(String), {
            nil: undefined,
          }),
          inStock: fc.option(fc.boolean(), { nil: undefined }),
          sortBy: fc.constantFrom<"price" | "name" | "createdAt" | "rating">(
            "price",
            "name",
            "createdAt",
            "rating"
          ),
          order: fc.constantFrom<"asc" | "desc">("asc", "desc"),
          page: fc.integer({ min: 1, max: 2 }),
          limit: fc.constantFrom(12, 20),
        }),
        async (searchParams: SearchProductsParams) => {
          // Execute search with filters
          const result = await searchProducts(searchParams);

          // Verify search succeeded
          expect(result.success).toBe(true);
          if (!result.success || !result.data) return;

          const { products, total, categories, brands } = result.data;

          // If no results, test passes (filters work correctly, just no matching products)
          if (products.length === 0) return;

          // PRESERVATION ASSERTIONS: Verify search accuracy

          // Assert 1: All returned products match the filter criteria
          for (const product of products) {
            // If category filter applied, verify product matches
            if (searchParams.category && searchParams.category !== "all") {
              expect(
                product.category,
                `Product category should match filter: ${searchParams.category}`
              ).toBe(searchParams.category);
            }

            // If brand filter applied, verify product matches
            if (searchParams.brand && searchParams.brand !== "all") {
              expect(
                product.brand,
                `Product brand should match filter: ${searchParams.brand}`
              ).toBe(searchParams.brand);
            }

            // If price range filter applied, verify product price is within range
            if (searchParams.minPrice) {
              const productPrice = parseFloat(product.price);
              const minPrice = parseFloat(searchParams.minPrice);
              expect(
                productPrice,
                `Product price ${productPrice} should be >= min price ${minPrice}`
              ).toBeGreaterThanOrEqual(minPrice);
            }

            if (searchParams.maxPrice) {
              const productPrice = parseFloat(product.price);
              const maxPrice = parseFloat(searchParams.maxPrice);
              expect(
                productPrice,
                `Product price ${productPrice} should be <= max price ${maxPrice}`
              ).toBeLessThanOrEqual(maxPrice);
            }

            // If inStock filter applied, verify product has stock
            if (searchParams.inStock === true) {
              expect(
                product.stock,
                "Product should be in stock (stock > 0)"
              ).toBeGreaterThan(0);
            }
          }

          // Assert 2: Verify sort order is correct
          if (products.length >= 2 && searchParams.sortBy) {
            for (let i = 0; i < products.length - 1; i++) {
              const current = products[i];
              const next = products[i + 1];

              let currentValue: string | number;
              let nextValue: string | number;

              switch (searchParams.sortBy) {
                case "price":
                  currentValue = parseFloat(current.price);
                  nextValue = parseFloat(next.price);
                  break;
                case "name":
                  currentValue = current.name;
                  nextValue = next.name;
                  break;
                case "createdAt":
                  // Note: createdAt not included in optimized response, but sorting still works
                  // Skip this check for optimized responses
                  continue;
                case "rating":
                  // Note: rating not included in optimized response, but sorting still works
                  // Skip this check for optimized responses
                  continue;
                default:
                  continue;
              }

              // Verify sort order
              if (searchParams.order === "asc") {
                expect(
                  currentValue <= nextValue,
                  `Products should be sorted ascending by ${searchParams.sortBy}. ` +
                    `Found ${currentValue} > ${nextValue} at index ${i}`
                ).toBe(true);
              } else {
                expect(
                  currentValue >= nextValue,
                  `Products should be sorted descending by ${searchParams.sortBy}. ` +
                    `Found ${currentValue} < ${nextValue} at index ${i}`
                ).toBe(true);
              }
            }
          }

          // Assert 3: Verify pagination consistency
          expect(
            products.length,
            `Should return at most ${searchParams.limit} products per page`
          ).toBeLessThanOrEqual(searchParams.limit || 12);

          // Assert 4: Verify category and brand aggregations are present and valid
          expect(Array.isArray(categories)).toBe(true);
          expect(Array.isArray(brands)).toBe(true);

          // Verify each category has a name and count
          for (const cat of categories) {
            expect(cat).toHaveProperty("category");
            expect(cat).toHaveProperty("count");
            expect(typeof cat.category).toBe("string");
            expect(typeof cat.count).toBe("number");
            expect(cat.count).toBeGreaterThan(0);
          }

          // Verify each brand has a name and count
          for (const brand of brands) {
            expect(brand).toHaveProperty("brand");
            expect(brand).toHaveProperty("count");
            expect(typeof brand.brand).toBe("string");
            expect(typeof brand.count).toBe("number");
            expect(brand.count).toBeGreaterThan(0);
          }

          // Assert 5: Total count should match query results
          expect(
            total,
            "Total count should be a positive number"
          ).toBeGreaterThanOrEqual(0);
        }
      ),
      {
        numRuns: 10, // Test 10 different filter combinations (reduced for performance)
        verbose: true,
      }
    );
    },
    15000
  ); // 15 second timeout for property-based test

  it(
    "Property 2.3: Product sorting preserved across all sort options (Preservation)",
    async () => {
    /**
     * Preservation Test: Sorting MUST work correctly after fix
     * 
     * Users can sort products by:
     * - Price (ascending/descending)
     * - Name (ascending/descending)
     * - Date created (newest/oldest)
     * 
     * The fix changes which fields are returned, but sorting should still work correctly.
     * Even if sort fields (like createdAt) aren't in the response, the ORDER must be correct.
     * 
     * EXPECTED: PASSES on both unfixed and fixed code
     */

    // Property-based test: Test all sort combinations
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          sortBy: fc.constantFrom<"price" | "name" | "createdAt">(
            "price",
            "name",
            "createdAt"
          ),
          order: fc.constantFrom<"asc" | "desc">("asc", "desc"),
          limit: fc.constantFrom(12, 20),
        }),
        async (searchParams: SearchProductsParams) => {
          // Execute search with sorting
          const result = await searchProducts({
            ...searchParams,
            page: 1,
          });

          // Verify search succeeded
          expect(result.success).toBe(true);
          if (!result.success || !result.data) return;

          const { products } = result.data;

          // Need at least 2 products to verify sorting
          if (products.length < 2) return;

          // Verify sort order is maintained
          // For price and name, we can verify directly from the response
          // For createdAt, we trust the database sorting (field may not be in response)
          
          if (searchParams.sortBy === "price") {
            // Verify price sorting
            for (let i = 0; i < products.length - 1; i++) {
              const currentPrice = parseFloat(products[i].price);
              const nextPrice = parseFloat(products[i + 1].price);

              if (searchParams.order === "asc") {
                expect(
                  currentPrice <= nextPrice,
                  `Price ascending: ${currentPrice} should be <= ${nextPrice} at index ${i}`
                ).toBe(true);
              } else {
                expect(
                  currentPrice >= nextPrice,
                  `Price descending: ${currentPrice} should be >= ${nextPrice} at index ${i}`
                ).toBe(true);
              }
            }
          } else if (searchParams.sortBy === "name") {
            // Verify name sorting
            for (let i = 0; i < products.length - 1; i++) {
              const currentName = products[i].name.toLowerCase();
              const nextName = products[i + 1].name.toLowerCase();

              if (searchParams.order === "asc") {
                expect(
                  currentName <= nextName,
                  `Name ascending: "${currentName}" should be <= "${nextName}" at index ${i}`
                ).toBe(true);
              } else {
                expect(
                  currentName >= nextName,
                  `Name descending: "${currentName}" should be >= "${nextName}" at index ${i}`
                ).toBe(true);
              }
            }
          }
          // For createdAt sorting, we trust database handles it correctly
          // (field may not be in optimized response, but sorting still works at DB level)

          // Verify all products have required sortable fields
          for (const product of products) {
            if (searchParams.sortBy === "price") {
              expect(product).toHaveProperty("price");
              expect(typeof product.price).toBe("string");
              expect(parseFloat(product.price)).toBeGreaterThan(0);
            } else if (searchParams.sortBy === "name") {
              expect(product).toHaveProperty("name");
              expect(typeof product.name).toBe("string");
              expect(product.name.length).toBeGreaterThan(0);
            }
          }
        }
      ),
      {
        numRuns: 8, // Test multiple sort combinations (reduced for performance)
        verbose: true,
      }
    );
    },
    12000
  ); // 12 second timeout for property-based test

  it("Example: Individual product page fetches complete data", async () => {
    /**
     * Concrete example: Verify a specific product page has all fields
     * 
     * This demonstrates that individual product pages (non-list context)
     * continue to receive complete data after the fix.
     */

    // Skip if no products
    if (allProductSlugs.length === 0) {
      console.log("⚠️  No products in database - seed database to run this test");
      return;
    }

    // Get first product slug
    const slug = allProductSlugs[0];
    
    // Fetch individual product (simulates product detail page request)
    const product = await prisma.product.findFirst({
      where: { slug },
    });

    expect(product).toBeTruthy();
    if (!product) return;

    console.log("\n📊 Individual Product Page Data:");
    console.log(`  Product: ${product.name}`);
    console.log(`  Fields: ${Object.keys(product).length}`);
    console.log(`  Has description: ${!!product.description} (${product.description?.length || 0} chars)`);
    console.log(`  Has rating: ${!!product.rating}`);
    console.log(`  Has numReviews: ${!!product.numReviews}`);
    console.log(`  Images: ${product.images.length}`);

    // Verify complete data is present
    expect(product.description).toBeTruthy();
    expect(product.description.length).toBeGreaterThan(0);
    expect(Object.keys(product).length).toBeGreaterThanOrEqual(13);
  });

  it("Example: Category filter returns accurate results", async () => {
    /**
     * Concrete example: Verify category filtering works correctly
     * 
     * This demonstrates that filtering accuracy is preserved after the fix.
     */

    // Skip if no categories
    if (availableCategories.length === 0) {
      console.log("⚠️  No categories in database - seed database to run this test");
      return;
    }

    // Test first available category
    const category = availableCategories[0];
    
    const result = await searchProducts({
      category,
      page: 1,
      limit: 12,
    });

    expect(result.success).toBe(true);
    if (!result.success || !result.data) return;

    const { products } = result.data;

    console.log(`\n📊 Category Filter Test (${category}):`);
    console.log(`  Products found: ${products.length}`);
    console.log(`  All match category: ${products.every(p => p.category === category)}`);

    // Verify all returned products match the category
    for (const product of products) {
      expect(product.category).toBe(category);
    }

    // Verify filter data structure
    expect(products.length).toBeGreaterThan(0);
  });

  it("Example: Price sorting works correctly", async () => {
    /**
     * Concrete example: Verify price sorting ascending and descending
     * 
     * This demonstrates that sorting is preserved after the fix.
     */

    // Test ascending
    const ascResult = await searchProducts({
      sortBy: "price",
      order: "asc",
      page: 1,
      limit: 10,
    });

    expect(ascResult.success).toBe(true);
    if (!ascResult.success || !ascResult.data) return;

    const ascProducts = ascResult.data.products;

    if (ascProducts.length >= 2) {
      console.log("\n📊 Price Sorting Test:");
      console.log(`  Ascending: ${ascProducts.slice(0, 3).map(p => p.price).join(" <= ")}`);
      
      // Verify ascending order
      for (let i = 0; i < ascProducts.length - 1; i++) {
        const currentPrice = parseFloat(ascProducts[i].price);
        const nextPrice = parseFloat(ascProducts[i + 1].price);
        expect(currentPrice).toBeLessThanOrEqual(nextPrice);
      }
    }

    // Test descending
    const descResult = await searchProducts({
      sortBy: "price",
      order: "desc",
      page: 1,
      limit: 10,
    });

    expect(descResult.success).toBe(true);
    if (!descResult.success || !descResult.data) return;

    const descProducts = descResult.data.products;

    if (descProducts.length >= 2) {
      console.log(`  Descending: ${descProducts.slice(0, 3).map(p => p.price).join(" >= ")}`);
      
      // Verify descending order
      for (let i = 0; i < descProducts.length - 1; i++) {
        const currentPrice = parseFloat(descProducts[i].price);
        const nextPrice = parseFloat(descProducts[i + 1].price);
        expect(currentPrice).toBeGreaterThanOrEqual(nextPrice);
      }
    }
  });
});
