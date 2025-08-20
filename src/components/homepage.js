"use client";
import styles from "./css-modules/homepage.module.css";
import "../app/globals.css";
// import { Navbar } from "./Navbar";
import { NavbarN } from "./NavbarN";
// import Navigation from "./Navigation";
// import PDFViewer from "./PDFviewer";
// import dynamic from "next/dynamic";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <NavbarN />
      {/* <Navbar /> */}
      {/* <Navigation /> */}
      {/* <PDFViewer /> */}
    </div>
  );
}
