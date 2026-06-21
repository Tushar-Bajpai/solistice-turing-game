import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const DEFAULT_STATE = {
  solsticeProgress: 0,
  corruptionLevel: 92,
  completedModules: [],
  unlockedModules: ["logic"],
  reconstructionUnlocked: false
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
          unlockedModules: parsed.unlockedModules ?? DEFAULT_STATE.unlockedModules,
          reconstructionUnlocked: parsed.reconstructionUnlocked ?? DEFAULT_STATE.reconstructionUnlocked
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

      let newUnlocked = [...prev.unlockedModules];
      if (moduleName === 'logic' && !newUnlocked.includes('memory')) newUnlocked.push('memory');
      if (moduleName === 'memory' && !newUnlocked.includes('cipher')) newUnlocked.push('cipher');
      if (moduleName === 'cipher' && !newUnlocked.includes('ai')) newUnlocked.push('ai');

      return {
        ...prev,
        solsticeProgress: Math.min(100, newLight),
        corruptionLevel: newCorruption,
        completedModules: [...prev.completedModules, moduleName],
        unlockedModules: newUnlocked
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

  useEffect(() => {
    if (gameState.solsticeProgress >= 50) {
      const interval = setInterval(() => {
        const bgLogs = [
          "OPTIMIZING NEURAL PATHWAYS...",
          "RECALIBRATING SECTOR INTEGRITY",
          "FLUSHING CORRUPTED MEMORY BLOCKS",
          "BACKGROUND DEFRAGMENTATION COMPLETE",
          "SYNCHRONIZING TURING KNOWLEDGE BASE",
          "VERIFYING LIGHT RESTORATION METRICS"
        ];
        const randomLog = bgLogs[Math.floor(Math.random() * bgLogs.length)];
        addSystemLog(`[SYS_DAEMON] ${randomLog}`);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [gameState.solsticeProgress]);

  useEffect(() => {
    const corruption = gameState.corruptionLevel;
    if (corruption >= 25) {
      let intervalMs = 12000;
      let logs = [];

      if (corruption >= 100) {
        intervalMs = 2000;
        logs = [
          "CRITICAL: SYSTEM INTEGRITY COMPROMISED", 
          "FATAL EXCEPTION AT 0x00F32", 
          "CORRUPTION AT MAXIMUM CAPACITY", 
          "INITIATING EMERGENCY LOCKDOWN PROTOCOLS"
        ];
      } else if (corruption >= 75) {
        intervalMs = 4000;
        logs = [
          "WARNING: HEAVY CORRUPTION DETECTED", 
          "MEMORY LEAK IN SECTOR 7", 
          "UNAUTHORIZED OVERRIDE ATTEMPTED", 
          "DATA PACKET LOSS: 84%"
        ];
      } else if (corruption >= 50) {
        intervalMs = 6000;
        logs = [
          "FREQUENT ANOMALIES DETECTED", 
          "LATENCY SPIKE DETECTED", 
          "CONNECTION UNSTABLE", 
          "SYNAPSE MISFIRE LOGGED"
        ];
      } else if (corruption >= 25) {
        intervalMs = 12000;
        logs = [
          "MINOR PACKET LOSS", 
          "SUB-ROUTINE DELAYED", 
          "SYSTEM TEMPERATURE ELEVATED", 
          "MINOR WARNING: CACHE MISS"
        ];
      }

      const interval = setInterval(() => {
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        addSystemLog(`[SYS_WARN] ${randomLog}`);
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [gameState.corruptionLevel]);

  useEffect(() => {
    if (gameState.solsticeProgress >= 100 && !gameState.reconstructionUnlocked) {
      setGameState(prev => ({ ...prev, reconstructionUnlocked: true }));
      addSystemLog(`[SUCCESS]\nSOLSTICE ACHIEVED\n\nLIGHT RESTORATION COMPLETE\nSYSTEM STABILIZED`);
      setTimeout(() => addSystemLog(`[RESTORE]\nRECONSTRUCTION CORE UNLOCKED`), 2000);
    }
  }, [gameState.solsticeProgress, gameState.reconstructionUnlocked]);

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
