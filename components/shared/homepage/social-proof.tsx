import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { 
  CUSTOMER_TESTIMONIALS, 
  SOCIAL_PROOF_STATS 
} from "@/lib/constants/homepage-data";

const SocialProof = () => {
  return (
    <section className="bg-gradient-to-b from-background via-muted/30 to-background py-16 md:py-20">
      <div className="wrapper">
        {/* Header with Stats */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{SOCIAL_PROOF_STATS.heading}</h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-2xl font-bold">
              {SOCIAL_PROOF_STATS.averageRating}/5
            </span>
            <span className="text-muted-foreground text-base">
              from {SOCIAL_PROOF_STATS.reviewCount.toLocaleString()} reviews
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {CUSTOMER_TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.id} className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
              <CardContent className="p-6 md:p-7">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-3" />

                {/* Rating */}
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="mb-6 text-base leading-relaxed">
                  {testimonial.text}
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary text-white font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
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
