import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURED_CATEGORIES } from "@/lib/constants/homepage-data";
import { ArrowRight } from "lucide-react";

const FeaturedCategories = () => {
  return (
    <section className="wrapper py-16 md:py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Shop by Category</h2>
        <p className="text-lg text-muted-foreground">
          Explore our curated collections and find what you love
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {FEATURED_CATEGORIES.map((category) => (
          <Link 
            key={category.slug} 
            href={`/shop?category=${category.slug}`}
            className="group"
          >
            <Card className="overflow-hidden border-2 hover:border-primary hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <CardContent className="p-4 md:p-5 text-center bg-gradient-to-b from-background to-muted/30">
                <h3 className="font-bold text-base md:text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 group-hover:text-primary transition-colors">
                  {category.description}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
