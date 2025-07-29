"use client";
import Image from "next/image";
import styles from "./css-modules/homepage.module.css";
import "../app/globals.css";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";
import HowWorksSection from "./HowWorksSection";
import SupportSection from "./SupportSection";
import PrivateSection from "./PrivateSection";
import PriceSection from "./PriceSection";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      {/* <HeroSection />
      <HowWorksSection />
      <SupportSection />
      <PrivateSection />
      <PriceSection /> */}
    </div>
  );
}
