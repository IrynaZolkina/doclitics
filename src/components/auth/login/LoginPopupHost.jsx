"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PopupLogin from "@/components/auth/login/PopupLogin";
// import BlurBackdrop from "@/components/auth/login/BlurBackdrop";

export default function LoginPopupHost() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isOpen = searchParams.get("login") === "1";

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");

    router.replace(params.toString() ? `${pathname}?${params}` : pathname, {
      scroll: false,
    });
  }, [searchParams, pathname, router]);

  if (!isOpen) return null;

  return (
    <>
      {/* <BlurBackdrop visible onClick={close} /> */}
      <PopupLogin onClose={close} />
    </>
  );
}
