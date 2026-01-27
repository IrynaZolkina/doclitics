import ScrollAnimatedSection from "@/components-ui/ScrollAnimatedSection";

import NavbarN from "@/components/homepage/NavbarN";
import HeroSection from "@/components/homepage/HeroSection";
import HowWorksSection from "@/components/homepage/HowWorksSection";
import SupportSection from "@/components/homepage/SupportSection";
import PrivateSection from "@/components/homepage/PrivateSection";
import PriceSection from "@/components/homepage/PriceSection";
import Loved from "@/components/homepage/Loved";
import FaqSection from "@/components/homepage/FaqSection";

export default function Home() {
  return (
    <main>
      <ScrollAnimatedSection>
        <NavbarN />

        <div id="dashboard" className="section">
          <HeroSection />
        </div>

        <div id="features" className="section">
          <HowWorksSection />
          <SupportSection />
        </div>

        <div id="security" className="section">
          <PrivateSection />
        </div>
        <div id="pricing" className="section">
          <PriceSection />
        </div>
        <div id="reviews" className="section">
          <Loved />
        </div>
        <div id="faq" className="section">
          <FaqSection />
        </div>
      </ScrollAnimatedSection>
      {/* <HomePage /> */}
    </main>
  );
}
