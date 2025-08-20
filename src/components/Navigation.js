import "../app/globals.css";
import styles from "./css-modules/navbar.module.css";
import FaqSection from "./FaqSection";
import HeroSection from "./HeroSection";
import HowWorksSection from "./HowWorksSection";
import Loved from "./Loved";
import PriceSection from "./PriceSection";
import PrivateSection from "./PrivateSection";
import SupportSection from "./SupportSection";

const navItems = [
  { label: "Home", href: "#dashboard" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

const scrollToSection = (href) => {
  const element = document.getElementById(href);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const Navigation = () => {
  return (
    <div>
      <div className={styles.flexContainer}>
        {/* Logo */}
        {/* <div className={styles.flexLogo} onClick={() => dbb()}>
              <div className={styles.logoBox}>
                <Image src="Group 1.svg" alt="Logo" width={40} height={40} />
              </div>
              <span className={styles.logoText}>Doclitic</span>
            </div> */}

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
      </div>
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
      <div id="#reviews" className="section">
        <Loved />
      </div>
      <div id="#faq" className="section">
        <FaqSection />
      </div>
    </div>
  );
};

export default Navigation;
