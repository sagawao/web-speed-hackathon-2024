import fs from 'node:fs/promises';
import type { ReadImageFunction } from './ReadImageFunction';

export const readPng: ReadImageFunction = async (imagePath) => {
  const imageBinary = await fs.readFile(imagePath);
  // const jimp = await Jimp.read(imageBinary);

  return await getImageData(imageBinary.toString('base64'));
};

function getImageData(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (!ctx) return
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = reject;
    img.src = url;
  });
}