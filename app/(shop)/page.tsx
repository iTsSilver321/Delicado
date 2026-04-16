"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  Send,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { products, getProductsByDesign } from "@/lib/products";

import Turnstile from "react-turnstile";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0] as const
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branchProducts = getProductsByDesign('branch');
  const flowerProducts = getProductsByDesign('flower');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!turnstileToken) {
      toast.error("Please complete the security check.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: turnstileToken }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome to Delicado!", {
          description: data.message || "You'll receive our latest collections and exclusive offers."
        });
        setEmail("");
        setTurnstileToken("");
      } else {
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">

      {/* ─── Hero ─── Clean background, elegant typography */}
      <section className="relative overflow-hidden">
        {/* Subtle radial glow behind text */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(128,0,32,0.06),transparent_70%)]" />

        <div className="container py-28 md:py-36 lg:py-44 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.p
              variants={fadeInUp}
              className="text-primary text-sm font-medium tracking-[0.25em] uppercase"
            >
              Premium Embroidered Bedding
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-foreground leading-[1.08]"
            >
              Crafted Elegance
              <br />
              <span className="text-primary">for Your Home</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              Artisan-crafted bedding sets adorned with exquisite embroidery.
              Premium cotton, timeless designs, delivered to your door.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex justify-center gap-4 pt-2">
              <Link href="/shop">
                <Button size="lg" className="h-13 px-8 text-base rounded-full shadow-md hover:shadow-lg transition-all">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative thin line */}
        <div className="container">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </section>

      {/* ─── Featured Products ─── Clean grid, no carousel */}
      <section className="py-24 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">Our Products</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Explore the Collection</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <Link href={`/product/${product.slug}`} className="group block">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30 mb-4">
                    {/* Tucked — default */}
                    <Image
                      src={product.images.tucked}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Normal — hover */}
                    <Image
                      src={product.images.normal}
                      alt={`${product.name} on the bed`}
                      fill
                      className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-2xl" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span
                      className="w-4 h-4 rounded-full border shadow-sm shrink-0"
                      style={{ backgroundColor: product.colorHex }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Collections ─── Two side-by-side with subtle overlays */}
      <section className="bg-secondary/40 py-24 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Two Signature Designs</h2>
            <p className="text-muted-foreground">Each telling its own story of artisan craftsmanship</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Branch */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/shop?design=branch" className="block group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={branchProducts[0].images.tucked}
                    alt="Branch Collection"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="font-serif text-3xl font-bold text-white mb-2">Branch Collection</h3>
                    <p className="text-white/75 text-sm mb-4">Delicate botanical motifs in {branchProducts.length} colors</p>
                    <div className="flex gap-2">
                      {branchProducts.map((p) => (
                        <span
                          key={p.id}
                          className="w-6 h-6 rounded-full border-2 border-white/40"
                          style={{ backgroundColor: p.colorHex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Flower */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href="/shop?design=flower" className="block group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={flowerProducts[0].images.tucked}
                    alt="Flower Collection"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="font-serif text-3xl font-bold text-white mb-2">Flower Collection</h3>
                    <p className="text-white/75 text-sm mb-4">Intricate peony embroidery in {flowerProducts.length} colors</p>
                    <div className="flex gap-2">
                      {flowerProducts.map((p) => (
                        <span
                          key={p.id}
                          className="w-6 h-6 rounded-full border-2 border-white/40"
                          style={{ backgroundColor: p.colorHex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Why Delicado ─── Clean icon row, no cards */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On all orders" },
              { icon: ShieldCheck, label: "Secure Payment", desc: "SSL encrypted" },
              { icon: Heart, label: "Hand Inspected", desc: "Every piece" },
              { icon: Clock, label: "Ships in 5–7 Days", desc: "Express available" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/8 text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ─── Newsletter ─── */}
      <section className="py-24 md:py-28">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Join the Delicado Family</h2>
            <p className="text-muted-foreground mb-8">
              Get early access to new collections, exclusive discounts, and design inspiration.
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
                {isSubmitting ? "..." : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
            {/* Turnstile Widget */}
            <div className="flex justify-center mt-4">
              <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onVerify={(token) => setTurnstileToken(token)}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
