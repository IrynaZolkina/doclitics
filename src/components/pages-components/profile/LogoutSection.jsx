"use client";

import styles from "../profilepage.module.css";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";
import UploadIcon from "@/components-svg/UploadIcon";

export default function LogoutSection({ onAskLogout, loading }) {
  return (
    <div className={styles.info_block}>
      <FlexibleButton
        icon={<UploadIcon rotate={90} width={25} height={22} />}
        onClick={onAskLogout}
        variant="quaternary"
        fontSize="13px"
        borderRadius="14px"
        padding="14px 30px"
        fontWeight="800"
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </FlexibleButton>
    </div>
  );
}
