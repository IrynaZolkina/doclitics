"use client";
import { useEffect } from "react";

export const useScrollAnimation = (
  selector = ".section-enter",
  animateClass = "animate"
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animateClass);
            observer.unobserve(entry.target); // stop watching after first animation
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const sections = document.querySelectorAll(selector);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [selector, animateClass]);
};

// "use client";
// import { useEffect } from "react";

// export const useScrollAnimation = () => {
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("animate");
//           }
//         });
//       },
//       {
//         threshold: 0.1,
//         rootMargin: "0px 0px -50px 0px",
//       }
//     );

//     const sections = document.querySelectorAll(".section-enter");
//     sections.forEach((section) => {
//       observer.observe(section);
//     });

//     return () => {
//       // sections.forEach((section) => {
//       //   observer.unobserve(section);
//       // });
//       observer.disconnect();
//     };
//   }, []);
// };
