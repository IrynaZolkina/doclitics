import "../app/globals.css";
import styles from "./css-modules/footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.innerBox}>
          <div className={styles.firstColumn}>
            <div className={styles.logoBlock}>
              <div className={styles.logoBox}>D</div>
              <span>Doclitic</span>
            </div>
            <p>Transform your documents into stunning</p>
            <p>summaries with AI-powered intelligence. Fast,</p>
            <p>secure, and tailored to your needs.</p>
          </div>
          <div className={styles.secondColumn}></div>{" "}
          <div className={styles.thirdColumn}></div>{" "}
          <div className={styles.forthColumn}></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
