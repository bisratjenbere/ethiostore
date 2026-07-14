import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { 
  CUSTOMER_TESTIMONIALS, 
  SOCIAL_PROOF_STATS 
} from "@/lib/constants/homepage-data";

const SocialProof = () => {
  return (
    <section className="bg-muted/30 py-16">
      <div className="wrapper">
        {/* Header with Stats */}
        <div className="text-center mb-12">
          <h2 className="h2-bold mb-4">{SOCIAL_PROOF_STATS.heading}</h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-accent text-accent"
                />
              ))}
            </div>
            <span className="text-xl font-semibold">
              {SOCIAL_PROOF_STATS.averageRating}/5
            </span>
            <span className="text-muted-foreground">
              ({SOCIAL_PROOF_STATS.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {CUSTOMER_TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary text-white">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Verified Buyer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
