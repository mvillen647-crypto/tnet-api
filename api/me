import { authenticate } from "../middleware/auth.js";
import { trustEngine } from "../lib/engine.js";
import { analyzeImage } from "../services/sightengine.js";
import supabase from "../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  // 🔐 Authenticate API Key
  const auth = await authenticate(req);

  if (!auth.ok) {
    return res.status(401).json({
      success: false,
      message: auth.error
    });
  }

  try {
    const { imageUrl, url, text, qr } = req.body;

    let imageResult = null;

    // ==========================
    // IMAGE AI ANALYSIS
    // ==========================
    if (imageUrl) {
      const ai = await analyzeImage(imageUrl);

      if (ai.success) {
        imageResult = ai.data;
      }
    }

    // ==========================
    // TRUST ENGINE
    // ==========================
    const result = trustEngine({
      image: imageResult,
      url,
      text,
      qr
    });

    // ==========================
    // SAVE SCAN HISTORY
    // ==========================
    await supabase.from("scans").insert({
      user_id: auth.userId,
      scan_type: imageUrl
        ? "image"
        : url
        ? "url"
        : text
        ? "text"
        : qr
        ? "qr"
        : "unknown",
      input: {
        imageUrl,
        url,
        text,
        qr
      },
      result,
      trust_score: result.trustScore
    });

    // ==========================
    // SAVE USAGE LOG
    // ==========================
    await supabase.from("usage_logs").insert({
      user_id: auth.userId,
      endpoint: "/api/analyze",
      ip_address:
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        "unknown"
    });

    // ==========================
    // RESPONSE
    // ==========================
    return res.status(200).json({
      success: true,
      userId: auth.userId,
      result
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}
