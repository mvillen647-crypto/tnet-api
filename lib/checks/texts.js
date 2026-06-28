export function checkText(text = "") {
  const flags = [];

  const suspiciousWords = [
    "free",
    "winner",
    "prize",
    "claim",
    "urgent",
    "verify",
    "password",
    "bank",
    "bitcoin",
    "crypto",
    "click here",
    "limited offer"
  ];

  const lower = text.toLowerCase();

  for (const word of suspiciousWords) {
    if (lower.includes(word)) {
      flags.push(word);
    }
  }

  return {
    status: flags.length ? "warning" : "clean",
    flags,
    score: Math.max(0, 100 - flags.length * 10)
  };
}
