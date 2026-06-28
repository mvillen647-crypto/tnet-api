export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "QR content is required"
      });
    }

    let score = 100;
    let flags = [];

    const text = content.toLowerCase();

    // Check if it's a URL
    const isUrl = text.startsWith("http") || text.startsWith("www");

    if (isUrl) {
      if (!text.startsWith("https")) {
        score -= 20;
        flags.push("Not secure link (no HTTPS)");
      }

      if (text.includes("login") || text.includes("verify")) {
        score -= 15;
        flags.push("Suspicious login/verify keyword");
      }

      if (text.includes("bit.ly") || text.includes("tinyurl")) {
        score -= 10;
        flags.push("Shortened URL detected");
      }
    } else {
      // If it's just text inside QR
      if (text.includes("free") && text.includes("money")) {
        score -= 25;
        flags.push("Scam-like promotion detected");
      }

      if (text.length > 300) {
        score -= 10;
        flags.push("Unusually long QR payload");
      }
    }

    let level = "Safe";
    if (score < 80) level = "Caution";
    if (score < 50) level = "High Risk";
    if (score < 20) level = "Danger";

    return res.status(200).json({
      success: true,
      content,
      trust: {
        score,
        level,
        flags
      },
      type: isUrl ? "url" : "text"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
  }
