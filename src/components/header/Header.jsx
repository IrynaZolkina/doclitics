"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import Doclitic2 from "@/components-ui/svg-components/Doclitic2";
import { setUserLogin, setUserLogout } from "@/redux/store";
import { apiFetch } from "@/utils/apiFetch";
import PopupLogin from "../PopupLogin";
import FlexibleButton from "@/components-ui/FlexibleButton";
import { toastSuperFunctionJS } from "@/components-ui/toastSuperFunctionJS";
import UserProfile from "./UserProfile";

const Header = ({ user }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const [isLoginOpen, setIsLoginOpen] = useState(false);
  // const [authChecked, setAuthChecked] = useState(true);

  // const isLoginParam = searchParams.get("login") === "1";
  const isLoginOpen = searchParams.get("login") === "1";

  // useEffect(() => {
  //   setIsLoginOpen(isLoginParam);
  // }, [isLoginParam]);
  // console.log("HEADER RENDERING WITH USER:", user);
  useEffect(() => {
    if (!user) {
      dispatch(setUserLogout());
      return;
    }

    dispatch(
      setUserLogin({
        userId: user._id,
        username: user.username,
        email: user.email,
        userCategory: user.category,
        picture: user.picture || "",
      })
    );
  }, [user, dispatch]);

  const updateQuery = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) params.delete(key);
      else params.set(key, value);

      router.replace(params.toString() ? `${pathname}?${params}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, pathname, router]
  );

  const openLogin = () => {
    // setIsLoginOpen(true);
    updateQuery("login", "1");
  };

  const closeLogin = () => {
    // setIsLoginOpen(false);
    updateQuery("login", null);
  };

  return (
    <>
      {isLoginOpen && <PopupLogin onClose={closeLogin} />}
      <div className="headerContainer">
        <div className="container">
          <div className="flexContainer">
            <div className="flexLogo">
              <Link href="/" className="logoBox">
                <Doclitic2 width={30} height={30} />
                <span className="logoText">Doclitic</span>
              </Link>
            </div>

            <div className="flexLogo">
              {user ? (
                <UserProfile username={user.username} picture={user.picture} />
              ) : (
                <FlexibleButton
                  onClick={openLogin}
                  variant="secondary"
                  padding="11px 18px"
                  fontSize="13.02px"
                  borderRadius="14px"
                  fontWeight="800"
                >
                  Get Started
                </FlexibleButton>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .headerContainer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          height: auto;
        }
        .container {
          max-width: 100%;
          padding: 0 20px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flexContainer {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 10px 20px;
        }
        .flexLogo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .logoBox {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logoText {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
          color: var(--text-color-white);
          margin-left: 10px;
        }
      `}</style>
    </>
  );
};

export default Header;
