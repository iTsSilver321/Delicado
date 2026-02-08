"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitRating(productId: string, rating: number, comment?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to rate a product.");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  // Check if user already rated this product
  const { data: existingRating } = await supabase
    .from("product_ratings")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  if (existingRating) {
    // Update existing rating
    const { error } = await supabase
      .from("product_ratings")
      .update({ rating, comment, created_at: new Date().toISOString() }) // Update timestamp for recent activity
      .eq("id", existingRating.id);

    if (error) {
      console.error("Error updating rating:", error);
      throw new Error("Failed to update rating.");
    }
  } else {
    // Insert new rating
    const { error } = await supabase.from("product_ratings").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    });

    if (error) {
      console.error("Error submitting rating:", error);
      throw new Error("Failed to submit rating.");
    }
  }

  revalidatePath(`/product/[slug]`, "page");
}
