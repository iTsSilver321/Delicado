import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative">
            {/* Mobile Background - visible only on mobile/tablet */}
            <div className="lg:hidden fixed inset-0 -z-10">
                <Image
                    src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2000&auto=format&fit=crop"
                    alt="Delicado Embroidery"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 dark:from-background/98 dark:via-background/95 dark:to-background/98" />
            </div>

            {/* Left: Product Showcase / Image - Desktop only */}
            <div className="hidden lg:block relative bg-stone-900">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2000&auto=format&fit=crop"
                    alt="Delicado Embroidery"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute bottom-12 left-12 z-20 text-white max-w-lg">
                    <h2 className="text-5xl font-serif font-bold mb-6 tracking-tight">Crafted for You.</h2>
                    <p className="text-xl font-light opacity-90 leading-relaxed text-stone-200">
                        Experience the magic of seeing your design before it's stitched.
                        Luxury bedding, clothing, and home goods personalized by you.
                    </p>
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 relative min-h-screen">
                <Link href="/" className="absolute top-6 sm:top-8 left-6 sm:left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group font-medium">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Back to Store</span>
                </Link>

                {/* Form container with glassmorphism on mobile */}
                <div className="w-full max-w-sm space-y-8 lg:bg-transparent bg-background/60 dark:bg-card/60 backdrop-blur-xl lg:backdrop-blur-none p-6 lg:p-0 rounded-2xl lg:rounded-none border lg:border-0 border-border/50 shadow-2xl lg:shadow-none">
                    {children}
                </div>

                {/* Decorative elements for mobile */}
                <div className="lg:hidden absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-sm text-muted-foreground">Premium Embroidery • Made with ❤️</p>
                </div>
            </div>
        </div>
    )
}

