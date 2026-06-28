export function checkImage(imageData = null) {
  if (!imageData) {
    return {
      status: "not_provided",
      score: 100
    };
  }

  return {
    status: "analyzed",
    score: 100,
    details: imageData
  };
}
