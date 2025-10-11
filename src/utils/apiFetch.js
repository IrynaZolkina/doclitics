/**
 * apiFetch wraps fetch() with:
 * - CSRF token
 * - auto refresh of access token if expired
 */

import { NextResponse } from "next/server";
import { getCookie } from "./cookies";
import ToastManual from "@/components-ui/ToastManual";
import { toastSuperFunctionJS } from "@/components-ui/toastSuperFunctionJS";
import { toastManualFunctionJS } from "@/components-ui/toastManualFunctionJS";

export async function apiFetch(url, options = {}) {
  options.headers = options.headers || {};
  options.credentials = "include"; // ✅ super important!

  // Getting csrfToken from cookie
  const csrfToken = getCookie("csrfToken");
  if (!csrfToken) {
    console.log("No CSRF token found, please login");
    // toastManualFunctionJS("No CSRF token found, please login", "error");
    return;
  }

  // Setting csrfToken to header
  if (csrfToken) {
    options.headers["X-CSRF-Token"] = csrfToken;
  }

  console.log("csrfToken----", csrfToken);

  // Attempt request
  let res = await fetch(url, options);
  console.log("Initial fetch response status: ", res.status);

  // If access token expired, refresh and retry
  if (res.status === 403 || res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
      credentials: "include", // ✅ must include here too
    });
    const data = await refreshRes.json();
    console.log("Refresh response status: ", refreshRes);
    console.log("Refresh response status: ", refreshRes.status);
    if (data.success) {
      // New access token set in HttpOnly cookie automatically
      // Retry original request
      console.log("Refresh refreshRes.success: ", data.success);
      res = await fetch(url, options);
    } else {
      // Refresh failed, force logout or redirect to login
      // window.location.href = "http://localhost:3000/";
      //   ToastManual("Token refresh failed");
      console.log("Refresh refreshRes.error.message: ", data.error.message);
      toastManualFunctionJS("Token refresh failed " + data.error.message);
    }
  }

  return res;
}

export function errorResponse(code, message, status = 400) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
