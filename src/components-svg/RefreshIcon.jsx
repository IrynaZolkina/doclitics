export default function RefreshIcon({
  size = 14,
  color = "#94A3B8",
  strokeWidth = 1.33333,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.666016 6.6665C0.666016 7.85319 1.01791 9.01323 1.6772 9.99993C2.33649 10.9866 3.27356 11.7557 4.36992 12.2098C5.46627 12.6639 6.67267 12.7827 7.83656 12.5512C9.00044 12.3197 10.0695 11.7483 10.9087 10.9091C11.7478 10.07 12.3192 9.00093 12.5507 7.83705C12.7822 6.67316 12.6634 5.46676 12.2093 4.3704C11.7552 3.27405 10.9861 2.33697 9.99944 1.67769C9.01274 1.0184 7.8527 0.666504 6.66602 0.666504C4.98865 0.672814 3.37866 1.32732 2.17268 2.49317L0.666016 3.99984"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
