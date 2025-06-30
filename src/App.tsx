import { type FC } from "react";
import './App.css'
import GameBoy from '@/components/GameBoy'


const App: FC = () => {
  return (
    <div className="app-root">
      <GameBoy />
    </div>
  );
}

export default App
