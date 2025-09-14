// lib/auth.js
import jwt from "jsonwebtoken";

export function verifyAccessToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return payload; // contains userId, email, etc.
  } catch (err) {
    return null; // token expired or invalid
  }
}
