export function trustEngine({ image, url, text, qr }) {
  let score = 100;
  let flags = [];

  // =========================
  // IMAGE ANALYSIS INPUT
  // =========================
  if (image) {
    if (image.nudity > 0.5) {
      score -= 40;
      flags.push("Image contains sensitive content");
    }

    if (image.weapon > 0.5) {
      score -= 30;
      flags.push("Weapon detected in image");
    }

    if (image.drugs > 0.5) {
      score -= 30;
      flags.push("Drug-related content detected");
    }
  }

  // =========================
  // URL ANALYSIS INPUT
  // =========================
  if (url) {
    if (url.includes("phishing") || url.includes("login")) {
      score -= 20;
      flags.push("Suspicious URL pattern");
    }

    if (!url.startsWith("https")) {
      score -= 15;
      flags.push("Unsecured connection");
    }
  }

  // =========================
  // TEXT ANALYSIS INPUT
  // =========================
  if (text) {
    const lower = text.toLowerCase();

    if (lower.includes("you won") || lower.includes("free money")) {
      score -= 25;
      flags.push("Scam-like message detected");
    }

    if (lower.includes("urgent") || lower.includes("act now")) {
      score -= 10;
      flags.push("Manipulation language detected");
    }
  }

  // =========================
  // QR ANALYSIS INPUT
  // =========================
  if (qr) {
    if (qr.type === "url" && !qr.content.startsWith("https")) {
      score -= 10;
      flags.push("QR contains unsafe link");
    }
  }

  // =========================
  // FINAL LEVEL
  // =========================
  let level = "Safe";

  if (score < 80) level = "Caution";
  if (score < 50) level = "High Risk";
  if (score < 20) level = "Danger";

  return {
    trustScore: score,
    level,
    flags
  };
}
