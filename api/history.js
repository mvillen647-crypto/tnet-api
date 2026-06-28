import { authenticate } from "../middleware/auth.js";
import supabase from "../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    // Authenticate user
    const auth = await authenticate(req);

    if (!auth.ok) {
      return res.status(401).json({
        success: false,
        message: auth.error
      });
    }

    // Fetch scan history
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", auth.userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      total: data.length,
      history: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
