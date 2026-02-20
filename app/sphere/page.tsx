import { getImages } from "@/lib/images";
import ImageCard from "@/components/gallery/ImageCard";

export default function SpherePage() {
  const sphereImages = getImages("sphere");

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">360° Sphere Images</h1>
          <p className="text-muted-foreground mt-2">
            Explore all {sphereImages.length} immersive 360° sphere photos captured by drone
          </p>
        </div>

        {sphereImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sphereImages.map((image, index) => (
              <ImageCard key={image.id} image={image} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted rounded-lg">
            <p className="text-lg text-muted-foreground">
              No sphere images yet. Add images to public/images/sphere/
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
