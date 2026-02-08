import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Product Showcase / Image */}
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
            <div className="flex flex-col items-center justify-center p-8 bg-background relative">
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Store
                </Link>
                <div className="w-full max-w-sm space-y-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
