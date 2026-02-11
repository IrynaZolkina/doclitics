/**
 * apiFetch wraps fetch() with:
 * - CSRF token
 * - auto refresh of access token if expired
 */
"use client";

// import ToastManual from "@/components-ui/ToastManual";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import { toastManualFunctionJS } from "@/components-ui/toasts/toastManualFunctionJS";
import { getCookie } from "./cookiesClient";

let refreshPromise = null; // ✅ shared across calls

let refreshFailed = false; // 🔒 hard stop after failure

async function runRefresh(csrfToken) {
  console.log("Running token refresh - frontend ............");

  const refreshRes = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "x-csrf-token": csrfToken },
    credentials: "include",
  });

  const data = await refreshRes.json();

  if (!refreshRes.ok || !data?.success) {
    const msg = data?.error?.message || "Refresh failed";
    throw new Error(msg);
  }

  return true;
}

export async function apiFetch(url, options = {}) {
  options.headers = options.headers || {};
  options.credentials = "include"; // ✅ super important!
  console.log(" apiFetch HIT -----------------");
  // const method = (options.method || "GET").toUpperCase();
  // const needsCsrf = !["GET", "HEAD", "OPTIONS"].includes(method);

  // Read CSRF once
  const csrfToken = getCookie("csrfToken");

  // if (needsCsrf) {
  if (!csrfToken) {
    toastSuperFunctionJS("Please login again", "error");
    return null;
  }
  options.headers["x-csrf-token"] = csrfToken;
  // options.headers["X-CSRF-Token"] = csrfToken;
  // }

  if (!csrfToken) {
    // console.log("No CSRF token found, please login");
    toastSuperFunctionJS("No CSRF token found, please login", "error");
    //toastManualFunctionJS("No CSRF token found, please login", "error");
    return;
  }

  // Attempt request
  console.log("apiFetch", url, options.method || "GET");

  let triedRefresh = false;

  try {
    let res = await fetch(url, options);

    console.log("apiFetch first status:", res.status, "url:", url);

    // console.log("Initial fetch response status: ", res.status);

    // 2) If access token expired/invalid -> refresh and retry
    // 🔴 Only try refresh ONCE and ONLY if refresh is allowed
    if (res.status === 401 && !triedRefresh && !refreshFailed) {
      triedRefresh = true;
      // if (res.status === 403 || res.status === 401) {
      // const refreshRes = await fetch("/api/auth/refresh", {
      //   method: "POST",
      //   headers: { "X-CSRF-Token": csrfToken },
      //   credentials: "include", // ✅ must include here too
      // });

      try {
        console.log("apiFetch got 401, attempting refresh...");

        // ✅ single-flight refresh
        if (!refreshPromise) {
          refreshPromise = runRefresh(csrfToken).finally(() => {
            refreshPromise = null;
          });
        }
        await refreshPromise;
        // let refreshData = null;
        // try {
        //   refreshData = await refreshRes.json();
        // } catch {}

        // if (refreshRes.ok && refreshData?.success) {
        res = await fetch(url, options);
        console.log("apiFetch retry status:", res.status, "url:", url);
      } catch (e) {
        refreshFailed = true; // 🛑 stop future refresh attempts
        toastManualFunctionJS(
          "Session expired. Please login again." + e.message,
          "error",
        );
        return null;
      }
      // } else {
      //   const msg = refreshData?.error?.message || "Refresh failed";
      //   toastManualFunctionJS("Token refresh failed: " + msg, "error");
      //   return null;
      // }
    }

    return res;
  } catch (err) {
    // 🔥 THIS is where "internet disconnected" lives
    console.error("NETWORK_ERROR:", err);

    return {
      ok: false,
      status: 0,
      networkError: true,
      async json() {
        return {
          success: false,
          error: {
            code: "NETWORK_ERROR",
            message: "Network connection lost. Please check your internet.",
          },
        };
      },
    };
  }
}
