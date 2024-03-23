import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

const _Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  width: 100%;
`;

export const HeroImage: React.FC = () => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const updateImage = useCallback(({ height, width }: { height: number; width: number }) => {
    const image = imageRef.current;
    if (image === null) {
      return;
    }
    image.width = width;
    image.height = height;
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (image === null) {
      return;
    }
    // width が 4096 / dpr の 16:9 の画像として描画する。
    const width = 4096 / window.devicePixelRatio;
    const height = (width / 16) * 9;
    const imageWidth = image.clientWidth;
    const imageHeight = (imageWidth / 16) * 9;

    updateImage({
      height: imageHeight,
      width: imageWidth,
    });
  }, [imageRef, updateImage]);

  useEffect(() => {
    const resize = () => {
      const image = imageRef.current;
      if (image == null) {
        return;
      }

      const width = image.clientWidth;
      const height = (image.clientWidth / 16) * 9;
      updateImage({
        height,
        width,
      });
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [updateImage]);

  return (
    <_Wrapper>
      <_Image ref={imageRef} alt="Cyber TOON" src='/assets/ct_heroimg.jpg' />
    </_Wrapper>
  );
};
