import crypto from "crypto";

export function generateApiKey() {
  return "tnet_" + crypto.randomBytes(24).toString("hex");
}
