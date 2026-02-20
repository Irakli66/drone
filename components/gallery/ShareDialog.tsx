"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Send, MessageCircle, Link2, Check } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imagePath: string;
  imageTitle: string;
}

export default function ShareDialog({
  open,
  onOpenChange,
  imagePath,
  imageTitle,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" 
    ? (imagePath.startsWith("/view/") 
        ? `${window.location.origin}${imagePath}`
        : `${window.location.origin}${imagePath}`)
    : "";
  const shareText = `Check out this ${imageTitle}!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: imageTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Image</DialogTitle>
          <DialogDescription>
            Share this image with your friends
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {/* System Share */}
          <Button
            onClick={handleSystemShare}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <Send className="w-5 h-5" />
            <span>Share via System</span>
          </Button>

          {/* Facebook */}
          <Button
            onClick={() => window.open(shareLinks.facebook, "_blank", "width=600,height=400")}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <Facebook className="w-5 h-5" />
            <span>Share on Facebook</span>
          </Button>

          {/* WhatsApp */}
          <Button
            onClick={() => window.open(shareLinks.whatsapp, "_blank")}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Share on WhatsApp</span>
          </Button>

          {/* Telegram */}
          <Button
            onClick={() => window.open(shareLinks.telegram, "_blank")}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <Send className="w-5 h-5" />
            <span>Share on Telegram</span>
          </Button>

          {/* Copy Link */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-5 h-5" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
