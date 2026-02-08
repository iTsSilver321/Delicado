"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Palette,
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  Scissors,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Send,
  Bed,
  Shirt,
  UtensilsCrossed,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0] as const
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Featured products data
const featuredProducts = [
  { name: "Silk Pillowcase", category: "Bedding", price: 79, image: null, slug: "bedding" },
  { name: "Linen Robe", category: "Clothing", price: 149, image: null, slug: "clothing" },
  { name: "Table Runner", category: "Tableware", price: 89, image: null, slug: "tableware" },
  { name: "Cotton Sheet Set", category: "Bedding", price: 199, image: null, slug: "bedding" },
];

// Testimonials data
const testimonials = [
  {
    name: "Sarah M.",
    location: "New York, NY",
    rating: 5,
    text: "The pillowcases I ordered for my daughter's wedding were absolutely stunning. The real-time preview was so accurate!",
    product: "Silk Pillowcase Set"
  },
  {
    name: "Michael R.",
    location: "Los Angeles, CA",
    rating: 5,
    text: "I've ordered personalized gifts from many places, but Delicado's quality is unmatched. The embroidery is flawless.",
    product: "Monogrammed Robe"
  },
  {
    name: "Emily T.",
    location: "Chicago, IL",
    rating: 5,
    text: "The table linens I ordered for my restaurant's anniversary were perfect. Our guests loved the personalized touch!",
    product: "Custom Table Runner"
  },
];

// Gallery images (placeholder for now)
const galleryImages = [
  { alt: "Embroidered pillowcase", color: "bg-gradient-to-br from-rose-100 to-rose-200" },
  { alt: "Monogrammed robe", color: "bg-gradient-to-br from-amber-100 to-amber-200" },
  { alt: "Custom table setting", color: "bg-gradient-to-br from-emerald-100 to-emerald-200" },
  { alt: "Personalized bedding", color: "bg-gradient-to-br from-sky-100 to-sky-200" },
  { alt: "Embroidered napkins", color: "bg-gradient-to-br from-violet-100 to-violet-200" },
  { alt: "Custom throw pillow", color: "bg-gradient-to-br from-orange-100 to-orange-200" },
];

// Category cards
const categories = [
  { name: "Bedding", icon: Bed, desc: "Pillowcases, sheets & more", href: "/products/bedding", color: "from-rose-500/20" },
  { name: "Clothing", icon: Shirt, desc: "Robes, shirts & apparel", href: "/products/clothing", color: "from-amber-500/20" },
  { name: "Tableware", icon: UtensilsCrossed, desc: "Table linens & napkins", href: "/products/tableware", color: "from-emerald-500/20" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome to Delicado!", {
          description: data.message || "You'll receive our latest collections and exclusive offers."
        });
        setEmail("");
      } else {
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(128,0,32,0.1),transparent_70%)]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6 max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 mx-auto">
            <Sparkles className="w-4 h-4" />
            <span>Premium Custom Embroidery</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground text-balance">
            Make It Uniquely <span className="text-primary italic">Yours</span>.
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Experience the magic of seeing your design before it&apos;s stitched.
            Luxury bedding, clothing, and home goods personalized by you.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center pt-8">
            <Link href="/search">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                <Palette className="w-5 h-5 mr-2" />
                Customize Now
              </Button>
            </Link>
            <Link href="/search?category=bedding">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 transition-all hover:scale-105 active:scale-95">
                Shop Bedding
              </Button>
            </Link>
            <Link href="/search?category=clothing">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 transition-all hover:scale-105 active:scale-95">
                Shop Clothing
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Shop by Category */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg">Find your perfect canvas for personalization</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <div className={`group relative rounded-2xl p-8 bg-gradient-to-br ${category.color} to-transparent border hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-background shadow-sm group-hover:shadow-md transition-shadow">
                      <category.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.desc}</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Featured</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Popular Picks</h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="icon" onClick={() => scrollCarousel("left")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => scrollCarousel("right")}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-72 snap-start"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="group bg-card rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center relative overflow-hidden">
                      <span className="font-serif text-6xl text-primary/20 group-hover:scale-110 transition-transform duration-500">
                        {product.name[0]}
                      </span>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-medium">${product.price}</span>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid with Icons */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Why Choose Delicado?</h2>
          <p className="text-muted-foreground text-lg">Artisan quality meets modern technology.</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {[
            { icon: Palette, title: "Real-time Preview", desc: "No more guessing. Visualize your exact thread colors and font choices instantly on the product." },
            { icon: Scissors, title: "Artisan Crafted", desc: "We combine state-of-the-art embroidery machines with hand-finished detailing for perfection." },
            { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Premium materials, satin threads, and a 100% satisfaction guarantee on all custom orders." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-card hover:bg-secondary/30 transition-colors duration-300 hover:-translate-y-2"
            >
              <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            <span>Customer Love</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border p-6 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground mb-6 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                <div className="flex text-yellow-500">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">Purchased: {testimonial.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-24 overflow-hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 space-y-8"
            >
              <h2 className="font-serif text-3xl md:text-5xl font-bold">Simple as 1, 2, 3.</h2>

              <div className="space-y-6">
                {[
                  { step: 1, title: "Choose Your Canvas", desc: "Select from our curated collection of bedding, robes, or table linens." },
                  { step: 2, title: "Make It Yours", desc: "Type your text, pick a font, and select a thread color in our visual studio." },
                  { step: 3, title: "We Do The Rest", desc: "Our artisans embroider your piece and ship it directly to your door." }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="md:w-1/2 relative"
            >
              <div className="aspect-square rounded-2xl bg-white shadow-2xl overflow-hidden cursor-pointer transform transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <span className="font-serif text-6xl text-primary/10 select-none">Delicado</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <motion.p
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="font-serif text-4xl text-primary font-bold drop-shadow-sm"
                  >
                    Your Name
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Crafted With Love</h2>
          <p className="text-muted-foreground text-lg">A glimpse into our artisan workshop</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`aspect-square rounded-2xl overflow-hidden ${image.color} flex items-center justify-center group cursor-pointer hover:shadow-xl transition-all duration-300`}
            >
              <div className="text-center p-4">
                <span className="font-serif text-3xl text-black/20 group-hover:text-black/40 transition-colors">
                  {image.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Stay Updated</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Join the Delicado Family</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Get early access to new collections, exclusive discounts, and embroidery inspiration delivered to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full px-6"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Subscribing..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="container py-16 border-t">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-12 md:gap-24"
        >
          <div className="flex items-center gap-2 font-serif font-bold text-xl">
            <Truck className="w-5 h-5 text-primary" /> Free Shipping
          </div>
          <div className="flex items-center gap-2 font-serif font-bold text-xl">
            <ShieldCheck className="w-5 h-5 text-primary" /> Secure Payment
          </div>
          <div className="flex items-center gap-2 font-serif font-bold text-xl">
            <Heart className="w-5 h-5 text-primary" /> Hand Inspected
          </div>
          <div className="flex items-center gap-2 font-serif font-bold text-xl">
            <Clock className="w-5 h-5 text-primary" /> Ships in 5-7 Days
          </div>
        </motion.div>
      </section>

    </div>
  );
}
