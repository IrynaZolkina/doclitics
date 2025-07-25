import Image from "next/image";
import styles from "./css-modules/homepage.module.css";
import { Navbar } from "./Navbar";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      HELLO
    </div>
  );
}
