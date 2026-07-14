"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NEWSLETTER_CONFIG } from "@/lib/constants/homepage-data";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      // TODO: Implement actual email subscription API
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thanks for subscribing! Check your email for your discount code.");
      setEmail("");
    });
  };

  return (
    <section className="bg-primary text-white py-16">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {NEWSLETTER_CONFIG.title}
          </h2>
          <p className="text-lg text-white/90">
            {NEWSLETTER_CONFIG.description}
          </p>
          
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white text-foreground flex-1"
            />
            <Button 
              type="submit" 
              variant="secondary"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
          
          <p className="text-xs text-white/70">
            {NEWSLETTER_CONFIG.privacyText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
