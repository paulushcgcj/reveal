import React, { useEffect, useRef, useState } from "react";
import bgImage from "@/assets/no-char-selected.png";
import babyBoy from "@/assets/baby-boy.png";
import babyGirl from "@/assets/baby-girl.png";
import bgmFile from "@/assets/sounds/bgm.mp3";
import { DESIGN_WIDTH, DESIGN_HEIGHT, type Gender } from "@/types";
import './index.css'


interface ResultScreenProps {
  expected: Gender | null;
  selected: Gender | null;
}

const ResultScreen:  React.FC<ResultScreenProps> = ({ expected, selected }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resultText, setResultText] = useState("");
  const [scale, setScale] = useState(1);
   const bgm = useRef(new Audio(bgmFile));

  const updateScale = () => {
    const container = containerRef.current;
    if (!container) return;
    const { offsetWidth, offsetHeight } = container;
    const scaleX = offsetWidth / DESIGN_WIDTH;
    const scaleY = offsetHeight / DESIGN_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  };

   const handleStart = () => {
    
  };

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
      setResultText("We don't know yet, check back later!");
    } else if (selected === expected) {
      setResultText(`It's a ${expected.toUpperCase()}!`);
    } else {
      setResultText(`Oops, it was a ${expected.toUpperCase()}!`);
    }
    console.log(`Expected: ${expected}, Selected: ${selected}`);
  }, [selected, expected]);
  
  return (
  <div
      ref={containerRef}
      className="main-screen-container"
      onClick={handleStart}
      onTouchStart={handleStart}
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

export default ResultScreen
