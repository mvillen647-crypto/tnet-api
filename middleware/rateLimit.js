import supabase from "../lib/supabase.js";

const LIMITS = {
  free: 100,
  pro: 5000,
  enterprise: Number.MAX_SAFE_INTEGER
};

export async function rateLimit(userId, endpoint) {
  // Get user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();

  const plan = subscription?.plan || "free";
  const limit = LIMITS[plan] || LIMITS.free;

  // Count requests in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("endpoint", endpoint)
    .gte("created_at", oneHourAgo);

  if (error) {
    throw error;
  }

  if (count >= limit) {
    return {
      ok: false,
      message: "Rate limit exceeded. Please try again later."
    };
  }

  // Record this request
  const { error: insertError } = await supabase
    .from("rate_limits")
    .insert({
      user_id: userId,
      endpoint
    });

  if (insertError) {
    throw insertError;
  }

  return {
    ok: true,
    remaining: limit - (count + 1),
    plan
  };
}
