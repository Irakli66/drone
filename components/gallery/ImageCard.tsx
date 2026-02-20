"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Maximize2, Download } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ShareDialog from "./ShareDialog";
import FullscreenViewer from "./FullscreenViewer";
import type { ImageData } from "@/lib/images";

const ReactPhotoSphereViewer = dynamic(
  () =>
    import("react-photo-sphere-viewer").then(
      (mod) => mod.ReactPhotoSphereViewer,
    ),
  { ssr: false },
);

interface ImageCardProps {
  image: ImageData;
  index: number;
}

export default function ImageCard({ image, index }: ImageCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const viewUrl = `/view/${image.type}/${encodeURIComponent(image.filename)}`;

  const handleView = () => {
    setViewerOpen(true);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="group relative overflow-hidden pt-0">
          {/* Image/Viewer */}
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {image.type === "sphere" ? (
              <div className="w-full h-full">
                <ReactPhotoSphereViewer
                  src={image.path}
                  height="100%"
                  width="100%"
                  container=""
                  navbar={false}
                  touchmoveTwoFingers={false}
                />
              </div>
            ) : (
              <Image
                src={image.path}
                alt={image.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}

            {/* Fullscreen Icon - Top Right */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white h-8 w-8 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={handleView}
              title="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>

            {/* Type Badge */}
            <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-primary-foreground">
                {image.type === "sphere" ? "360° Sphere" : "Panorama"}
              </span>
            </div>
          </div>

          {/* Card Footer */}
          <div className="p-3 flex items-center justify-between">
            <p className="text-sm font-medium truncate flex-1">
              {image.filename}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="default"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setShareOpen(true);
                }}
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Dialogs */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        imagePath={viewUrl}
        imageTitle={image.filename}
      />
      <FullscreenViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        imagePath={image.path}
        imageType={image.type}
        imageTitle={image.filename}
      />
    </>
  );
}
