import React from "react";

const UploadIcon = ({
  width = 65,
  height = 65,
  className = "",
  strokeColor = "",
  // strokeColor = "#5593F7",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 65 65"
    fill="none"
    className={className}
  >
    <path
      d="M56.7778 40.1351V50.8017C56.7778 52.2162 56.2159 53.5728 55.2157 54.573C54.2155 55.5732 52.859 56.1351 51.4445 56.1351H14.1112C12.6967 56.1351 11.3401 55.5732 10.3399 54.573C9.33973 53.5728 8.77783 52.2162 8.77783 50.8017V40.1351"
      stroke="currentColor"
      strokeWidth="5.44"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M46.111 21.4678L32.7777 8.13446L19.4443 21.4678"
      stroke="currentColor"
      strokeWidth="5.44"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.7778 8.13446V40.1345"
      stroke="currentColor"
      strokeWidth="5.44"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default UploadIcon;
