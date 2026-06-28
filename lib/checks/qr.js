export function checkQR(qr = "") {
  return {
    status: qr ? "detected" : "not_provided",
    score: 100
  };
}
