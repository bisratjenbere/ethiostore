-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_isPaid_createdAt_idx" ON "Order"("isPaid", "createdAt");

-- CreateIndex
CREATE INDEX "Order_userId_isPaid_idx" ON "Order"("userId", "isPaid");

-- CreateIndex
CREATE INDEX "Product_category_brand_idx" ON "Product"("category", "brand");

-- CreateIndex
CREATE INDEX "Product_category_price_idx" ON "Product"("category", "price");

-- CreateIndex
CREATE INDEX "Product_isFeatured_createdAt_idx" ON "Product"("isFeatured", "createdAt");

-- CreateIndex
CREATE INDEX "Product_stock_createdAt_idx" ON "Product"("stock", "createdAt");

-- CreateIndex
CREATE INDEX "Review_productId_createdAt_idx" ON "Review"("productId", "createdAt");
