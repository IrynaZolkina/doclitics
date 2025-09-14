"use client";
import Image from "next/image";
import "./globals.css";
// import styles from "./page.module.css";
import { login } from "../redux/store";

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
