import {type FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import bgImage from "@/assets/no-char-selected.png";
import babyBoy from "@/assets/baby-boy.png";
import babyGirl from "@/assets/baby-girl.png";
import hoverSoundFile from "@/assets/sounds/hover.mp3";
import selectSoundFile from "@/assets/sounds/select.mp3";
import bgmFile from "@/assets/sounds/bgm.mp3";
import { DESIGN_WIDTH, DESIGN_HEIGHT, type Gender } from "@/types";
import "./index.css";
interface SelectScreenProps {
  onSelect: (gender: Gender) => void;
}

const SelectScreen: FC<SelectScreenProps> = ({ onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState<Gender | null>(null);
  const [selected, setSelected] = useState<Gender | null>(null);
  const [currentFocus, setCurrentFocus] = useState<Gender>("none");
  const { t } = useTranslation();
  

  const hoverSound = useRef(new Audio(hoverSoundFile));
  const selectSound = useRef(new Audio(selectSoundFile));
  const bgm = useRef(new Audio(bgmFile));

  const updateScale = () => {
    const container = containerRef.current;
    if (!container) return;
    const { offsetWidth, offsetHeight } = container;
    const scaleX = offsetWidth / DESIGN_WIDTH;
    const scaleY = offsetHeight / DESIGN_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  };
  
  const playHover = () => {
    const s = hoverSound.current.cloneNode() as HTMLAudioElement;
    s.volume = 0.5;
    s.play().catch(() => {});
  };

  const playSelect = () => {
    const s = selectSound.current.cloneNode() as HTMLAudioElement;
    s.volume = 0.7;
    s.play().catch(() => {});
  };

  const handleHover = (gender: Gender) => {
    if (hovered !== gender) {
      playHover();
    }
    setHovered(gender);
    setCurrentFocus(gender);
  };

  const handleSelect = (gender: Gender) => {
    playSelect();
    setSelected(gender);
    onSelect(gender);
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

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setCurrentFocus("boy");
        playHover();
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setCurrentFocus("girl");
        playHover();
      } else if (e.key === "Enter" || e.key === " ") {
        handleSelect(currentFocus);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      bgm.current.pause();
    };
  }, [currentFocus]);


  return (
    <div ref={containerRef} className="select-screen-container">
    <div
        className="select-screen-inner"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
      <img src={bgImage} alt="Background" className="bg-image" />

      <p className="gender-title">{t('chooseGender')}</p>

      <img 
        src={babyBoy} 
        alt="Baby Boy" 
        className={`overlay baby-boy 
            ${hovered === "boy" ? "hovered" : ""}
            ${hovered === "girl" ? "grayscale" : ""}
            ${selected === "boy" ? "selected" : ""}
            ${currentFocus === "boy" ? "focused" : ""}
          `}
          onMouseEnter={() => handleHover("boy")}
          onMouseLeave={() => setHovered(null)}
          onTouchStart={() => handleHover("boy")}
          onTouchEnd={() => setHovered(null)}
          onClick={() => handleSelect("boy")}
        />
      <img 
          src={babyGirl} 
          alt="Baby Girl" 
          className={`overlay baby-girl 
            ${hovered === "girl" ? "hovered" : ""}
            ${hovered === "boy" ? "grayscale" : ""}
            ${selected === "girl" ? "selected" : ""}
            ${currentFocus === "girl" ? "focused" : ""}
          `}
          onMouseEnter={() => handleHover("girl")}
          onMouseLeave={() => setHovered(null)}
          onTouchStart={() => handleHover("girl")}
          onTouchEnd={() => setHovered(null)}
          onClick={() => handleSelect("girl")}
        />
    </div>
    </div>
  );
};

export default SelectScreen;
