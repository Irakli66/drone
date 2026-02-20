import { getImages } from "@/lib/images";
import ImageCard from "@/components/gallery/ImageCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroSphere from "@/components/common/HeroSphere";

export default function Home() {
  const sphereImages = getImages("sphere") || [];
  const panoramaImages = getImages("panorama") || [];
  const firstSphere = sphereImages[0];

  const displaySphereImages = sphereImages.slice(0, 10);
  const displayPanoramaImages = panoramaImages.slice(0, 10);

  return (
    <div className="w-full">
      {/* Hero Section with First Sphere */}
      {firstSphere && (
        <HeroSphere
          imagePath={firstSphere.path}
          imageTitle={firstSphere.filename}
          totalSpheres={sphereImages.length}
          totalPanoramas={panoramaImages.length}
        />
      )}

      <div className="container mx-auto p-6 space-y-12">
        {/* Sphere Images Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">360° Sphere Images</h2>
              <p className="text-muted-foreground mt-1">
                Immersive 360° sphere photos
              </p>
            </div>

            {displaySphereImages.length > 0 && (
              <Button asChild variant="outline">
                <Link href="/sphere" className="gap-2 inline-flex items-center">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>

          {displaySphereImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displaySphereImages.map((image, index) => (
                <ImageCard key={image.id} image={image} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                No sphere images yet. Add images to public/images/sphere/
              </p>
            </div>
          )}
        </section>

        {/* Panorama Images Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Panorama Images</h2>
              <p className="text-muted-foreground mt-1">
                Wide-angle panoramic views
              </p>
            </div>

            {displayPanoramaImages.length > 0 && (
              <Button asChild variant="outline">
                <Link
                  href="/panorama"
                  className="gap-2 inline-flex items-center"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>

          {displayPanoramaImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayPanoramaImages.map((image, index) => (
                <ImageCard key={image.id} image={image} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                No panorama images yet. Add images to public/images/panorama/
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
