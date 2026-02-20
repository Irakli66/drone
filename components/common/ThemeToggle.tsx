"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition || !buttonRef.current) {
      setTheme(nextTheme);
      return;
    }

    // Get button center position
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate max radius needed to cover the entire screen from this point
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled
        className="opacity-0"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative"
    >
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0 absolute"
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`h-5 w-5 transition-all duration-300 ${
          !isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0 absolute"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  );
}
