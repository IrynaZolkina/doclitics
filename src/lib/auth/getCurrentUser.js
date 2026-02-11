// lib/auth/getCurrentUser.js
import { cookies } from "next/headers"; //This is server-only code.
import { getUserFromToken } from "@/lib/auth/getUserFromToken";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return null;

    if (accessToken) {
      console.log("Trying access token...");
      const { user } = await getUserFromToken(accessToken);
      if (user) return user; // user._id is ObjectId, convert to string for consistency
    }

    // Access token invalid → refresh server-side
    // const cookieHeader = cookies().toString();
    // const refreshRes = await fetch(
    //   `${process.env.APP_URL}/api/auth/refresh-server`,
    //   {
    //     method: "POST",
    //     headers: {
    //       cookie: cookieHeader,
    //       "x-internal-refresh-secret": process.env.INTERNAL_REFRESH_SECRET,
    //     },
    //     cache: "no-store",
    //   },
    // );

    // if (!refreshRes.ok) return null;

    // // New access token cookie is now set
    // const newAccessToken = cookies().get("accessToken")?.value;
    // if (!newAccessToken) return null;

    // const { user } = await getUserFromToken(token1);
    // if (!user) return null;
    // console.log("User from DB access token:", user);
    // console.log("Payload from refresh token:", payload);
    return user ?? null;
    // return user;
  } catch (err) {
    return null;
  }
}
