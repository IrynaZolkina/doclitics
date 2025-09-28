import jwt from "jsonwebtoken";

// Load from env with defaults
const ACCESS_TOKEN_MINUTES = parseInt(
  process.env.ACCESS_TOKEN_MINUTES || "6",
  10
);
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "20", 10);

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: `${ACCESS_TOKEN_MINUTES}m`,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: `${REFRESH_TOKEN_DAYS}d`,
  });
}
export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: `${ACCESS_TOKEN_MINUTES}m`,
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: `${REFRESH_TOKEN_DAYS}d`,
  });
}

// export function verifyAccessToken(token) {
//   return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
// }
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    console.error("verifyAccessToken failed:", err.message);
    return null; // don't throw, just return null
  }
}
export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
