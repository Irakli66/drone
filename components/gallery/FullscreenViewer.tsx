"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, Download, Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import ShareDialog from "./ShareDialog";

const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false }
);

interface FullscreenViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imagePath: string;
  imageType: "sphere" | "panorama";
  imageTitle: string;
}

export default function FullscreenViewer({
  open,
  onOpenChange,
  imagePath,
  imageType,
  imageTitle,
}: FullscreenViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && containerRef.current) {
      document.body.style.overflow = "hidden";

      const enterFullscreen = async () => {
        try {
          if (document.fullscreenElement) return;
          
          await containerRef.current?.requestFullscreen();
        } catch (err) {
          console.log("Fullscreen not supported or denied:", err);
        }
      };

      const timer = setTimeout(enterFullscreen, 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    onOpenChange(false);
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

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div ref={containerRef} className="fixed inset-0 w-screen h-screen bg-black z-[9999]">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
            title="Download"
          >
            <Download className="w-6 h-6" />
          </Button>

          <Button
            onClick={() => setShareOpen(true)}
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
            title="Share"
          >
            <Share2 className="w-6 h-6" />
          </Button>

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
    </>,
    document.body
  );
}
