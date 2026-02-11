import React from "react";

const DocIcon = ({
  width = 17,
  height = 17,
  className = "",
  strokeColor = "#0B111E",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_111_1416)">
      <path
        d="M10.8275 1.46704H4.82747C4.47385 1.46704 4.13471 1.60752 3.88466 1.85757C3.63462 2.10761 3.49414 2.44675 3.49414 2.80037V13.467C3.49414 13.8207 3.63462 14.1598 3.88466 14.4099C4.13471 14.6599 4.47385 14.8004 4.82747 14.8004H12.8275C13.1811 14.8004 13.5202 14.6599 13.7703 14.4099C14.0203 14.1598 14.1608 13.8207 14.1608 13.467V4.80037L10.8275 1.46704Z"
        stroke={strokeColor}
        strokeWidth="1.42833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1611 1.46704V4.13371C10.1611 4.48733 10.3016 4.82647 10.5517 5.07652C10.8017 5.32657 11.1408 5.46704 11.4945 5.46704H14.1611"
        stroke={strokeColor}
        strokeWidth="1.42833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.49447 6.13452H6.16113"
        stroke={strokeColor}
        strokeWidth="1.42833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.4945 8.80005H6.16113"
        stroke={strokeColor}
        strokeWidth="1.42833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.4945 11.4674H6.16113"
        stroke={strokeColor}
        strokeWidth="1.42833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_111_1416">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0.827637 0.134277)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default DocIcon;
