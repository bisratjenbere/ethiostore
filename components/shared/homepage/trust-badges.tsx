import { CreditCard, Shield, Package } from "lucide-react";

const TrustBadges = () => {
  return (
    <section className="py-8 border-t bg-muted/20">
      <div className="wrapper">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Safe & Secure Shopping
          </p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Visa</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Mastercard</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">PayPal</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Apple Pay</span>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>SSL Secure</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>Free Returns</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
