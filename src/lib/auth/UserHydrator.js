"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/redux/store";

export default function UserHydrator({ user }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(clearUser());
      return;
    }

    dispatch(
      setUser({
        id: user._id,
        username: user.username,
        email: user.email,
        plan: user.plan,
        docsAmount: user.docsAmount,
        picture: user.picture ?? null,
      }),
    );
  }, [user, dispatch]);

  return null;
}
