"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, Share2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import ShareDialog from "./ShareDialog";

const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false }
);

interface ImageViewerPageProps {
  imagePath: string;
  imageType: "sphere" | "panorama";
  imageTitle: string;
  allImages?: Array<{ filename: string; path: string }>;
  currentIndex?: number;
}

export default function ImageViewerPage({
  imagePath,
  imageType,
  imageTitle,
  allImages = [],
  currentIndex = 0,
}: ImageViewerPageProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const hasPrevious = allImages.length > 0 && currentIndex > 0;
  const hasNext = allImages.length > 0 && currentIndex < allImages.length - 1;

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.fullscreenElement) return;
        
        await containerRef.current?.requestFullscreen();
      } catch (err) {
        console.log("Fullscreen not supported or denied:", err);
      }
    };

    const timer = setTimeout(enterFullscreen, 100);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) {
        handleClose();
      }
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrevious) {
        navigateToPrevious();
      } else if (e.key === "ArrowRight" && hasNext) {
        navigateToNext();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleArrowKeys);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleArrowKeys);
    };
  }, [hasPrevious, hasNext]);

  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    // Redirect to appropriate gallery page instead of router.back()
    router.push(`/${imageType}`);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const navigateToPrevious = () => {
    if (hasPrevious) {
      const prevImage = allImages[currentIndex - 1];
      router.push(`/view/${imageType}/${encodeURIComponent(prevImage.filename)}`);
    }
  };

  const navigateToNext = () => {
    if (hasNext) {
      const nextImage = allImages[currentIndex + 1];
      router.push(`/view/${imageType}/${encodeURIComponent(nextImage.filename)}`);
    }
  };

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 w-full h-full bg-black z-50">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          {/* Download Button */}
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
            title="Download"
          >
            <Download className="w-6 h-6" />
          </Button>

          {/* Share Button */}
          <Button
            onClick={() => setShareOpen(true)}
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
            title="Share"
          >
            <Share2 className="w-6 h-6" />
          </Button>

          {/* Close Button */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
            title="Close"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation Arrows */}
        {hasPrevious && (
          <Button
            onClick={navigateToPrevious}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white h-12 w-12"
            title="Previous Image"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        )}

        {hasNext && (
          <Button
            onClick={navigateToNext}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white h-12 w-12"
            title="Next Image"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        )}

        {/* Title */}
        <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-white font-medium">{imageTitle}</p>
        </div>

        {/* Viewer */}
        {imageType === "sphere" ? (
          <div className="w-full h-full">
            <ReactPhotoSphereViewer
              src={imagePath}
              height="100%"
              width="100%"
              container=""
              navbar={[
                "autorotate",
                "zoom",
                "fullscreen",
              ]}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full h-full">
              <Image
                src={imagePath}
                alt={imageTitle}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        )}
      </div>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        imagePath={imagePath}
        imageTitle={imageTitle}
      />
    </>
  );
}
