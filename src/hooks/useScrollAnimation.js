"use client";
import { useEffect } from "react";

export const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const sections = document.querySelectorAll(".section-enter");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      // sections.forEach((section) => {
      //   observer.unobserve(section);
      // });
      observer.disconnect();
    };
  }, []);
};
