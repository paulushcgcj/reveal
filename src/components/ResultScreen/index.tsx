import { type FC, useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import bgImage from "@/assets/no-char-selected.png";
import babyBoy from "@/assets/baby-boy.png";
import babyGirl from "@/assets/baby-girl.png";
import bgmFile from "@/assets/sounds/bgm.mp3";
import { DESIGN_WIDTH, DESIGN_HEIGHT, type Gender } from "@/types";
import { usePreloadAssets } from "@/hooks/usePreloadAssets";
import "./index.css";

interface ResultScreenProps {
  expected: Gender | null;
  selected: Gender | null;
  onRestart: () => void;
}

const ResultScreen: FC<ResultScreenProps> = ({
  expected,
  selected,
  onRestart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resultText, setResultText] = useState("");
  const [started, setStarted] = useState(false);
  const [canInteract, setCanInteract] = useState(false);
  const [scale, setScale] = useState(1);
  const bgm = useRef(new Audio(bgmFile));
  const { t } = useTranslation();

  const isReady = usePreloadAssets([bgImage, babyBoy, babyGirl], [bgmFile]);

  const updateScale = () => {
    const container = containerRef.current;
    if (!container) return;
    const { offsetWidth, offsetHeight } = container;
    const scaleX = offsetWidth / DESIGN_WIDTH;
    const scaleY = offsetHeight / DESIGN_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  };

  const handleStart = useCallback(() => {
    if (started) return;
    setStarted(true);
    onRestart();
  }, [started, onRestart]);

  const showBaby = expected ? expected : null;

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    bgm.current.loop = true;
    bgm.current.volume = 0.3;
    bgm.current.play().catch(() => {
      console.log("Background music blocked.");
    });

    return () => {
      bgm.current.pause();
    };
  }, []);

  useEffect(() => {
    if (!expected) {
      setResultText(t("unknown"));
    } else if (selected === expected) {
      setResultText(
        t("itsA", { gender: t(expected.toLowerCase()).toUpperCase() })
      );
    } else {
      setResultText(
        t("oops", { gender: t(expected.toLowerCase()).toUpperCase() })
      );
    }
    console.log(`Expected: ${expected}, Selected: ${selected}`);
  }, [selected, expected, t]);

  useEffect(() => {
    if (!isReady && !canInteract) return;
    const handleKey = () => handleStart();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isReady, handleStart, canInteract]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanInteract(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={containerRef}
      className="main-screen-container"
      onClick={() => canInteract && handleStart()}
      onTouchStart={() => canInteract && handleStart()}
    >
      <div
        className="main-screen-inner"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        <img src={bgImage} alt="Background" className="bg-image" />

        {showBaby === "boy" && (
          <img src={babyBoy} alt="Boy" className="overlay baby-boy" />
        )}
        {showBaby === "girl" && (
          <img src={babyGirl} alt="Girl" className="overlay baby-girl" />
        )}

        <p className="result-text">{resultText}</p>
      </div>
    </div>
  );
};

export default ResultScreen;
