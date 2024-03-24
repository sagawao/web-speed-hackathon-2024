import fs from 'node:fs/promises';
import path from 'node:path';
// import { Buffer } from 'buffer';
//  

import type { WriteImageFunction } from './WriteImageFunction';

export const writePng: WriteImageFunction = async ({ filepath, imageData }) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  if (!ctx) return;
  ctx.putImageData(imageData, 0, 0);

  const imageBinary = Uint8Array.from(atob(canvas.toDataURL('image/png').split(',')[1] ?? ''), c => c.charCodeAt(0));

  await fs.mkdir(path.dirname(filepath), { recursive: true }).catch(() => { });
  await fs.writeFile(filepath, imageBinary);
};
