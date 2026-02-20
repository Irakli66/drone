"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Globe, GalleryVertical, Info, Moon, Sun, LucideIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const routes = [
  {
    path: "/",
    label: "Home",
    icon: Home,
  },
  {
    path: "/sphere",
    label: "Sphere",
    icon: Globe,
  },
  {
    path: "/panorama",
    label: "Panorama",
    icon: GalleryVertical,
  },
];

function DockIcon({
  icon: Icon,
  label,
  isActive,
  href,
  mouseX,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  href?: string;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const content = (
    <motion.div
      ref={ref}
      style={{ width }}
      className={`aspect-square rounded-2xl flex items-center justify-center relative group cursor-pointer ${
        isActive ? "bg-primary/20" : "bg-muted/50 hover:bg-muted"
      } transition-colors`}
    >
      {isActive && (
        <motion.div
          layoutId="dockActive"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon
        className={`w-6 h-6 ${isActive ? "text-primary" : "text-foreground"}`}
      />
      <span className="absolute -top-10 px-2 py-1 bg-popover border border-border rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function ThemeToggleDock({ mouseX }: { mouseX: MotionValue<number> }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const toggleTheme = () => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition || !ref.current) {
      setTheme(nextTheme);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

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
  };

  if (!mounted) {
    return <div style={{ width: 48 }} className="aspect-square" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      ref={ref}
      style={{ width }}
      onClick={toggleTheme}
      className="aspect-square rounded-2xl flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors relative group cursor-pointer"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-foreground" />
      ) : (
        <Moon className="w-6 h-6 text-foreground" />
      )}
      <span className="absolute -top-10 px-2 py-1 bg-popover border border-border rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {isDark ? "Light" : "Dark"} Mode
      </span>
    </motion.button>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.nav
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="backdrop-blur-xl bg-card/80 border border-border/50 shadow-2xl rounded-3xl px-4 py-3">
        <div className="flex items-end gap-3 h-16">
          {routes.map((route) => (
            <DockIcon
              key={route.path}
              icon={route.icon}
              label={route.label}
              isActive={pathname === route.path}
              href={route.path}
              mouseX={mouseX}
            />
          ))}

          <div className="w-px h-10 bg-border/50 mx-1" />

          <ThemeToggleDock mouseX={mouseX} />
        </div>
      </div>
    </motion.nav>
  );
}
