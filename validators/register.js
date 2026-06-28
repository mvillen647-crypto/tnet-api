export function validateRegister(body) {
  const { name, email } = body;

  if (!name || name.trim().length < 2) {
    return "Name must contain at least 2 characters.";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email || "")) {
    return "Invalid email address.";
  }

  return null;
}
