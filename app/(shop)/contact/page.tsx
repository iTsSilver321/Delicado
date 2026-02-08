"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
    {
        icon: Mail,
        title: "Email",
        value: "support@delicado.com",
        href: "mailto:support@delicado.com"
    },
    {
        icon: Phone,
        title: "Phone",
        value: "+1 (555) 123-4567",
        href: "tel:+15551234567"
    },
    {
        icon: MapPin,
        title: "Address",
        value: "123 Artisan Lane, Suite 100\nNew York, NY 10001",
        href: null
    },
    {
        icon: Clock,
        title: "Business Hours",
        value: "Mon - Fri: 9AM - 6PM EST\nSat: 10AM - 4PM EST",
        href: null
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Message sent!", {
            description: "We'll get back to you within 24 hours."
        });

        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(128,0,32,0.08),transparent_50%)]" />
                <div className="container text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-4"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mx-auto">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm font-medium">Get In Touch</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl font-bold">
                            Contact <span className="text-primary">Us</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a question or special request? We'd love to hear from you. Our team typically responds within 24 hours.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-card rounded-2xl border p-8">
                            <h2 className="font-serif text-2xl font-bold mb-6">Send a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            required
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                            className="h-12"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="How can we help?"
                                        required
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order">Order Number (Optional)</Label>
                                    <Input
                                        id="order"
                                        placeholder="e.g., #DEL-12345"
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                        className="min-h-[150px] resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-14 text-lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="inline-block"
                                            >
                                                ⟳
                                            </motion.span>
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="font-serif text-2xl font-bold mb-2">Other Ways to Reach Us</h2>
                            <p className="text-muted-foreground">
                                Prefer to reach out directly? Here's how you can contact our team.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="bg-card rounded-xl border p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">{item.title}</h3>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-muted-foreground whitespace-pre-line">{item.value}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-card rounded-2xl border overflow-hidden">
                            <div className="aspect-video bg-secondary/30 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Visit our studio by appointment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
