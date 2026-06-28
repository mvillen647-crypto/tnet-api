import crypto from "crypto";
import supabase from "../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { name, email } = req.body;

    import { validateRegister } from "../validators/register.js";

const error = validateRegister(req.body);

if (error) {
  return res.status(400).json({
    success: false,
    message: error
  });
}

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        name,
        email
      })
      .select()
      .single();

    if (userError) throw userError;

    // Generate API key
    const apiKey = "tnet_" + crypto.randomBytes(24).toString("hex");

    // Save API key
    const { error: keyError } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        api_key: apiKey
      });

    if (keyError) throw keyError;

    // Create default subscription
    await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan: "free"
      });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      apiKey
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
  }
