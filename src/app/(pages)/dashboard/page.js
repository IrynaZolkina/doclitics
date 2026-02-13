"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/pages-components/dashboard/Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { authChecked, isAuthenticated, username } = useSelector((s) => s.user);
  const userSummaries = useSelector((state) => state.user.userSummaries);
  console.log("summaries. -----------------", userSummaries);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.replace("/?login=1");
    }
  }, [authChecked, isAuthenticated, router]);

  if (!authChecked) return null; // waiting for /me
  if (!isAuthenticated) return null; // redirecting

  return <Dashboard userSummaries={userSummaries} userName={username} />;
}
