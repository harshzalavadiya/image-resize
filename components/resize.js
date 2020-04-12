import loadImage from "blueimp-load-image";
import { gps } from "exifr/dist/mini.umd";

export function resizeImage(file, max = 3000) {
  return new Promise((resolve) => {
    loadImage(
      file,
      (img, data) => {
        try {
          if (data?.exif) {
            // fix orientation
            if (data.exif[274]) {
              loadImage.writeExifData(data.imageHead, data, "Orientation", 1);
            }

            // replace imageHead to restore exif of original image
            img.toBlob((blob) => {
              loadImage.replaceHead(blob, data.imageHead, resolve);
            }, file.type);
          } else {
            img.toBlob(resolve);
          }
        } catch (e) {
          img.toBlob(resolve);
        }
      },
      {
        meta: true,
        canvas: true,
        orientation: true,
        maxWidth: max,
        maxHeight: max,
      }
    );
  });
}

export async function parseGPS(file) {
  try {
    return await gps(file);
  } catch (e) {
    console.error(e);
  }
}

export function resizeMultiple(files) {
  return Promise.all(
    files.map(async (file) => {
      try {
        const [blob, gps] = await Promise.all([
          resizeImage(file),
          parseGPS(file),
        ]);
        return [URL.createObjectURL(blob), gps, blob];
      } catch (e) {
        return [];
      }
    })
  );
}

