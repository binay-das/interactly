"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme, type Theme } from "../../context/theme-context";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "dark",
      label: "Dark",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    {
      id: "system",
      label: "System",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const currentOption = options.find((o) => o.id === theme) || options[2];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={`Theme: ${currentOption?.label}`}
        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-md text-[#24292f] dark:text-[#c9d1d9] hover:text-[#1f2328] dark:hover:text-[#f0f6fc] bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] cursor-pointer flex items-center gap-1.5 text-xs font-medium"
      >
        {currentOption?.icon}
        <span className="capitalize hidden sm:inline">{theme}</span>
        <svg className="w-3 h-3 text-[#8c959f] dark:text-[#6e7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-md bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-lg py-1 z-50">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setTheme(option.id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                theme === option.id
                  ? "bg-[#ddf4ff] dark:bg-[#033877] text-[#0969da] dark:text-[#58a6ff]"
                  : "text-[#1f2328] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]"
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
