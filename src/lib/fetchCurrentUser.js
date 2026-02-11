"use server";
import { clearUser, setError, setLoading, setUser } from "@/redux/store";
import { apiFetch } from "./apiFetch";

export async function fetchCurrentUser() {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const res = await apiFetch("/api/auth/me", { method: "GET" });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();

      if (data?.user) {
        dispatch(setUser(data.user));
      } else {
        dispatch(clearUser());
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      dispatch(setError(err.message));
      dispatch(clearUser());
    }
  };
}
