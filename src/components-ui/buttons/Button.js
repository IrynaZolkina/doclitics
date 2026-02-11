import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  bg = "#4a90e2",
  radius = "8px",
  padding = "0px 0px",
  borderColor = "none",
  color = "white",
  width = "200px",
  height = "20px",
}) {
  return (
    <button
      className={styles.button}
      style={{
        backgroundColor: bg,
        borderRadius: radius,
        padding: padding,
        borderColor: borderColor,
        color: color,
        width: width,
        height: height,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
