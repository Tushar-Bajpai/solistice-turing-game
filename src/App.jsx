import React, { useState, useEffect } from 'react';
import AiCore from './screens/AiCore';
import CipherCore from './screens/CipherCore';
import MainHub from './screens/MainHub';
import MemoryCore from './screens/MemoryCore';
import ReconstructionCore from './screens/ReconstructionCore';
import RestorationComplete from './screens/RestorationComplete';
import Shader from './screens/Shader';
import { GameProvider, useGame } from './context/GameContext';
import { animate } from 'animejs';

const screens = {
  MainHub,
  AiCore,
  CipherCore,
  MemoryCore,
  ReconstructionCore,
  RestorationComplete,
  Shader
};

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('MainHub');
  const { gameState } = useGame();
  
  const ScreenComponent = screens[currentScreen];
  const progress = gameState.solsticeProgress;

  let themeClass = 'theme-tier-0';
  if (progress >= 100) themeClass = 'theme-tier-4';
  else if (progress >= 75) themeClass = 'theme-tier-3';
  else if (progress >= 50) themeClass = 'theme-tier-2';
  else if (progress >= 25) themeClass = 'theme-tier-1';

  useEffect(() => {
    let targetProps = {};
    if (progress >= 100) targetProps = { brightness: 1.2, crt: 0.4, glow: 8 };
    else if (progress >= 75) targetProps = { brightness: 1.1, crt: 0.3, glow: 6 };
    else if (progress >= 50) targetProps = { brightness: 1.0, crt: 0.25, glow: 4 };
    else if (progress >= 25) targetProps = { brightness: 0.8, crt: 0.15, glow: 2 };
    else targetProps = { brightness: 0.6, crt: 0.1, glow: 1 };

    animate(document.documentElement, {
       '--theme-brightness': targetProps.brightness,
       '--theme-crt-opacity': targetProps.crt,
       '--theme-glow-strength': targetProps.glow + 'px',
       duration: 2000,
       easing: 'easeInOutSine'
    });
  }, [progress]);

  return (
    <div className={`font-body-md text-body-md text-terminal-green uppercase selection:bg-terminal-green selection:text-surface relative w-full h-full min-h-screen bg-[#050505] app-theme-wrapper ${themeClass}`}>
      <div className="h-full">
        <ScreenComponent 
          setCurrentScreen={setCurrentScreen} 
          currentScreen={currentScreen} 
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
