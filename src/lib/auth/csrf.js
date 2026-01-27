// lib/csrf.js
export function getCsrfTokens(req) {
  const csrfHeader = req.headers.get("x-csrf-token");
  const csrfCookie = req.cookies.get("csrfToken")?.value;
  return { csrfHeader, csrfCookie };
}

export function validateCsrf(csrfHeader, csrfCookie) {
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    const error = new Error("CSRF mismatch. Not authorized");
    error.code = "CSRF_MISMATCH";
    throw error;
  }
}
