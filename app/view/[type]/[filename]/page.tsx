import { notFound } from "next/navigation";
import ImageViewerPage from "@/components/gallery/ImageViewerPage";
import { getImages } from "@/lib/images";

interface PageProps {
  params: Promise<{
    type: string;
    filename: string;
  }>;
}

export default async function ViewImagePage({ params }: PageProps) {
  const { type, filename } = await params;

  if (type !== "sphere" && type !== "panorama") {
    notFound();
  }

  const decodedFilename = decodeURIComponent(filename);
  const imagePath = `/images/${type}/${decodedFilename}`;

  // Get all images of this type for navigation
  const allImages = getImages(type as "sphere" | "panorama");
  const currentIndex = allImages.findIndex(img => img.filename === decodedFilename);

  if (currentIndex === -1) {
    notFound();
  }

  return (
    <ImageViewerPage
      imagePath={imagePath}
      imageType={type as "sphere" | "panorama"}
      imageTitle={decodedFilename}
      allImages={allImages}
      currentIndex={currentIndex}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { type, filename } = await params;
  const decodedFilename = decodeURIComponent(filename);

  return {
    title: `${type === "sphere" ? "360° Sphere" : "Panorama"} - ${decodedFilename}`,
    description: `View ${type === "sphere" ? "interactive 360° sphere" : "panoramic"} image captured by drone`,
  };
}
