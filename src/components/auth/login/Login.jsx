"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import FlexibleButton from "@/components-ui/buttons/FlexibleButton";

const Login = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) params.delete(key);
      else params.set(key, value);

      router.replace(params.toString() ? `${pathname}?${params}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, pathname, router],
  );

  return (
    <FlexibleButton
      onClick={() => updateQuery("login", "1")}
      variant="secondary"
      padding="11px 18px"
      fontSize="13.02px"
      borderRadius="14px"
      fontWeight="800"
    >
      Get Started
    </FlexibleButton>
  );
};

export default Login;
