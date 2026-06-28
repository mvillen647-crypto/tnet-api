import supabase from "../lib/supabase.js";

export async function authenticate(req) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return {
      ok: false,
      error: "Missing API Key"
    };
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("user_id, active")
    .eq("api_key", apiKey)
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: "Invalid API Key"
    };
  }

  if (!data.active) {
    return {
      ok: false,
      error: "API Key is disabled"
    };
  }

  return {
    ok: true,
    userId: data.user_id
  };
}
