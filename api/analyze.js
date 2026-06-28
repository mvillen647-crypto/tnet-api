import { trustEngine } from "../lib/engine.js";
import { analyzeImage } from "../services/sightengine.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { imageUrl, url, text, qr } = req.body;

    let imageResult = null;

    // =========================
    // IMAGE AI CALL (optional)
    // =========================
    if (imageUrl) {
      const ai = await analyzeImage(imageUrl);

      if (ai.success) {
        imageResult = ai.data;
      }
    }

    // =========================
    // TRUST ENGINE (CORE BRAIN)
    // =========================
    const result = trustEngine({
      image: imageResult,
      url,
      text,
      qr
    });

    return res.status(200).json({
      success: true,
      input: {
        imageUrl: imageUrl || null,
        url: url || null,
        text: text || null,
        qr: qr || null
      },
      result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
        }
