"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import FlexibleButton from "@/components-ui/FlexibleButton";
import { setUserLogout } from "@/redux/store";
import { apiFetch } from "@/utils/apiFetch";
import { useRouter } from "next/navigation";
import { toastSuperFunctionJS } from "@/components-ui/toastSuperFunctionJS";

const UserProfile = ({ username, picture }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
      toastSuperFunctionJS("Logout failed" + err, "error");
    } finally {
      dispatch(setUserLogout());
      // router.push("/");
      window.location.href = "/";
    }
  };

  return (
    <div className="userProfileContainer">
      <FlexibleButton
        onClick={handleLogout}
        variant="secondary"
        fontSize="13px"
        borderRadius="14px"
        padding="14px 30px"
        fontWeight="800"
      >
        Logout
      </FlexibleButton>

      <div className="userPicture">
        {picture ? (
          <Image src={picture} alt="Profile" width={50} height={50} />
        ) : (
          <div className="initials">{username.slice(0, 1)}</div>
        )}
      </div>

      <style jsx>{`
        .userProfileContainer {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .userPicture {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
        }
        .initials {
          width: 50px;
          height: 50px;
          background: var(--gradient-primary);
          color: var(--text-color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
