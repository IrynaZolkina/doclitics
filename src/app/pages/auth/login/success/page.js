"use server";
import { redirect } from "next/navigation";

export default async function LoginSuccessPage() {
  // Read cookie on the server
  const lastPage = getCookie("lastPage") || "/";

  // Clear cookie
  deleteCookie("lastPage");

  // Redirect
  redirect(lastPage);

  // This never renders
  return null;
}

import { cookies } from "next/headers";

export async function getCookie(name) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export async function deleteCookie(name) {
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value: "",
    maxAge: 0,
    path: "/",
  });
}
