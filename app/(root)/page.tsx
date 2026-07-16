import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Truck, Shield, Headphones, ArrowRight } from "lucide-react";

// NEW: Import homepage components
import FeaturedCategories from "@/components/shared/homepage/featured-categories";
import SocialProof from "@/components/shared/homepage/social-proof";
import NewsletterSignup from "@/components/shared/homepage/newsletter-signup";
import TrustBadges from "@/components/shared/homepage/trust-badges";

export const metadata = {
  title: "Home",
};

// ✅ ENABLE ISR: Revalidate homepage every 60 seconds
// This enables static generation with automatic updates
export const revalidate = 60;

const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  
  return (
    <>
      <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20">
          <div className="wrapper">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="h1-bold text-balance">
                Discover Premium Products for Your Lifestyle
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                Shop our curated collection of high-quality products with free shipping on orders over 3000 Birr
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild className="group">
                  <Link href="/shop">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/shop">View All</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* NEW: Featured Categories */}
        <FeaturedCategories />
        
        {/* Value Propositions */}
        <section className="bg-muted/30 py-8 md:py-12">
          <div className="wrapper">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    On orders over 3000 Birr
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    100% secure transactions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Dedicated customer service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Latest Products */}
        <section className="wrapper">
          <ProductList title="Newest Arrivals" data={latestProduct} />
          
          <div className="flex justify-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">Browse All Products</Link>
            </Button>
          </div>
        </section>

        {/* NEW: Social Proof */}
        <SocialProof />

        {/* NEW: Newsletter Signup */}
        <NewsletterSignup />

        {/* NEW: Trust Badges */}
        <TrustBadges />
      </div>
    </>
  );
};

export default HomePage;
