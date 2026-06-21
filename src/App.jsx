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
  const corruption = gameState.corruptionLevel;

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

  useEffect(() => {
    if (corruption >= 75) {
      const interval = setInterval(() => {
        if (Math.random() > 0.4) {
          animate('.app-theme-wrapper', {
            translateX: [0, -4, 4, -2, 2, 0],
            skewX: [0, -1, 1, 0],
            duration: 300,
            easing: 'easeInOutSine'
          });
        }
      }, corruption >= 100 ? 1500 : 3500);
      return () => clearInterval(interval);
    }
  }, [corruption]);

  return (
    <div className={`font-body-md text-body-md text-terminal-green uppercase selection:bg-terminal-green selection:text-surface relative w-full h-full min-h-screen bg-[#050505] app-theme-wrapper ${themeClass}`}>
      <div className="h-full">
        <ScreenComponent 
          setCurrentScreen={setCurrentScreen} 
          currentScreen={currentScreen} 
        />
      </div>

      {/* Critical Corruption Overlay */}
      {corruption >= 100 && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-start pt-24">
          <div className="absolute inset-0 bg-warning-red/10 crt-flicker mix-blend-screen" />
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(255,51,51,0.3)] animate-pulse" />
          
          <div className="bg-warning-red/90 text-black px-8 py-4 md:px-24 md:py-6 font-headline-lg text-2xl md:text-5xl tracking-[0.2em] md:tracking-[0.5em] text-center border-y-4 border-black crt-flicker relative shadow-[0_0_50px_rgba(255,51,51,0.8)]">
            CRITICAL CORRUPTION DETECTED
          </div>
        </div>
      )}
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
