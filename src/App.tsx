import React, { useState } from "react";
import './App.css'
import GameBoy from '@/components/GameBoy'


const App:  React.FC = () => {
  return (
    <div className="app-root">
      <GameBoy />
    </div>
  );
}

export default App
