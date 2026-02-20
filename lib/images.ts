import fs from "fs";
import path from "path";

export interface ImageData {
  id: string;
  filename: string;
  path: string;
  type: "sphere" | "panorama";
}

export function getImages(type: "sphere" | "panorama"): ImageData[] {
  const imagesDirectory = path.join(process.cwd(), "public", "images", type);
  
  try {
    if (!fs.existsSync(imagesDirectory)) {
      return [];
    }

    const filenames = fs.readdirSync(imagesDirectory);
    
    const images = filenames
      .filter((filename) => {
        const ext = path.extname(filename).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
      })
      .map((filename) => ({
        id: `${type}-${filename}`,
        filename,
        path: `/images/${type}/${filename}`,
        type,
      }));

    return images;
  } catch (error) {
    console.error(`Error reading ${type} images:`, error);
    return [];
  }
}

export function getAllImages(): ImageData[] {
  const sphereImages = getImages("sphere");
  const panoramaImages = getImages("panorama");
  return [...sphereImages, ...panoramaImages];
}
