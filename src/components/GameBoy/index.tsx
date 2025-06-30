import React, { useState } from "react";
import StartScreen from '@/components/StartScreen'
import SelectScreen from '@/components/SelectScreen'
import ResultScreen from "@/components/ResultScreen"
import { type Gender } from "@/types";
import './index.css'

const GameBoy:  React.FC = () => {
  const [stage, setStage] = useState<"intro" | "select" | "result">("intro");
  const [selectedGender, setSelectedGender] = useState<Gender>("none")
  const expectedGender: Gender = "girl"; // This can be set dynamically or passed as a prop
  const [isFadingOut, setIsFadingOut] = useState(false);

  const transitionTo = (stage: "intro" | "select" | "result") => {
    setIsFadingOut(true);
    setTimeout(() => {
      setStage(stage);
      setIsFadingOut(false);
    }, 400);
  }

  const handleStart = () => {
    transitionTo("select");
  }

   const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
    transitionTo("result");
  };

  return (
    <div className="app-root">
      {isFadingOut && <div className="screen-flash" />}
      {stage === "intro" && (
        <div className={`screen-wrapper ${isFadingOut ? "fade-out" : ""}`}>
          <StartScreen onSelect={handleStart} />
        </div>
      )}

      {stage === "select" && (
        <div className="screen-wrapper">
          <SelectScreen onSelect={handleGenderSelect} />
        </div>
      )}

      {stage === "result" && (
        <div className="screen-wrapper">
          <ResultScreen key={`${selectedGender}-${expectedGender}`} expected={expectedGender} selected={selectedGender} />
        </div>
      )}
    </div>
  );
}

export default GameBoy
