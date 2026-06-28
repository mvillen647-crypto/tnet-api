export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "url is required"
      });
    }

    // Basic checks (TNet core logic)
    let score = 100;
    let flags = [];

    const lowerUrl = url.toLowerCase();

    if (!lowerUrl.startsWith("https")) {
      score -= 20;
      flags.push("Not secure (no HTTPS)");
    }

    if (lowerUrl.includes("login") || lowerUrl.includes("verify")) {
      score -= 15;
      flags.push("Suspicious keywords detected");
    }

    if (lowerUrl.includes("@")) {
      score -= 25;
      flags.push("Possible phishing pattern (@ in URL)");
    }

    // Fake domain risk hint
    if (lowerUrl.includes("bit.ly") || lowerUrl.includes("tinyurl")) {
      score -= 10;
      flags.push("Shortened URL - verify destination");
    }

    let level = "Safe";
    if (score < 80) level = "Caution";
    if (score < 50) level = "High Risk";
    if (score < 20) level = "Danger";

    return res.status(200).json({
      success: true,
      url,
      trust: {
        score,
        level,
        flags
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
        }
