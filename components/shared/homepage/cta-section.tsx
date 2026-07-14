import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section className="wrapper py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-accent p-8 md:p-12 lg:p-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
            <Mail className="h-4 w-4" />
            Newsletter
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Get 10% Off Your First Order
          </h2>
          
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join our newsletter for exclusive deals, new arrivals, and style tips. 
            Plus get 10% off your first purchase!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-80 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button size="lg" variant="secondary" className="shrink-0">
                Subscribe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-white/70">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
