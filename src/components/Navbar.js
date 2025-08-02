"use client";
import Image from "next/image";
import styles from "./css-modules/navbar.module.css";
import HeroSection from "./HeroSection";
import HowWorksSection from "./HowWorksSection";
import SupportSection from "./SupportSection";
import PrivateSection from "./PrivateSection";
import PriceSection from "./PriceSection";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#dashboard" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];
// import { MongoClient, ObjectId } from "mongodb";

export function Navbar() {
  const scrollToSection = (href) => {
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    const navElements = document.querySelectorAll(".label");
    window.addEventListener("scroll", () => {
      if (typeof window !== "undefined") {
        console.log(".label-----", navElements);
        console.log("window.scrollY", window.scrollY);

        if (window.scrollY >= 0 && window.scrollY < 308) {
          //onsole.log("window.scrollY---------", window.scrollY);
          navElements.forEach((el, index) => {
            if (index === 0) {
              el.className = "active";
            } else {
              el.className = styles.navItem; // Reset all nav items
            }
          });
        } else if (window.scrollY >= 308 && window.scrollY < 460) {
          navElements.forEach((el, index) => {
            if (index === 1) {
              el.className = "active";
            } else {
              el.className = styles.navItem; // Reset all nav items
            }
          });
        } else if (window.scrollY >= 460 && window.scrollY < 2800) {
          navElements.forEach((el, index) => {
            if (index === 3) {
              el.className = "active";
            } else {
              el.className = styles.navItem; // Reset all nav items
            }
          });
        } else if (window.scrollY >= 2800 && window.scrollY < 4200) {
          navElements.forEach((el, index) => {
            if (index === 2) {
              el.className = "active";
            } else {
              el.className = styles.navItem; // Reset all nav items
            }
          });
        } else if (window.scrollY >= 4200 && window.scrollY < 10000) {
          navElements.forEach((el, index) => {
            if (index === 4) {
              el.className = "active";
            } else {
              el.className = styles.navItem; // Reset all nav items
            }
          });
        }
      }
    });
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);
  const dbb = async () => {
    // try {
    //   client = await connectToDatabase();
    //   console.log("SUCCESS");
    // } catch (error) {
    //   // res.status(500).json({ message: "Connecting to database failed" });
    //   console.log("Error");
    //   return;
    // }
  };
  return (
    <div>
      <nav className={styles.navbarContainer}>
        {/* <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/20"> */}
        <div className={styles.container}>
          <div className={styles.flexContainer}>
            {/* Logo */}
            <div className={styles.flexLogo} onClick={() => dbb()}>
              <div className={styles.logoBox}>
                <Image src="Group 1.svg" alt="Logo" width={40} height={40} />
                {/* <span className={styles.logoBigLetter}>N</span> */}
              </div>
              <span className={styles.logoText}>Doclitic</span>
            </div>

            {/* Navigation Links */}
            <div className={styles.navContainer}>
              {navItems.map((item) => (
                // <Link href={item.href} key={item.label}>
                <div key={item.label} className="label">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    // reviewsRef.current?.scrollIntoView({ behavior: "smooth" })

                    className={styles.navItem}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className={styles.navButtonContainer}>
              <button className={styles.navButton}>Get Started</button>
            </div>
          </div>
        </div>
      </nav>
      <div id="#dashboard" className="section">
        <HeroSection />
      </div>
      <div id="#features" className="section">
        <HowWorksSection />
        <SupportSection />
      </div>

      <div id="#security" className="section">
        <PrivateSection />
      </div>
      <div id="#pricing" className="section">
        <PriceSection />
      </div>
      <div id="#reviews" className="section"></div>
      <div id="#faq" className="section"></div>
    </div>
  );
}
