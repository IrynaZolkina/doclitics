// lib/auth/getCurrentUser.js
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth/getUserFromToken";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const token1 = cookieStore.get("refreshToken")?.value;
    // console.log("getCurrentUser token:", token);
    // console.log("getCurrentUser refresh token:", token1);
    // if (!token) return null;
    if (!token1) return null;

    const { user, payload } = await getUserFromToken(token1);
    if (!user) return null;
    // console.log("User from DB refresh token:", user);
    // console.log("Payload from refresh token:", payload);

    return user;
  } catch (err) {
    return null;
  }
}
