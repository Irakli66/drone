import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navigation from "@/components/common/Navigation";
import AnimatedWaves from "@/components/common/AnimatedWaves";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading"
});
const lato = Lato({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Irakli's Gallery",
  description: "Sphere, Panorama and amazing images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lato.variable} ${montserrat.variable} ${lato.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
          storageKey="drone-irakli"
        >
          <AnimatedWaves />
          <Navigation />
          <main className="min-h-screen pb-32">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
