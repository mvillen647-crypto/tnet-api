export function checkUrl(url = "") {
  if (!url) {
    return {
      status: "not_provided",
      score: 100
    };
  }

  const flags = [];

  if (!url.startsWith("https://")) {
    flags.push("No HTTPS");
  }

  if (url.includes("@")) {
    flags.push("Suspicious character (@)");
  }

  if (url.length > 150) {
    flags.push("Very long URL");
  }

  return {
    status: flags.length ? "warning" : "clean",
    flags,
    score: Math.max(0, 100 - flags.length * 20)
  };
}
