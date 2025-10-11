import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const lastPage = (await cookieStore.get("lastPage")?.value) || "/";
  // Construct full URL
  const redirectUrl = new URL(lastPage, process.env.API_URL);

  // Clear the cookie
  const response = NextResponse.redirect(redirectUrl);
  // Clear the cookie
  //   const response = NextResponse.redirect(lastPage);
  response.cookies.set({
    name: "lastPage",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
