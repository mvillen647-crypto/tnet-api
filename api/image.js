import { analyzeImage } from "../services/sightengine.js";
import { calculateTrustScore } from "../lib/trustScore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "imageUrl is required"
      });
    }

    // Call AI service
    const result = await analyzeImage(imageUrl);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "AI analysis failed",
        error: result.error
      });
    }

    // Simple trust logic (unaweza kuboresha baadaye)
    let score = 100;

    const data = result.data;

    if (data.nudity?.raw > 0.5) score -= 40;
    if (data.weapon > 0.5) score -= 30;
    if (data.alcohol > 0.5) score -= 10;
    if (data.drugs > 0.5) score -= 30;

    const trust = calculateTrustScore(score);

    return res.status(200).json({
      success: true,
      imageUrl,
      trust,
      ai: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}
