import React from "react";

const ArrowRightIcon = ({
  width = 25,
  height = 25,
  className = "",
  strokeColor = "#5593F7",
  strokeOpacity = 0.4,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.77783 12.0143H19.7778"
      stroke={strokeColor}
      strokeOpacity={strokeOpacity}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.7778 5.01428L19.7778 12.0143L12.7778 19.0143"
      stroke={strokeColor}
      strokeOpacity={strokeOpacity}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowRightIcon;
