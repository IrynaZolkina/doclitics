"use client";

const navItems = [
  { label: "Home", href: "dashboard" },
  { label: "Features", href: "features" },
  { label: "Pricing", href: "pricing" },
  { label: "Security", href: "security" },
  { label: "Reviews", href: "reviews" },
  { label: "FAQ", href: "faq" },
];

export default function NavbarN() {
  const scrollToSection = (href) => {
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <nav className="navbarContainer">
        <div className="flexContainer">
          <div className="navContainer">
            {navItems.map((item) => (
              <div key={item.label} className="label">
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="navItem"
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>

          {/* CTA Button container */}
          <div className="navButtonContainer"></div>
        </div>
      </nav>

      <style jsx>{`
        .navbarContainer {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 70px;
          display: flex;
          align-items: center;
          pointer-events: auto;
          z-index: 1500;
        }

        .flexContainer {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
        }

        .navContainer {
          width: 457px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text-color-white);
        }

        .navItem {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          color: inherit;
          font: inherit;
          font-size: 13.23px;
          cursor: pointer;
          outline: none;
          text-decoration: none;
          font-weight: 500;
          line-height: 1.5rem;
        }

        .navItem:hover {
          color: var(--text-color-blue);
          transition: color 0.2s, background 0.2s;
        }

        .navButtonContainer {
          position: fixed;
          top: 20px;
          left: 80%;
          z-index: 120;
        }

        /* Additional optional classes from your CSS module */
        .glassCard {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pdfWrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background: lavender;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin: 0 auto;
        }

        .controlsContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin: 0 auto;
          margin-bottom: 30px;
          padding: 12px;
          background-color: #e0a6a6;
          border-radius: 6px;
          position: absolute;
          top: 80px;
          left: 0;
          width: 100%;
          height: 90%;
        }

        .pdfContainer {
          margin-top: 20px;
        }

        .pageControls {
          position: absolute;
          top: 10px;
        }

        .zoomControls {
          position: absolute;
          left: 0;
          top: 70px;
        }

        .rotationControls {
          position: absolute;
          left: 0;
          top: 90px;
        }

        .summaryContainer {
          width: 60%;
          height: 90vh;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
