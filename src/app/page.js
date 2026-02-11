import ScrollAnimatedSection from "@/components-ui/z-others/ScrollAnimatedSection";

import NavbarN from "@/components/pages-components/homepage/navbar/NavbarN";

import HeroSection from "@/components/pages-components/homepage/herosection/HeroSection";
import HowWorksSection from "@/components/pages-components/homepage/howworkssection/HowWorksSection";
import SupportSection from "@/components/pages-components/homepage/supportsection/SupportSection";
import PrivateSection from "@/components/pages-components/homepage/privatesection/PrivateSection";
import PriceSection from "@/components/pages-components/homepage/pricesection/PriceSection";
import Loved from "@/components/pages-components/homepage/lovedsection/Loved";
import FaqSection from "@/components/pages-components/homepage/faqsection/FaqSection";

export default function Home() {
  return (
    <main>
      <ScrollAnimatedSection>
        <NavbarN />
        {/* <div
          style={{
            fontSize: "40px",
            color: "white",
            padding: "40px",
            marginTop: "80px",
            background: "linear-gradient(90deg, red, blue)",
            }}
            >
            THIS SHOULD BLUR
            </div> */}
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
