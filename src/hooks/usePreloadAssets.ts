import { useEffect, useState } from "react";

type AssetType = string[];

export const usePreloadAssets = (images: AssetType, sounds: AssetType) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let completed = 0;
    const total = images.length + sounds.length;

    const checkDone = () => {
      completed++;
      if (completed >= total) setLoaded(true);
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkDone;
      img.onerror = checkDone;
    });

    sounds.forEach((src) => {
      const audio = new Audio();
      audio.src = src;
      audio.oncanplaythrough = checkDone;
      audio.onerror = checkDone;
    });
  }, [images, sounds]);

  return loaded;
}
