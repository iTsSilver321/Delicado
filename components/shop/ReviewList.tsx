"use client";

import { Star, User, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "./StarRating";
import { formatDistanceToNow } from "date-fns";

export interface Review {
    id: string;
    rating: number;
    comment?: string | null;
    created_at: string;
    user_id: string;
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed">
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-medium">No reviews yet</h3>
                <p className="text-muted-foreground">Be the first to share your thoughts on this product.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold">Customer Reviews</h3>
            <div className="grid gap-6">
                <AnimatePresence initial={false}>
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="group bg-card rounded-xl p-6 shadow-sm border transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={review.profiles?.avatar_url || undefined} alt={review.profiles?.full_name || "User"} />
                                        <AvatarFallback className="bg-primary/5 text-primary">
                                            {review.profiles?.full_name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium text-sm">
                                            {review.profiles?.full_name || "Verified Customer"}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex bg-secondary/50 px-2 py-1 rounded-full">
                                    <StarRating value={review.rating} size={14} readOnly />
                                </div>
                            </div>

                            {review.comment && (
                                <p className="text-muted-foreground leading-relaxed pl-13 border-l-2 border-primary/10 pl-4 ml-2">
                                    {review.comment}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
