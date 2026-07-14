import { Card, CardContent } from "@/components/ui/card";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $100",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment protection",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Easy returns within 30 days",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer support team",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
];

const FeaturesSection = () => {
  return (
    <section className="wrapper py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="border-none shadow-none hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-3">
                <div className={`w-14 h-14 mx-auto rounded-full ${feature.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-base">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
