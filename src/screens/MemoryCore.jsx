import React, { useState, useEffect, useRef } from 'react';
import SystemSidebar from '../components/SystemSidebar';
import AiTerminal from '../components/AiTerminal';
import { animate } from 'animejs';

const MEMORY_TIERS = [
  { levelMax: 3, name: 'ALPHA_ARCHIVE', lengthMin: 3, lengthMax: 4 },
  { levelMax: 7, name: 'BETA_ARCHIVE', lengthMin: 5, lengthMax: 6 },
  { levelMax: 10, name: 'OMEGA_ARCHIVE', lengthMin: 7, lengthMax: 8 }
];

function generateSequence(length) {
  let seq = '';
  for (let i = 0; i < length; i++) {
    seq += Math.random() > 0.5 ? '1' : '0';
  }
  return seq;
}

export default function MemoryCore({ setCurrentScreen, currentScreen, gameState, setGameState, addSystemLog, systemLogs, updateProgress }) {
  const safeGameState = gameState || { 
    lightRestoration: 0, 
    corruptionLevel: 92, 
    memoryComplete: false, 
    memoryLevel: 0, 
    memoryCoreHealth: 0 
  };
  
  const safeSystemLogs = systemLogs || [];
  
  const [phase, setPhase] = useState('INIT'); // INIT, MEMORIZE, RECONSTRUCT, SUCCESS
  const [targetSequence, setTargetSequence] = useState('');
  const [playerInput, setPlayerInput] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [showFailure, setShowFailure] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const displayContainerRef = useRef(null);
  const timerBarRef = useRef(null);
  const failureOverlayRef = useRef(null);
  const successContainerRef = useRef(null);
  const terminalRef = useRef(null);

  const handleHelp = (e) => {
    e?.preventDefault();
    terminalRef.current?.executeCommand('HELP');
  };
  
  const currentLevel = Math.min((safeGameState.memoryLevel || 0) + 1, 10);
  const currentTier = MEMORY_TIERS.find(t => currentLevel <= t.levelMax) || MEMORY_TIERS[2];
  
  // Base time of 1500ms, decreases by 100ms each level. Level 10 = 600ms!
  const currentDisplayMs = Math.max(500, 1500 - ((currentLevel - 1) * 100));

  // Expose context for AiTerminal
  const terminalContext = {
    tier: currentTier.name,
    level: currentLevel,
    sequenceLength: targetSequence.length,
    module: 'MEMORY'
  };

  const startLevel = () => {
    // Generate new sequence
    const length = Math.floor(Math.random() * (currentTier.lengthMax - currentTier.lengthMin + 1)) + currentTier.lengthMin;
    const seq = generateSequence(length);
    setTargetSequence(seq);
    setPlayerInput('');
    setPhase('MEMORIZE');
  };

  // Auto-start on mount or level change
  useEffect(() => {
    if (!safeGameState.memoryComplete && phase === 'INIT') {
      startLevel();
    }
  }, [safeGameState.memoryLevel, safeGameState.memoryComplete, phase]);

  // Handle Memorize Phase Timer
  useEffect(() => {
    if (phase === 'MEMORIZE') {
      if (timerBarRef.current) {
        animate(timerBarRef.current, {
          width: ['100%', '0%'],
          duration: currentDisplayMs,
          ease: 'linear'
        });
      }
      
      const timeoutId = setTimeout(() => {
        setPhase('RECONSTRUCT');
      }, currentDisplayMs);

      return () => clearTimeout(timeoutId);
    }
  }, [phase, currentDisplayMs]);

  const handleInput = (bit) => {
    if (phase !== 'RECONSTRUCT' || safeGameState.memoryComplete || showFailure) return;

    const newInput = playerInput + bit;
    setPlayerInput(newInput);

    if (newInput.length === targetSequence.length) {
      if (newInput === targetSequence) {
        handleSuccess();
      } else {
        handleError();
      }
    }
  };

  const handleSuccess = () => {
    setPhase('SUCCESS');
    
    if (displayContainerRef.current) {
      animate(displayContainerRef.current, {
        scale: [1, 1.05, 1],
        boxShadow: ['0 0 0px #00FF66', '0 0 30px #00FF66', '0 0 0px #00FF66'],
        duration: 500,
        ease: 'outElastic(1, .8)'
      });
    }

    if (addSystemLog) addSystemLog(`[SYS] SEQUENCE ${currentLevel} VERIFIED`);

    const isFinalStage = currentLevel >= 10;

    if (setGameState) {
      setGameState(prev => {
        let healthIncrease = 10;
        let lightIncrease = 2.5;
        let corruptionDecrease = 2.3;
        
        if (isFinalStage && !prev.memoryComplete) {
          healthIncrease = 100 - prev.memoryCoreHealth;
          // Global reward handled by updateProgress, so we don't apply it locally
        }

        return {
          ...prev,
          memoryLevel: isFinalStage ? prev.memoryLevel : prev.memoryLevel + 1,
          memoryCoreHealth: Math.min(100, (prev.memoryCoreHealth || 0) + healthIncrease),
          lightRestoration: isFinalStage ? prev.lightRestoration : Math.min(100, prev.lightRestoration + lightIncrease),
          corruptionLevel: isFinalStage ? prev.corruptionLevel : Math.max(0, prev.corruptionLevel - corruptionDecrease),
          memoryComplete: isFinalStage ? true : prev.memoryComplete
        };
      });
    }

    setTimeout(() => {
      if (isFinalStage) {
        if (updateProgress) updateProgress('memory', false);
      } else {
        setAttempts(3);
        setPhase('INIT');
      }
    }, 1500);
  };

  const handleError = () => {
    if (displayContainerRef.current) {
      animate(displayContainerRef.current, {
        translateX: [
          { to: -15, duration: 50 },
          { to: 15, duration: 50 },
          { to: -15, duration: 50 },
          { to: 15, duration: 50 },
          { to: 0, duration: 50 }
        ],
        ease: 'inOutQuad'
      });
    }

    setAttempts(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => {
          setShowFailure(true);
          if (failureOverlayRef.current) {
            animate(failureOverlayRef.current, {
              opacity: [0, 1],
              duration: 200,
              ease: 'linear'
            });
          }
        }, 500);
      } else {
        setTimeout(() => setPlayerInput(''), 600); // clear input to try again
      }
      return next;
    });
  };

  const handleRestartLevel = () => {
    setAttempts(3);
    setShowFailure(false);
    if (addSystemLog) addSystemLog(`[SYS] LEVEL ${currentLevel.toString().padStart(2, '0')} RESTARTED`);
    
    animate('.flicker-layer', {
      opacity: [0, 1],
      duration: 300,
      ease: 'linear'
    });
    
    startLevel();
  };

  const executeResetCore = () => {
    if (setGameState) {
      setGameState(prev => {
        const wasComplete = prev.modules?.memory || prev.memoryComplete;
        return {
          ...prev,
          memoryLevel: 0,
          memoryCoreHealth: 0,
          memoryComplete: false,
          modules: { ...(prev.modules || {}), memory: false },
          lightRestoration: wasComplete ? Math.max(0, prev.lightRestoration - 25) : prev.lightRestoration,
          corruptionLevel: wasComplete ? Math.min(92, prev.corruptionLevel + 23) : prev.corruptionLevel
        };
      });
    }
    setAttempts(3);
    setShowFailure(false);
    setShowResetConfirm(false);
    setPhase('INIT');
    if (addSystemLog) addSystemLog(`[SYS] MEMORY CORE RESET`);
    
    animate('.flicker-layer', {
      opacity: [0, 1, 0, 1],
      duration: 500,
      ease: 'steps(4)'
    });
  };

  useEffect(() => {
    if (safeGameState.memoryComplete && successContainerRef.current) {
      animate(successContainerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        ease: 'outExpo'
      });
    }
  }, [safeGameState.memoryComplete]);

  return (
    <>
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      <div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
        
        <header className="w-full flex justify-between items-center py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
          <div className="font-headline-lg text-headline-lg text-terminal-green uppercase tracking-tighter phosphor-glow">
              SOLSTICE://TURING
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleHelp} className="font-code-sm text-terminal-green hover:text-solstice-gold border border-terminal-green/30 px-2 py-1 transition-colors">HELP</button>
            <span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">terminal</span>
            <span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">settings</span>
          </div>
        </header>

        <main className="flex-grow flex gap-gutter overflow-hidden h-full">
          <SystemSidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} gameState={safeGameState} />
          
          <section className="flex-grow flex flex-col terminal-border bg-panel-gray overflow-hidden">
            <div className="bg-terminal-green text-surface px-4 py-2 flex justify-between items-center shrink-0">
              <h2 className="font-headline-md text-headline-md text-sm">MEMORY CORE // ARCHIVE_RESTORE</h2>
              <span className="font-label-caps text-label-caps">
                {safeGameState.memoryComplete ? 'STATUS: RESTORED' : 'STATUS: CORRUPTED'}
              </span>
            </div>
            
            <div className="flex-grow relative p-gutter flex flex-col items-center justify-center gap-6">
              
              {showFailure && (
                <div ref={failureOverlayRef} className="absolute inset-4 z-50 bg-warning-red/90 flex flex-col items-center justify-center p-8 terminal-border border-warning-red backdrop-blur-sm">
                  <h2 className="text-6xl font-headline-lg text-black mb-4 glitch-text">SIGNAL FAILURE</h2>
                  <p className="text-2xl font-headline-md text-black mb-8">ARCHIVE CORRUPTED</p>
                  <button onClick={handleRestartLevel} className="px-6 py-3 border-4 border-black text-black font-headline-lg text-headline-lg hover:bg-black hover:text-warning-red transition-colors active:scale-95">
                    RETRY LEVEL
                  </button>
                </div>
              )}

              {showResetConfirm && (
                <div className="absolute inset-4 z-50 bg-black/95 flex flex-col items-center justify-center p-8 terminal-border border-warning-red">
                  <h2 className="text-4xl font-headline-lg text-warning-red mb-4">WARNING</h2>
                  <p className="text-xl font-code-sm text-soft-green mb-8 text-center max-w-md">All Memory Core progress will be lost. Logic and Cipher cores will remain intact.</p>
                  <div className="flex gap-8">
                    <button onClick={executeResetCore} className="px-6 py-3 border-2 border-warning-red text-warning-red font-headline-lg text-headline-lg hover:bg-warning-red hover:text-black transition-colors">YES</button>
                    <button onClick={() => setShowResetConfirm(false)} className="px-6 py-3 border-2 border-terminal-green text-terminal-green font-headline-lg text-headline-lg hover:bg-terminal-green hover:text-black transition-colors">NO</button>
                  </div>
                </div>
              )}

              {!safeGameState.memoryComplete && (
                <div className="w-full max-w-2xl flex justify-between items-start mb-4 border-b border-terminal-green/30 pb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-terminal-green font-headline-md text-headline-md">{currentTier.name}</span>
                    <span className="text-soft-green font-label-caps text-label-caps">SEQUENCE RECONSTRUCTION</span>
                    <span className={`font-label-caps text-label-caps ${attempts === 1 ? 'text-warning-red animate-pulse' : 'text-terminal-green'}`}>
                      ATTEMPTS REMAINING: {attempts}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-solstice-gold font-headline-md text-headline-md">LEVEL {currentLevel}/10</span>
                    <span className="text-soft-green font-label-caps text-label-caps mb-2">CORE HEALTH: {safeGameState.memoryCoreHealth || 0}%</span>
                    <div className="flex gap-2">
                      <button onClick={handleRestartLevel} className="px-2 py-1 text-[10px] font-code-sm border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black transition-colors">RESTART LEVEL</button>
                      <button onClick={() => setShowResetConfirm(true)} className="px-2 py-1 text-[10px] font-code-sm border border-warning-red text-warning-red hover:bg-warning-red hover:text-black transition-colors">RESET MEMORY CORE</button>
                    </div>
                  </div>
                </div>
              )}

              {safeGameState.memoryComplete ? (
                <div ref={successContainerRef} className="w-full max-w-2xl terminal-border p-12 bg-surface-container relative flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-solstice-gold flex items-center justify-center animate-[pulse_2s_infinite]">
                    <span className="material-symbols-outlined text-6xl text-solstice-gold">done</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-solstice-gold tracking-widest">MEMORY CORE RESTORED</h3>
                  <div className="flex flex-col gap-2 font-code-sm text-code-sm text-terminal-green uppercase">
                    <p>Archive recovery complete.</p>
                    <p className="text-solstice-gold">LIGHT RESTORATION +25%</p>
                    <p className="text-soft-green">CORRUPTION REDUCED</p>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setCurrentScreen('MainHub')} className="px-6 py-2 border-2 border-terminal-green text-terminal-green font-headline-md text-headline-md hover:bg-terminal-green hover:text-black transition-colors">
                      RETURN TO HUB
                    </button>
                    <button onClick={() => setShowResetConfirm(true)} className="px-6 py-2 border-2 border-warning-red text-warning-red font-headline-md text-headline-md hover:bg-warning-red hover:text-black transition-colors">
                      RESET MEMORY CORE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl terminal-border p-8 bg-surface-container relative flex flex-col items-center gap-8">
                  <div className="absolute -top-3 left-6 bg-surface px-2 text-terminal-green font-code-sm uppercase">
                    {phase === 'MEMORIZE' ? 'MEMORIZE SEQUENCE' : phase === 'SUCCESS' ? 'SEQUENCE VERIFIED' : 'RECONSTRUCT SEQUENCE'}
                  </div>

                  {/* Display Area */}
                  <div ref={displayContainerRef} className={`w-full h-32 terminal-border bg-black flex items-center justify-center relative ${phase === 'MEMORIZE' ? 'border-solstice-gold' : 'border-terminal-green'}`}>
                    {phase === 'MEMORIZE' ? (
                      <span className="text-4xl font-headline-lg text-solstice-gold tracking-[1em] ml-[1em] animate-[pulse_0.3s_ease-in-out_infinite] opacity-80 mix-blend-screen">
                        {targetSequence}
                      </span>
                    ) : (
                      <div className="flex gap-4">
                        {Array.from({ length: targetSequence.length }).map((_, i) => (
                          <div key={i} className="w-12 h-16 border-b-4 border-terminal-green/50 flex items-center justify-center text-4xl font-headline-lg text-terminal-green">
                            {playerInput[i] !== undefined ? playerInput[i] : ''}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {phase === 'MEMORIZE' && (
                      <div className="absolute bottom-0 left-0 h-1 bg-solstice-gold w-full" ref={timerBarRef}></div>
                    )}
                  </div>

                  {/* Input Controls */}
                  <div className="flex gap-8">
                    <button 
                      onClick={() => handleInput('0')}
                      disabled={phase !== 'RECONSTRUCT'}
                      className={`w-24 h-24 border-2 font-headline-lg text-4xl transition-all ${phase === 'RECONSTRUCT' ? 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black active:scale-95' : 'border-terminal-green/20 text-terminal-green/20 cursor-not-allowed'}`}
                    >
                      0
                    </button>
                    <button 
                      onClick={() => handleInput('1')}
                      disabled={phase !== 'RECONSTRUCT'}
                      className={`w-24 h-24 border-2 font-headline-lg text-4xl transition-all ${phase === 'RECONSTRUCT' ? 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black active:scale-95' : 'border-terminal-green/20 text-terminal-green/20 cursor-not-allowed'}`}
                    >
                      1
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* AI Terminal Context Passed In */}
          <AiTerminal ref={terminalRef} contextualState={terminalContext} gameState={safeGameState} />
        </main>

        <footer className="h-32 terminal-border bg-surface shrink-0 p-4 font-code-sm text-code-sm flex flex-col gap-1 overflow-hidden relative">
          <div className="absolute top-0 right-4 px-2 bg-surface text-terminal-green opacity-50 text-[10px] uppercase font-headline-md">System Logs</div>
          <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar" id="log-container">
            {safeSystemLogs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-soft-green opacity-50">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.includes('UNLOCKED') ? 'text-solstice-gold' : log.includes('[SYS]') ? 'text-warning-red' : 'text-terminal-green'}>{log}</span>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
