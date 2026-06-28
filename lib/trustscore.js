export function calculateTrustScore(score = 100) {
  let level = "Safe";

  if (score < 80) level = "Caution";
  if (score < 50) level = "High Risk";
  if (score < 20) level = "Danger";

  return {
    trustScore: score,
    level
  };
}
