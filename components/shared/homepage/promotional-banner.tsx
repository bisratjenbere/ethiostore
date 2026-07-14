"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { PROMO_BANNER } from "@/lib/constants/homepage-data";

const PromotionalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!PROMO_BANNER.enabled || !isVisible) return null;

  return (
    <div className="bg-accent text-white py-3 px-4 text-center text-sm relative">
      <div className="wrapper flex items-center justify-center gap-2">
        <span>{PROMO_BANNER.icon}</span>
        <p>
          <strong>{PROMO_BANNER.message}</strong>
          {PROMO_BANNER.link && (
            <>
              {" | "}
              <Link 
                href={PROMO_BANNER.link} 
                className="underline hover:no-underline font-semibold"
              >
                {PROMO_BANNER.linkText} →
              </Link>
            </>
          )}
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PromotionalBanner;
