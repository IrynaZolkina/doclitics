import React from "react";

const Paper = ({ width = "33px", height = "33px", classname = "" }) => {
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
        // stroke="#090d15"
        stroke="rgba(60, 132, 246)"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4446 2.85107V8.18441C19.4446 8.89165 19.7255 9.56993 20.2256 10.07C20.7257 10.5701 21.404 10.8511 22.1112 10.8511H27.4446"
        stroke="rgba(60, 132, 246)"
        // stroke="#090d15"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1112 12.1846H11.4446"
        stroke="rgba(60, 132, 246)"
        // stroke="#090d15"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1112 17.5173H11.4446"
        stroke="rgba(60, 132, 246)"
        // stroke="#090d15"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1112 22.8508H11.4446"
        stroke="rgba(60, 132, 246)"
        // stroke="#090d15"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Paper;
