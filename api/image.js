export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed"
    });
  }

  return res.status(200).json({
    success: true,
    endpoint: "/api/image",
    message: "Image endpoint is ready.",
    status: "waiting_for_ai_engine"
  });
}
