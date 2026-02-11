// ScrollAnimatedSection.js
"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ScrollAnimatedSection({ children }) {
  useScrollAnimation();
  return <div className="section-enter">{children}</div>;
}
