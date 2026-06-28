import { authenticate } from "../middleware/auth.js";
import { trustEngine } from "../lib/engine.js";
import { analyzeImage } from "../services/sightengine.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  // 🔐 AUTH CHECK
  const auth = authenticate(req);

  if (!auth.ok) {
    return res.status(401).json({
      success: false,
      message: auth.error
    });
  }

  try {
    const { imageUrl, url, text, qr } = req.body;

    let imageResult = null;

    if (imageUrl) {
      const ai = await analyzeImage(imageUrl);
      if (ai.success) imageResult = ai.data;
    }

    const result = trustEngine({
      image: imageResult,
      url,
      text,
      qr
    });

    return res.status(200).json({
      success: true,
      user: auth.user.name,
      result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
