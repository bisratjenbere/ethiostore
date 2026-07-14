import ProductList from "@/components/shared/product/product-list";
import HeroSection from "@/components/shared/homepage/hero-section";
import FeaturesSection from "@/components/shared/homepage/features-section";
import FeaturedCategories from "@/components/shared/homepage/featured-categories";
import SocialProof from "@/components/shared/homepage/social-proof";
import CTASection from "@/components/shared/homepage/cta-section";
import { getLatestProducts } from "@/lib/actions/product.actions";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  return (
    <div className="-mx-4 md:-mx-8">
      {/* Hero Section with CTA */}
      <HeroSection />

      {/* Features/Benefits Section */}
      <FeaturesSection />

      {/* Featured Categories Section */}
      <FeaturedCategories />

      {/* Latest Products Section */}
      <div className="wrapper py-16 bg-muted/20">
        <ProductList title="Newest Arrivals" data={latestProduct} />
      </div>

      {/* Social Proof / Testimonials Section */}
      <SocialProof />

      {/* Newsletter CTA Section */}
      <CTASection />
    </div>
  );
};

export default HomePage;
