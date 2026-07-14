import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURED_CATEGORIES } from "@/lib/constants/homepage-data";
import { ArrowRight } from "lucide-react";

const FeaturedCategories = () => {
  return (
    <section className="wrapper py-16">
      <div className="text-center mb-8">
        <h2 className="h2-bold mb-2">Shop by Category</h2>
        <p className="text-muted-foreground">
          Explore our curated collections
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURED_CATEGORIES.map((category) => (
          <Link 
            key={category.slug} 
            href={`/shop?category=${category.slug}`}
            className="group"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
              <div className="aspect-square relative overflow-hidden bg-muted">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
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
