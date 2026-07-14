// Homepage Data - Featured Categories, Testimonials, etc.

export const FEATURED_CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    description: "Latest tech & gadgets",
  },
  {
    name: "Clothing",
    slug: "clothing",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    description: "Fashion for everyone",
  },
  {
    name: "Books",
    slug: "books",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop",
    description: "Bestsellers & more",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description: "Complete your look",
  },
];

export const CUSTOMER_TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: "/images/avatars/sarah.jpg",
    rating: 5,
    text: "Best quality products I've ever purchased online! Fast shipping and amazing customer service. Highly recommend!",
    verified: true,
    date: "2026-07-10",
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    avatar: "/images/avatars/michael.jpg",
    rating: 5,
    text: "The attention to detail is incredible. Every product is exactly as described. Will definitely shop here again.",
    verified: true,
    date: "2026-07-08",
  },
  {
    id: 3,
    name: "Emma Davis",
    initials: "ED",
    avatar: "/images/avatars/emma.jpg",
    rating: 5,
    text: "Love the seamless shopping experience! From browsing to checkout, everything was smooth and professional.",
    verified: true,
    date: "2026-07-05",
  },
];

export const PROMO_BANNER = {
  enabled: true,
  message: "Summer Sale - Up to 50% OFF on selected items",
  link: "/shop?sale=true",
  linkText: "Shop Now",
  icon: "🎉",
};

export const NEWSLETTER_CONFIG = {
  title: "Get 10% Off Your First Order",
  description: "Join our newsletter for exclusive deals, new arrivals, and style tips",
  discount: "10%",
  privacyText: "We respect your privacy. Unsubscribe anytime.",
};

export const TRUST_BADGES = [
  { name: "Visa", icon: "credit-card" },
  { name: "Mastercard", icon: "credit-card" },
  { name: "PayPal", icon: "credit-card" },
  { name: "Apple Pay", icon: "credit-card" },
];

export const BRAND_STORY = {
  enabled: false, // Set to true when you have content
  title: "Our Story",
  badge: "Since 2020",
  description: "We're committed to bringing you high-quality, sustainable products that enhance your lifestyle. Every item is carefully curated with you in mind.",
  image: "/images/brand-story.jpg",
  link: "/about",
  linkText: "Learn More About Us",
};

// Stats for social proof
export const SOCIAL_PROOF_STATS = {
  customerCount: "10,000+",
  averageRating: 4.9,
  reviewCount: 2543,
  heading: "Loved by 10,000+ Customers",
};
