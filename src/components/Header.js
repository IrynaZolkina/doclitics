import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/header.module.css";
import DocliticLogo from "@/components-ui/svg-components/DocliticLogo";

const Header = () => {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.container}>
          <div className={styles.flexContainer}>
            {/* Logo */}
            <div className={styles.flexLogo}>
              <div className={styles.logoBox}>
                {/* <Image src="Group 1.svg" alt="Logo" width={40} height={40} /> */}
                <DocliticLogo width={40} height={40} />
              </div>
              <span className={styles.logoText}>Doclitic</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
