import { Shield, Lock } from "lucide-react";

/**
 * Visual indicator that payment is processed securely through Stripe
 */
export function StripeBadge() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
      <Shield className="h-3 w-3" />
      <span>Secured by Stripe</span>
      <Lock className="h-3 w-3" />
    </div>
  );
}

/**
 * Informational card about Stripe payment security
 */
export function StripePaymentInfo() {
  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-500" />
        <h4 className="font-semibold text-sm">Secure Payment</h4>
      </div>
      <p className="text-xs text-muted-foreground">
        Your payment information is encrypted and processed securely by Stripe.
        We never store your card details.
      </p>
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>✓ PCI DSS Level 1 Certified</span>
        <span>✓ 256-bit SSL Encryption</span>
      </div>
    </div>
  );
}
