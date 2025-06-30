import { type FC, useState } from "react";
import StartScreen from "@/components/StartScreen";
import SelectScreen from "@/components/SelectScreen";
import ResultScreen from "@/components/ResultScreen";
import { type Gender } from "@/types";
import "./index.css";

const GameBoy: FC = () => {
  const [stage, setStage] = useState<"intro" | "select" | "result">("intro");
  const [selectedGender, setSelectedGender] = useState<Gender>("none");
  const expectedGender: Gender = "girl";
  const [isFadingOut, setIsFadingOut] = useState(false);

  const transitionTo = (stage: "intro" | "select" | "result") => {
    setIsFadingOut(true);
    setTimeout(() => {
      setStage(stage);
      setIsFadingOut(false);
    }, 400);
  };

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
    transitionTo("result");
  };

  return (
    <div className="app-root">
      {isFadingOut && <div className="screen-flash" />}
      {stage === "intro" && (
        <div className={`screen-wrapper ${isFadingOut ? "fade-out" : ""}`}>
          <StartScreen onSelect={() => transitionTo("select")} />
        </div>
      )}

      {stage === "select" && (
        <div className="screen-wrapper">
          <SelectScreen onSelect={handleGenderSelect} />
        </div>
      )}

      {stage === "result" && (
        <div className="screen-wrapper">
          <ResultScreen
            key={`${selectedGender}-${expectedGender}`}
            expected={expectedGender}
            selected={selectedGender}
            onRestart={() => transitionTo("intro")}
          />
        </div>
      )}
    </div>
  );
};

export default GameBoy;
