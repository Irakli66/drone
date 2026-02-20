"use client";

import { motion } from "framer-motion";

export default function AnimatedWaves() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs - Theme Primary Color */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
        style={{
          background: "radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full opacity-25 blur-[130px]"
        style={{
          background: "radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full opacity-28 blur-[110px]"
        style={{
          background: "radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* SVG Wave Lines - Golden Primary Color with Moving Lights */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Moving light gradient - Golden #c6a353 */}
          <linearGradient id="movingLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c6a353" stopOpacity="0">
              <animate
                attributeName="offset"
                values="-0.3;1.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="15%" stopColor="#c6a353" stopOpacity="0.8">
              <animate
                attributeName="offset"
                values="-0.15;1.45"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="30%" stopColor="#c6a353" stopOpacity="0">
              <animate
                attributeName="offset"
                values="0;1.6"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="movingLight2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c6a353" stopOpacity="0">
              <animate
                attributeName="offset"
                values="-0.3;1.3"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="15%" stopColor="#c6a353" stopOpacity="1">
              <animate
                attributeName="offset"
                values="-0.15;1.45"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="30%" stopColor="#c6a353" stopOpacity="0">
              <animate
                attributeName="offset"
                values="0;1.6"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="movingLight3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c6a353" stopOpacity="0">
              <animate
                attributeName="offset"
                values="-0.3;1.3"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="15%" stopColor="#c6a353" stopOpacity="0.7">
              <animate
                attributeName="offset"
                values="-0.15;1.45"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="30%" stopColor="#c6a353" stopOpacity="0">
              <animate
                attributeName="offset"
                values="0;1.6"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* Wave Line 1 - Top */}
        <path
          d="M -200,200 Q 200,150 600,200 T 1400,200 T 2200,200 T 3000,200"
          stroke="url(#movingLight)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Wave Line 2 - Middle */}
        <path
          d="M -200,450 Q 300,400 800,450 T 1800,450 T 2800,450 T 3800,450"
          stroke="url(#movingLight2)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Wave Line 3 - Bottom with gentle wave motion */}
        <path
          d="M -200,700 Q 250,650 700,700 T 1700,700 T 2700,700 T 3700,700"
          stroke="url(#movingLight3)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M -200,700 Q 250,650 700,700 T 1700,700 T 2700,700 T 3700,700;
                    M -200,700 Q 250,750 700,700 T 1700,700 T 2700,700 T 3700,700;
                    M -200,700 Q 250,650 700,700 T 1700,700 T 2700,700 T 3700,700"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
