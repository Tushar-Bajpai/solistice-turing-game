import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const DEFAULT_STATE = {
  solsticeProgress: 0,
  corruptionLevel: 92,
  completedModules: [],
  unlockedModules: ["logic"]
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('solsticeGameState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          solsticeProgress: parsed.solsticeProgress ?? parsed.lightRestoration ?? DEFAULT_STATE.solsticeProgress,
          corruptionLevel: parsed.corruptionLevel ?? DEFAULT_STATE.corruptionLevel,
          completedModules: parsed.completedModules ?? (parsed.modules ? Object.keys(parsed.modules).filter(k => parsed.modules[k]) : DEFAULT_STATE.completedModules),
          unlockedModules: parsed.unlockedModules ?? DEFAULT_STATE.unlockedModules
        };
      } catch (_) {
        // Fallback to DEFAULT_STATE
      }
    }
    return DEFAULT_STATE;
  });

  const [systemLogs, setSystemLogs] = useState([]);

  const addSystemLog = (log) => {
    setSystemLogs(prev => [...prev, { text: log, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    localStorage.setItem('solsticeGameState', JSON.stringify(gameState));
  }, [gameState]);

  const updateProgress = (moduleName, skipRewards = false) => {
    setGameState(prev => {
      if (prev.completedModules.includes(moduleName)) return prev;

      let newLight = prev.solsticeProgress;
      let newCorruption = prev.corruptionLevel;

      if (!skipRewards) {
        newCorruption = moduleName === 'ai' ? 0 : Math.max(0, prev.corruptionLevel - 23);
      } else {
        if (moduleName === 'ai') newCorruption = 0;
      }

      addSystemLog(`${moduleName.toUpperCase()} CORE RESTORED`);

      return {
        ...prev,
        solsticeProgress: Math.min(100, newLight),
        corruptionLevel: newCorruption,
        completedModules: [...prev.completedModules, moduleName]
      };
    });
  };

  const updateSolstice = (amount = 2.5) => {
    setGameState(prev => {
      const newProgress = Math.min(100, prev.solsticeProgress + amount);
      return { ...prev, solsticeProgress: newProgress };
    });
  };

  const updateCorruption = (amount) => {
    setGameState(prev => {
      const newCorruption = Math.max(0, Math.min(100, prev.corruptionLevel + amount));
      return { ...prev, corruptionLevel: newCorruption };
    });
  };

  const revokeProgress = (moduleName) => {
    setGameState(prev => {
      if (!prev.completedModules.includes(moduleName)) return prev;

      addSystemLog(`${moduleName.toUpperCase()} CORE RESET`);

      return {
        ...prev,
        solsticeProgress: Math.max(0, prev.solsticeProgress - 25),
        corruptionLevel: Math.min(92, prev.corruptionLevel + 23),
        completedModules: prev.completedModules.filter(m => m !== moduleName)
      };
    });
  };

  return (
    <GameContext.Provider value={{ gameState, setGameState, updateProgress, revokeProgress, updateSolstice, updateCorruption, systemLogs, addSystemLog }}>
      {children}
    </GameContext.Provider>
  );
};
