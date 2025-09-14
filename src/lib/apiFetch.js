// lib/apiFetch.js
export async function apiFetch(url, options = {}) {
  let res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    // token expired → try refreshing
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // retry the original request
      res = await fetch(url, { ...options, credentials: "include" });
    }
  }

  return res;
}
