// lib/auth/serverRefresh.js
export async function serverRefresh(req) {
  const cookieHeader = req.headers.get("cookie") || "";

  const res = await fetch(`${process.env.APP_URL}/api/auth/refresh-server`, {
    method: "POST",
    headers: {
      cookie: cookieHeader, // forward cookies (refreshToken, csrfToken if present, etc)
      "x-internal-refresh-secret": process.env.INTERNAL_REFRESH_SECRET,
    },
    cache: "no-store",
  });

  // IMPORTANT: forward Set-Cookie back to the client so they get the new tokens
  const setCookie = res.headers.get("set-cookie");

  return { ok: res.ok, setCookie };
}
