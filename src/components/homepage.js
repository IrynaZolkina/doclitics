import Image from "next/image";
import styles from "./css-modules/homepage.module.css";
import "../app/globals.css";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";
import HowWorksSection from "./HowWorksSection";
import SupportSection from "./SupportSection";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <HeroSection />
      <HowWorksSection />
      <SupportSection />
    </div>
  );
}
