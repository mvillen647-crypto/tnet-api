import supabase from "../../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    // Test database connection
    const { error } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    const database = error ? "offline" : "online";

    return res.status(200).json({
      success: true,
      service: "TNet API",
      version: "1.0.0",
      environment: process.env.VERCEL_ENV || "development",
      status: "online",
      database,
      timestamp: new Date().toISOString(),
      endpoints: {
        health: "/api/v1/health",
        status: "/api/v1/status",
        register: "/api/v1/register",
        analyze: "/api/v1/analyze",
        me: "/api/v1/me",
        history: "/api/v1/history"
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      service: "TNet API",
      status: "offline",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
