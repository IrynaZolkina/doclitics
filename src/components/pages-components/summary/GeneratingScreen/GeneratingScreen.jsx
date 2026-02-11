import styles from "./GeneratingScreen.module.css";

export default function GeneratingScreen() {
  return (
    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     height: "100vh",
    //     fontSize: "22px",
    //     fontWeight: 600,
    //   }}
    // >
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className={styles.box} />
        ))}
      </div>
    </div>
  );
}
