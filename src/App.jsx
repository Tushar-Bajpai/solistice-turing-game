import React, { useState } from 'react';
import AiCore from './screens/AiCore';
import CipherCore from './screens/CipherCore';
import MainHub from './screens/MainHub';
import MemoryCore from './screens/MemoryCore';
import ReconstructionCore from './screens/ReconstructionCore';
import RestorationComplete from './screens/RestorationComplete';
import Shader from './screens/Shader';
import { GameProvider } from './context/GameContext';

const screens = {
  MainHub,
  AiCore,
  CipherCore,
  MemoryCore,
  ReconstructionCore,
  RestorationComplete,
  Shader
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('MainHub');

  const ScreenComponent = screens[currentScreen];

  return (
    <GameProvider>
      <div className="font-body-md text-body-md text-terminal-green uppercase selection:bg-terminal-green selection:text-surface relative w-full h-full min-h-screen bg-[#050505]">
        
        {/* Screen container */}
        <div className="h-full">
          <ScreenComponent 
            setCurrentScreen={setCurrentScreen} 
            currentScreen={currentScreen} 
          />
        </div>
        
      </div>
    </GameProvider>
  );
}

export default App;
