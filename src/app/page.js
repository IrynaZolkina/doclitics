"use client";
import Image from "next/image";
// import styles from "./page.module.css";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import HomePage from "@/components/homepage";

export default function Home() {
  useScrollAnimation();
  return (
    <div>
      <HomePage />
    </div>
  );
}
