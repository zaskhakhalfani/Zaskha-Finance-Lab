// components/Logo.jsx
import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg sm:text-xl font-bold text-emerald-400 tracking-tight">
        Zaskha
      </span>
      <span className="text-lg sm:text-xl font-light text-slate-100">
        Finance Lab
      </span>
      {/* Simple line-chart icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3v18h18M7 14l3-3 4 4 4-5"
        />
      </svg>
    </div>
  );
}
