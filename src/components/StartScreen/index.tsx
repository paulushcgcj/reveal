import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import bgImage from "@/assets/no-char-selected.png";
import babyBoy from "@/assets/baby-boy.png";
import babyGirl from "@/assets/baby-girl.png";
import bgmFile from "@/assets/sounds/bgm.mp3";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "@/types";
import { usePreloadAssets } from "@/hooks/usePreloadAssets";
import "./index.css";

interface StartScreenProps {
  onSelect: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pulseDirection, setPulseDirection] = useState<"boy" | "girl">("boy");
  const bgm = useRef(new Audio(bgmFile));
    const { t } = useTranslation();

  const updateScale = () => {
    const container = containerRef.current;
    if (!container) return;
    const { offsetWidth, offsetHeight } = container;
    const scaleX = offsetWidth / DESIGN_WIDTH;
    const scaleY = offsetHeight / DESIGN_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  };

  const isReady = usePreloadAssets([bgImage, babyBoy, babyGirl], [bgmFile]);

  const handleStart = () => {
    onSelect();
  };

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    bgm.current.loop = true;
    bgm.current.volume = 0.3;
    bgm.current.play().catch(() => {
      // iOS requires user interaction first
      console.log("Background music blocked until user interacts.");
    });

    const interval = setInterval(() => {
      setPulseDirection((prev) => (prev === "boy" ? "girl" : "boy"));
    }, 1000);

    return () => {
      clearInterval(interval);
      bgm.current.pause();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const handleKey = () => handleStart();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isReady]);


  useEffect(() => {
    if (isReady) {
      updateScale();
    }
  }, [isReady]);

  return (
    <div
      ref={containerRef}
      className="main-screen-container"
      onClick={handleStart}
      onTouchStart={handleStart}
    >
      {isReady ? (
        <div
          className="main-screen-inner"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          <img src={bgImage} alt="Background" className="bg-image" />
          <p className="title-text">{t("title")}</p>

          <img
            src={babyBoy}
            alt="Baby Boy"
            className={`overlay baby-boy ${
              pulseDirection === "boy" ? "pulse-grow" : "pulse-shrink"
            }`}
          />
          <img
            src={babyGirl}
            alt="Baby Girl"
            className={`overlay baby-girl ${
              pulseDirection === "girl" ? "pulse-grow" : "pulse-shrink"
            }`}
          />
          <p className="press-start-text">{t("pressStart")}</p>
        </div>
      ) : (
        <div className="main-screen-loading">
          <p>{t("loading")}</p>
        </div>
      )}
    </div>
  );
};

export default StartScreen;
