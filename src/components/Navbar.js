"use client";

import Image from "next/image";
import styles from "./css-modules/navbar.module.css";

const navItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={styles.navbarContainer}>
      {/* <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/20"> */}
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          {/* Logo */}
          <div className={styles.flexLogo}>
            <div className={styles.logoBox}>
              <Image src="Group 1.svg" alt="Logo" width={40} height={40} />
              {/* <span className={styles.logoBigLetter}>N</span> */}
            </div>
            <span className={styles.logoText}>Noora</span>
          </div>

          {/* Navigation Links */}
          <div className={styles.navContainer}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={styles.navItem}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className={styles.navButtonContainer}>
            <button className={styles.navButton}>Get Started</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
