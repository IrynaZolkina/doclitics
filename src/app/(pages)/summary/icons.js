// components/icons.js

// 😊 Smile icon
export const Smile = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f7b731"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

// ✨ Star / Sparkle icon
export const Star = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3C83F6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </svg>
);

// 🔥 Fire icon
export const Fire = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f54e3d"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2c2.5 4 2 7 0 9-2-2-3.5-4-2-8C7 5 5 9 5 13a7 7 0 0 0 14 0c0-3-1.5-6-7-11z" />
  </svg>
);
export const Paper = ({ width = "33px", height = "33px", classname = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 33"
      fill="none"
      className={classname}
    >
      <path
        d="M20.7778 2.85107H8.77775C8.07051 2.85107 7.39223 3.13203 6.89213 3.63212C6.39204 4.13222 6.11108 4.8105 6.11108 5.51774V26.8511C6.11108 27.5583 6.39204 28.2366 6.89213 28.7367C7.39223 29.2368 8.07051 29.5177 8.77775 29.5177H24.7778C25.485 29.5177 26.1633 29.2368 26.6634 28.7367C27.1635 28.2366 27.4444 27.5583 27.4444 26.8511V9.51774L20.7778 2.85107Z"
        stroke="rgba(60, 132, 246)"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4446 2.85107V8.18441C19.4446 8.89165 19.7255 9.56993 20.2256 10.07C20.7257 10.5701 21.404 10.8511 22.1112 10.8511H27.4446"
        stroke="rgba(60, 132, 246)"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1112 12.1846H11.4446"
        stroke="rgba(60, 132, 246)"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1112 17.5173H11.4446"
        stroke="rgba(60, 132, 246)"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1112 22.8508H11.4446"
        stroke="rgba(60, 132, 246)"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const StarPlus = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="none"
    viewBox="0 0 36 36"
  >
    <rect
      width="36"
      height="36"
      fill="#3C83F6"
      fillOpacity="0.1"
      rx="12"
    ></rect>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M16.28 20.917a1.67 1.67 0 0 0-1.197-1.198l-5.112-1.318a.417.417 0 0 1 0-.802l5.112-1.319a1.67 1.67 0 0 0 1.198-1.197l1.318-5.112a.417.417 0 0 1 .803 0l1.317 5.112a1.67 1.67 0 0 0 1.198 1.198l5.112 1.317a.417.417 0 0 1 0 .804l-5.112 1.317a1.67 1.67 0 0 0-1.198 1.198l-1.318 5.112a.417.417 0 0 1-.803 0zM24.666 10.5v3.333M26.333 12.167H23M11.334 22.167v1.666M12.167 23H10.5"
    ></path>
  </svg>
);
export const PaperBg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    fill="none"
    viewBox="0 0 48 48"
  >
    <rect
      width="48"
      height="48"
      fill="#3C83F6"
      fillOpacity="0.1"
      rx="12"
    ></rect>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M27 14h-9a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V19z"
    ></path>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M26 14v4a2 2 0 0 0 2 2h4M22 21h-2M28 25h-8M28 29h-8"
    ></path>
  </svg>
);
export const CycleDoubleBg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="none"
    viewBox="0 0 36 36"
  >
    <rect
      width="36"
      height="36"
      fill="#3C83F6"
      fillOpacity="0.1"
      rx="12"
    ></rect>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M18 26.333a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667"
    ></path>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M18 23a5 5 0 1 0 0-10 5 5 0 0 0 0 10"
    ></path>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M18 19.667a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"
    ></path>
  </svg>
);
export const BookBg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="none"
    viewBox="0 0 36 36"
  >
    <rect
      width="36"
      height="36"
      fill="#3C83F6"
      fillOpacity="0.1"
      rx="12"
    ></rect>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M18 13.833V25.5M10.5 23a.833.833 0 0 1-.834-.833V11.333a.833.833 0 0 1 .833-.833h4.167a3.333 3.333 0 0 1 3.333 3.333 3.333 3.333 0 0 1 3.334-3.333h4.166a.833.833 0 0 1 .834.833v10.834a.833.833 0 0 1-.834.833h-5a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-2.5-2.5z"
    ></path>
  </svg>
);
export const LampBg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="none"
    viewBox="0 0 36 36"
  >
    <rect
      width="36"
      height="36"
      fill="#3C83F6"
      fillOpacity="0.1"
      rx="12"
    ></rect>
    <path
      stroke="#3C83F6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M20.5 19.667c.167-.834.583-1.417 1.25-2.084.833-.75 1.25-1.833 1.25-2.916a5 5 0 0 0-10 0c0 .833.167 1.833 1.25 2.916.583.584 1.083 1.25 1.25 2.084M15.5 23h5M16.334 26.333h3.333"
    ></path>
  </svg>
);
