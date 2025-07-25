import Image from "next/image";
import styles from "./css-modules/homepage.module.css";
import "../app/globals.css";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <HeroSection />
      hello
    </div>
  );
}
