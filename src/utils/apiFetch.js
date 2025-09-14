import { getCookie } from "./cookies";

export async function apiFetch(url, options = {}) {
  const csrfToken = getCookie("csrfToken");

  const headers = {
    ...options.headers,
    ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // send cookies
  });
}
