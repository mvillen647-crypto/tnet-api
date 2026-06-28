import { users } from "../config/users.js";

export function authenticate(req) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return { ok: false, error: "Missing API Key" };
  }

  const user = users.find(u => u.apiKey === apiKey);

  if (!user) {
    return { ok: false, error: "Invalid API Key" };
  }

  return { ok: true, user };
}
