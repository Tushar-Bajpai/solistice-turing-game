import React, { useState, useEffect } from 'react';
import AiCore from './screens/AiCore';
import CipherCore from './screens/CipherCore';
import MainHub from './screens/MainHub';
import MemoryCore from './screens/MemoryCore';
import ReconstructionCore from './screens/ReconstructionCore';
import RestorationComplete from './screens/RestorationComplete';
import Shader from './screens/Shader';

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
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('solsticeGameState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      lightRestoration: 0,
      corruptionLevel: 92,
      logicComplete: false,
      modules: { logic: false, memory: false, cipher: false, ai: false }
    };
  });

  useEffect(() => {
    localStorage.setItem('solsticeGameState', JSON.stringify(gameState));
  }, [gameState]);

  const [systemLogs, setSystemLogs] = useState([]);

  const addSystemLog = (log) => {
    setSystemLogs(prev => [...prev, log]);
  };

  const updateProgress = (moduleName, skipRewards = false) => {
    setGameState(prev => {
      if (prev.modules[moduleName]) return prev;

      let newLight = prev.lightRestoration;
      let newCorruption = prev.corruptionLevel;

      if (!skipRewards) {
        newLight += 25;
        newCorruption = moduleName === 'ai' ? 0 : Math.max(0, prev.corruptionLevel - 23);
      } else {
        if (moduleName === 'ai') newCorruption = 0;
      }

      addSystemLog(`${moduleName.toUpperCase()} CORE RESTORED`);

      return {
        ...prev,
        lightRestoration: newLight,
        corruptionLevel: newCorruption,
        logicComplete: moduleName === 'logic' ? true : prev.logicComplete,
        modules: {
          ...prev.modules,
          [moduleName]: true
        }
      };
    });
  };

  const ScreenComponent = screens[currentScreen];

  return (
    <div className="font-body-md text-body-md text-terminal-green uppercase selection:bg-terminal-green selection:text-surface relative w-full h-full min-h-screen bg-[#050505]">
      
      {/* Screen container */}
      <div className="h-full">
        <ScreenComponent 
          setCurrentScreen={setCurrentScreen} 
          currentScreen={currentScreen} 
          gameState={gameState}
          setGameState={setGameState}
          updateProgress={updateProgress}
          addSystemLog={addSystemLog}
          systemLogs={systemLogs}
        />
      </div>
      
    </div>
  );
}

export default App;
