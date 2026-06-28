export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "text is required"
      });
    }

    let score = 100;
    let flags = [];

    const lower = text.toLowerCase();

    // Scam indicators
    if (lower.includes("congratulations") || lower.includes("you won")) {
      score -= 25;
      flags.push("Prize scam pattern detected");
    }

    if (lower.includes("urgent") || lower.includes("act now")) {
      score -= 15;
      flags.push("Urgency manipulation detected");
    }

    if (lower.includes("send money") || lower.includes("pay now")) {
      score -= 30;
      flags.push("Payment scam risk");
    }

    if (lower.includes("free money") || lower.includes("make money fast")) {
      score -= 25;
      flags.push("Fake income promise detected");
    }

    if (text.length < 10) {
      score -= 10;
      flags.push("Very short text (low context)");
    }

    if (text.length > 500) {
      score -= 10;
      flags.push("Unusually long message");
    }

    // Toxicity hint (basic)
    if (lower.includes("stupid") || lower.includes("idiot")) {
      score -= 10;
      flags.push("Mild toxic language detected");
    }

    let level = "Safe";
    if (score < 80) level = "Caution";
    if (score < 50) level = "High Risk";
    if (score < 20) level = "Danger";

    return res.status(200).json({
      success: true,
      text,
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
