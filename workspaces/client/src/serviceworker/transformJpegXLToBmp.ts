import { init as jsquashInit } from '@jsquash/jxl/decode';
import fs from 'fs';

export async function transformJpegXLToBmp(response: Response): Promise<Response> {
  const jsquashWasmBinary = fs.readFileSync('@jsquash/jxl/codec/dec/jxl_dec.wasm');
  const { decode } = await jsquashInit(undefined, {
    locateFile: () => { },
    wasmBinary: jsquashWasmBinary,
  });

  const imageData = decode(await response.arrayBuffer())!;
  const bmpBinary = new Uint8Array(imageData.data.buffer);

  return new Response(bmpBinary, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'image/bmp',
    },
  });
}
