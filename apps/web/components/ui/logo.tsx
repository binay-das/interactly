import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Logo({ size = 24, className = "", ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="64" height="64" rx="16" fill="#F97316" />
      <path
        d="M17 17.5C17 14.4624 19.4624 12 22.5 12H41.5C44.5376 12 47 14.4624 47 17.5V34.5C47 37.5376 44.5376 40 41.5 40H32L24 48V40H22.5C19.4624 40 17 37.5376 17 34.5V17.5Z"
        fill="#FFF7ED"
      />
      <path
        d="M25 26H39"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 19V33"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="47" cy="46" r="6" fill="#171717" />
      <path
        d="M45 46L47 48L50 44"
        stroke="#FFF7ED"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
