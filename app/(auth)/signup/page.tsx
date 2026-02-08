"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, signInWithGoogle } from "../actions";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState = {
    error: "",
    success: false
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full h-11 text-base shadow-md hover:shadow-lg transition-all" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
        </Button>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await signup(formData);
        if (result?.error) {
            return { error: result.error, success: false };
        }
        if (result?.success) {
            return { error: "", success: true };
        }
        return { error: "", success: true };
    }, initialState);

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
        if (state?.success) {
            toast.success("Account created!", {
                description: "Please check your email to confirm your account.",
            });
            // Optional: redirect to login or check-email page
            // router.push('/login'); 
        }
    }, [state, router]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-serif font-bold tracking-tight">Create Account</h1>
                <p className="text-muted-foreground">Join the Delicado family today</p>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="fullName" name="fullName" placeholder="John Doe" required className="pl-10 h-11 bg-secondary/20 border-secondary-foreground/10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" placeholder="hello@example.com" required className="pl-10 h-11 bg-secondary/20 border-secondary-foreground/10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="password" name="password" type="password" required className="pl-10 h-11 bg-secondary/20 border-secondary-foreground/10" minLength={6} />
                    </div>
                </div>

                {state?.error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {state.error}
                    </div>
                )}

                <SubmitButton />
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                </div>
            </div>

            <form action={signInWithGoogle}>
                <Button variant="outline" type="submit" className="w-full h-11 hover:bg-secondary/50">
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                </Button>
            </form>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </motion.div>
    );
}
