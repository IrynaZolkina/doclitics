export default function CardIcon({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.667,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.667 4.167H3.333A1.667 1.667 0 0 0 1.667 5.833v8.334A1.667 1.667 0 0 0 3.333 15.833h13.334A1.667 1.667 0 0 0 18.333 14.167V5.833a1.667 1.667 0 0 0-1.666-1.666Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.667 8.333h16.666"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
