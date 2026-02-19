import React from "react";

export default function GraduationIcon({ size = 33, className, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M28.9977 14.7468C29.2364 14.6415 29.439 14.4685 29.5803 14.2492C29.7216 14.0299 29.7955 13.774 29.7928 13.5131C29.7901 13.2523 29.711 12.9979 29.5651 12.7816C29.4193 12.5653 29.2132 12.3965 28.9724 12.2962L17.5444 7.09082C17.197 6.93235 16.8196 6.85034 16.4377 6.85034C16.0559 6.85034 15.6785 6.93235 15.3311 7.09082L3.90439 12.2908C3.66701 12.3948 3.46507 12.5657 3.32327 12.7826C3.18147 12.9995 3.10596 13.253 3.10596 13.5122C3.10596 13.7713 3.18147 14.0248 3.32327 14.2417C3.46507 14.4586 3.66701 14.6295 3.90439 14.7335L15.3311 19.9442C15.6785 20.1026 16.0559 20.1846 16.4377 20.1846C16.8196 20.1846 17.197 20.1026 17.5444 19.9442L28.9977 14.7468Z"
        stroke="currentColor"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.771 13.5181V21.5181"
        stroke="currentColor"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.43774 16.8511V21.5177C8.43774 22.5786 9.2806 23.596 10.7809 24.3462C12.2812 25.0963 14.316 25.5177 16.4377 25.5177C18.5595 25.5177 20.5943 25.0963 22.0946 24.3462C23.5949 23.596 24.4377 22.5786 24.4377 21.5177V16.8511"
        stroke="currentColor"
        strokeWidth="2.31"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
