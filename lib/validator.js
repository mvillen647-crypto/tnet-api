export function requireMethod(req, method) {
  return req.method === method;
}

export function requireFields(body, fields = []) {
  if (!body) return false;

  for (const field of fields) {
    if (!body[field]) {
      return false;
    }
  }

  return true;
}
