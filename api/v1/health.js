export default function handler(req, res) {
  res.status(200).json({
    success: true,
    name: "TNet API",
    service: "Trust Network",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString()
  });
}
