export default function ClockMiniIcon({
  size = 6,
  color = "#94A3B8",
  strokeWidth = 1.33333,
  className = "",
}) {
  return (
    <svg
      width={(size * 4) / 6} // keeps original 4:6 ratio
      height={size}
      viewBox="0 0 4 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.666016 0.666504V3.99984L3.33268 5.33317"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
