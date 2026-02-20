"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const ReactPhotoSphereViewer = dynamic(
  () =>
    import("react-photo-sphere-viewer").then(
      (mod) => mod.ReactPhotoSphereViewer,
    ),
  { ssr: false },
);

interface HeroSphereProps {
  imagePath: string;
  imageTitle: string;
  totalSpheres: number;
  totalPanoramas: number;
}

export default function HeroSphere({
  imagePath,
  imageTitle,
  totalSpheres,
  totalPanoramas,
}: HeroSphereProps) {
  const scrollToGallery = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh]">
      {/* Sphere Viewer Background */}
      <div className="absolute inset-0">
        <ReactPhotoSphereViewer
          src={imagePath}
          height="100%"
          width="100%"
          container=""
          navbar={false}
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/80 flex flex-col items-center justify-center text-white">
        <div className="text-center space-y-6 px-4 mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Irakli's Imagery Gallery
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
            Explore stunning sphere and panorama photos captured from above
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center text-sm md:text-base">
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <span className="font-semibold">{totalSpheres}</span> 360° Spheres
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <span className="font-semibold">{totalPanoramas}</span> Panoramas
            </div>
          </div>
        </div>

        {/* Scroll Down Button - More Visible */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/80 text-sm font-medium">
            Scroll to explore
          </span>
          <Button
            onClick={scrollToGallery}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full h-12 w-12 animate-bounce"
          >
            <ArrowDown className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
