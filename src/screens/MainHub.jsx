import React, { useState, useEffect, useRef } from 'react';
import SystemSidebar from '../components/SystemSidebar';
import AiTerminal from '../components/AiTerminal';
import QuizTerminal from '../components/QuizTerminal';
import { animate } from 'animejs';
import { useGame } from '../context/GameContext';

export const LOGIC_TIERS = [
  { levelMax: 3, name: 'ALPHA_TIER', brief: 'BASIC LOGIC PATHWAYS', allowed: ['AND', 'OR'] },
  { levelMax: 6, name: 'BETA_TIER', brief: 'ADVANCED DIFFERENTIALS', allowed: ['AND', 'OR', 'XOR'] },
  { levelMax: 9, name: 'GAMMA_TIER', brief: 'INVERTED LOGIC SYNTHESIS', allowed: ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'] },
  { levelMax: 12, name: 'OMEGA_TIER', brief: 'COMPOUND RECONSTRUCTION', allowed: ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'] }
];

export const PUZZLES = [
  // Tier 1 (Levels 1-3)
  { level: 1, a: 0, b: 0, target: 0, solution: 'AND' },
  { level: 2, a: 1, b: 0, target: 1, solution: 'OR' },
  { level: 3, a: 1, b: 1, target: 1, solution: 'OR' },
  // Tier 2 (Levels 4-6)
  { level: 4, a: 0, b: 1, target: 1, solution: 'XOR' },
  { level: 5, a: 1, b: 1, target: 0, solution: 'XOR' },
  { level: 6, a: 1, b: 0, target: 1, solution: 'OR' },
  // Tier 3 (Levels 7-9)
  { level: 7, a: 1, b: 1, target: 0, solution: 'NAND' },
  { level: 8, a: 0, b: 0, target: 1, solution: 'NOR' },
  { level: 9, a: 1, b: 1, target: 1, solution: 'XNOR' },
  // Tier 4 (Level 10 Boss) - Boss levels share the same UI but display differently
  { level: 10, stage: 1, a: 1, b: 0, target: 0, solution: 'AND', instruction: 'PHASE 1/3: RESOLVE TO 0' },
  { level: 10, stage: 2, a: 0, b: 1, target: 1, solution: 'OR', instruction: 'PHASE 2/3: RESOLVE TO 1' },
  { level: 10, stage: 3, a: 0, b: 1, target: 1, solution: 'XOR', instruction: 'PHASE 3/3: SYNTHESIZE PREVIOUS PATHWAYS' }
];

const GATES = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'];

function evaluateGate(gate, a, b) {
  switch (gate) {
    case 'AND': return (a && b) ? 1 : 0;
    case 'OR': return (a || b) ? 1 : 0;
    case 'XOR': return (a !== b) ? 1 : 0;
    case 'NAND': return !(a && b) ? 1 : 0;
    case 'NOR': return !(a || b) ? 1 : 0;
    case 'XNOR': return (a === b) ? 1 : 0;
    default: return 0;
  }
}

export default function MainHub({ setCurrentScreen, currentScreen }) {
  const { gameState, updateProgress, revokeProgress, updateSolstice, updateCorruption, addSystemLog, systemLogs } = useGame();

  const [logicLevel, setLogicLevel] = useState(() => parseInt(localStorage.getItem('logicLevel') || '0'));
  const [logicCoreHealth, setLogicCoreHealth] = useState(() => parseInt(localStorage.getItem('logicCoreHealth') || '0'));
  const [unlockedGates, setUnlockedGates] = useState(() => JSON.parse(localStorage.getItem('unlockedGates') || '[]'));
  const bonusAttempts = parseInt(localStorage.getItem('solsticeBonusAttempts') || '0');

  useEffect(() => {
    localStorage.setItem('logicLevel', logicLevel);
    localStorage.setItem('logicCoreHealth', logicCoreHealth);
    localStorage.setItem('unlockedGates', JSON.stringify(unlockedGates));
  }, [logicLevel, logicCoreHealth, unlockedGates]);

  const logicComplete = gameState.completedModules.includes('logic');
  const baseAttempts = 3 + bonusAttempts;

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedGate, setSelectedGate] = useState(null);
  const [attempts, setAttempts] = useState(baseAttempts);
  const [showFailure, setShowFailure] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showQuizTerminal, setShowQuizTerminal] = useState(false);

  const gateRef = useRef(null);
  const successContainerRef = useRef(null);
  const failureOverlayRef = useRef(null);
  const resetOverlayRef = useRef(null);
  const terminalRef = useRef(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs]);

  const handleHelp = (e) => {
    e?.preventDefault();
    terminalRef.current?.executeCommand('HELP');
  };

  const handleAcademy = (e) => {
    e?.preventDefault();
    terminalRef.current?.executeCommand('ACADEMY');
  };

  const safeSystemLogs = systemLogs || [];
  const puzzleIndex = Math.min(logicLevel, PUZZLES.length - 1);
  const currentPuzzle = PUZZLES[puzzleIndex];
  
  const currentTier = LOGIC_TIERS.find(t => currentPuzzle.level <= t.levelMax) || LOGIC_TIERS[3];
  
  const terminalContext = {
    tier: currentTier.name,
    level: currentPuzzle.level,
    allowed: currentTier.allowed
  };

  const handleRestartLevel = () => {
    setAttempts(baseAttempts);
    setSelectedGate(null);
    setShowFailure(false);
    if (addSystemLog) addSystemLog(`[SYS] LEVEL ${currentPuzzle.level.toString().padStart(2, '0')} RESTARTED`);
    
    // flash animation
    if (gateRef.current) {
      animate(gateRef.current, {
        opacity: [0, 1],
        duration: 300,
        ease: 'linear'
      });
    }
  };

  const executeResetCore = () => {
    setLogicLevel(0);
    setLogicCoreHealth(0);
    revokeProgress('logic');
    
    setAttempts(baseAttempts);
    setSelectedGate(null);
    setShowFailure(false);
    setShowResetConfirm(false);
    setShowSuccess(false);
    if (addSystemLog) addSystemLog(`[SYS] LOGIC CORE RESET`);
    
    // glitch reset animation
    animate('.flicker-layer', {
      opacity: [0, 1, 0, 1],
      duration: 500,
      ease: 'steps(4)'
    });
  };

  const handleGateSelection = (gate) => {
    if (logicComplete || showSuccess || showFailure) return;
    
    setSelectedGate(gate);
    const result = evaluateGate(gate, currentPuzzle.a, currentPuzzle.b);
    
    if (result === currentPuzzle.target) {
      setShowSuccess(true);
      
      if (gateRef.current) {
        animate(gateRef.current, {
          scale: [1, 1.1, 1],
          boxShadow: ['0 0 0px #00FF66', '0 0 20px #00FF66', '0 0 0px #00FF66'],
          duration: 500,
          ease: 'outElastic(1, .8)'
        });
      }

      const isNewGate = !unlockedGates.includes(gate);
      const newUnlockedGates = isNewGate ? [...unlockedGates, gate] : unlockedGates;

      if (addSystemLog) addSystemLog(`[SYS] LEVEL ${currentPuzzle.level} PASSED - GATE ${gate} ACCEPTED`);

      if (isNewGate && addSystemLog) {
        addSystemLog(`ARCHIVE UNLOCKED: KNOWLEDGE LOG - ${gate} GATE`);
      }

      const isFinalStage = puzzleIndex + 1 >= PUZZLES.length;

      let newLevel = logicLevel + 1;
      let healthIncrease = 10;
      
      if (isFinalStage && !logicComplete) {
        healthIncrease = 100 - logicCoreHealth;
      }

      setLogicLevel(newLevel);
      setLogicCoreHealth(Math.min(100, logicCoreHealth + healthIncrease));
      setUnlockedGates(newUnlockedGates);
      
      const isBossPhase = currentPuzzle.level === 10;
      const grantsStandardRewards = !isBossPhase || isFinalStage;

      if (grantsStandardRewards) {
        updateSolstice(2.5);
        updateCorruption(-2);
        
        if (addSystemLog) {
          addSystemLog(`[SUCCESS]\nLogic Node Restored\n\n+2.5% Light Restoration\n-2% Corruption`);
        }
      } else {
        if (addSystemLog) {
          addSystemLog(`[SUCCESS]\nLogic Node Phase Restored`);
        }
      }

      setTimeout(() => {
        if (isFinalStage) {
          if (updateProgress) updateProgress('logic', false); // false to apply the 25% reward globally
        } else {
          setAttempts(baseAttempts); // Reset attempts on successful level transition
        }
        setShowSuccess(false);
        setSelectedGate(null);
      }, 1000);
    } else {
      // Error handling
      if (gateRef.current) {
        animate(gateRef.current, {
          translateX: [
            { to: -10, duration: 50 },
            { to: 10, duration: 50 },
            { to: -10, duration: 50 },
            { to: 10, duration: 50 },
            { to: 0, duration: 50 }
          ],
          ease: 'inOutQuad'
        });
      }
      
      if (addSystemLog) addSystemLog(`[WARNING]\nIncorrect Gate Selection\n\n+1% Corruption`);
      updateCorruption(1);
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
        }
        return next;
      });

      setTimeout(() => setSelectedGate(null), 500);
    }
  };

  useEffect(() => {
    if (logicComplete && successContainerRef.current) {
      animate(successContainerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        ease: 'outExpo'
      });
    }
  }, [logicComplete]);

  return (
    <>
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      {showQuizTerminal && <QuizTerminal onClose={() => setShowQuizTerminal(false)} />}
      <div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
        <header className="w-full flex justify-between items-center h-16 py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
          <div className="font-headline-lg text-headline-lg text-terminal-green uppercase tracking-tighter phosphor-glow">
              SOLSTICE://TURING
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleAcademy} className="font-code-sm text-terminal-green hover:text-solstice-gold border border-terminal-green/30 px-2 py-1 transition-colors">TURING_ACADEMY</button>
            <button onClick={handleHelp} className="font-code-sm text-terminal-green hover:text-solstice-gold border border-terminal-green/30 px-2 py-1 transition-colors">HELP</button>
            <span onClick={() => setShowQuizTerminal(true)} className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">terminal</span>
          </div>
        </header>

        <main className="flex-grow flex gap-gutter overflow-hidden h-full">
          <SystemSidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
          
          <section className="flex-grow flex flex-col terminal-border bg-panel-gray overflow-hidden">
            <div className="bg-terminal-green text-surface px-4 py-2 flex justify-between items-center shrink-0">
              <h2 className="font-headline-md text-headline-md text-sm">LOGIC CORE // MODULE_01</h2>
              <span className="font-label-caps text-label-caps">
                {logicComplete ? 'STATUS: RESTORED' : 'STATUS: CORRUPTED'}
              </span>
            </div>
            
            <div className="flex-grow relative p-gutter flex flex-col items-center justify-center gap-6">
              
              {showFailure && (
                <div ref={failureOverlayRef} className="absolute inset-4 z-50 bg-warning-red/90 flex flex-col items-center justify-center p-8 terminal-border border-warning-red backdrop-blur-sm">
                  <h2 className="text-6xl font-headline-lg text-black mb-4 glitch-text">SIGNAL FAILURE</h2>
                  <p className="text-2xl font-headline-md text-black mb-8">LEVEL CORRUPTED</p>
                  <button onClick={handleRestartLevel} className="px-6 py-3 border-4 border-black text-black font-headline-lg text-headline-lg hover:bg-black hover:text-warning-red transition-colors active:scale-95">
                    RETRY LEVEL
                  </button>
                </div>
              )}

              {showResetConfirm && (
                <div ref={resetOverlayRef} className="absolute inset-4 z-50 bg-black/95 flex flex-col items-center justify-center p-8 terminal-border border-warning-red">
                  <h2 className="text-4xl font-headline-lg text-warning-red mb-4">WARNING</h2>
                  <p className="text-xl font-code-sm text-soft-green mb-8 text-center max-w-md">All Logic Core progress will be lost. Memory and Cipher cores will remain intact.</p>
                  <div className="flex gap-8">
                    <button onClick={executeResetCore} className="px-6 py-3 border-2 border-warning-red text-warning-red font-headline-lg text-headline-lg hover:bg-warning-red hover:text-black transition-colors">YES</button>
                    <button onClick={() => setShowResetConfirm(false)} className="px-6 py-3 border-2 border-terminal-green text-terminal-green font-headline-lg text-headline-lg hover:bg-terminal-green hover:text-black transition-colors">NO</button>
                  </div>
                </div>
              )}

              {/* Display Core State */}
              {!logicComplete && (
                <div className="w-full max-w-2xl flex justify-between items-start mb-4 border-b border-terminal-green/30 pb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-terminal-green font-headline-md text-headline-md">{currentTier.name}</span>
                    <span className="text-soft-green font-label-caps text-label-caps">{currentTier.brief}</span>
                    <span className={`font-label-caps text-label-caps ${attempts === 1 ? 'text-warning-red animate-pulse' : 'text-terminal-green'}`}>
                      ATTEMPTS REMAINING: {attempts}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-solstice-gold font-headline-md text-headline-md">LEVEL {currentPuzzle.level}/10</span>
                    <span className="text-soft-green font-label-caps text-label-caps mb-2">CORE HEALTH: {logicCoreHealth}%</span>
                    <div className="flex gap-2">
                      <button onClick={handleRestartLevel} className="px-2 py-1 text-[10px] font-code-sm border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black transition-colors">RESTART LEVEL</button>
                      <button onClick={() => setShowResetConfirm(true)} className="px-2 py-1 text-[10px] font-code-sm border border-warning-red text-warning-red hover:bg-warning-red hover:text-black transition-colors">RESET LOGIC CORE</button>
                    </div>
                  </div>
                </div>
              )}

              {logicComplete ? (
                <div ref={successContainerRef} className="w-full max-w-2xl terminal-border p-12 bg-surface-container relative flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-solstice-gold flex items-center justify-center animate-[pulse_2s_infinite]">
                    <span className="material-symbols-outlined text-6xl text-solstice-gold">done</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-solstice-gold tracking-widest">LOGIC CORE RESTORED</h3>
                  <div className="flex flex-col gap-2 font-code-sm text-code-sm text-terminal-green uppercase">
                    <p>System heuristics successfully realigned.</p>
                    <p className="text-solstice-gold">LIGHT RESTORATION +25%</p>
                    <p className="text-soft-green">CORRUPTION REDUCED</p>
                  </div>
                  <button onClick={() => setShowResetConfirm(true)} className="mt-8 px-6 py-2 border-2 border-warning-red text-warning-red font-headline-md text-headline-md hover:bg-warning-red hover:text-black transition-colors">
                    RESET LOGIC CORE
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-2xl terminal-border p-8 bg-surface-container relative">
                  <div className="absolute -top-3 left-6 bg-surface px-2 text-terminal-green font-code-sm uppercase">
                    {currentPuzzle.instruction ? currentPuzzle.instruction : `Binary Logic Reconstruction`}
                  </div>
                  <div className="grid grid-cols-3 gap-8 items-center">
                    <div className="flex flex-col gap-8">
                      <div className="flex items-center gap-4">
                        <div className="font-label-caps text-label-caps text-soft-green">INPUT A</div>
                        <div className="w-12 h-12 terminal-border bg-black flex items-center justify-center font-headline-lg text-headline-lg text-terminal-green glow-green">
                          {currentPuzzle.a}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-label-caps text-label-caps text-soft-green">INPUT B</div>
                        <div className="w-12 h-12 terminal-border bg-black flex items-center justify-center font-headline-lg text-headline-lg text-terminal-green glow-green">
                          {currentPuzzle.b}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-2 relative">
                      <div className="absolute top-1/2 -left-8 w-8 border-b-2 border-terminal-green border-dashed"></div>
                      <div className="absolute top-1/2 -right-8 w-8 border-b-2 border-terminal-green border-dashed"></div>
                      
                      <div ref={gateRef} className="w-24 h-24 border-2 border-solstice-gold bg-black flex items-center justify-center relative overflow-hidden transition-colors">
                        {selectedGate ? (
                          <span className={`font-headline-lg text-headline-lg ${showSuccess ? 'text-solstice-gold' : 'text-warning-red'}`}>
                            {selectedGate}
                          </span>
                        ) : (
                          <span className="text-solstice-gold opacity-50 animate-pulse font-code-sm">INSERT GATE</span>
                        )}
                      </div>
                      <div className="font-label-caps text-label-caps text-solstice-gold mt-2">LOGIC GATE</div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4 relative">
                      <div className="font-label-caps text-label-caps text-soft-green">TARGET OUTPUT</div>
                      <div className="w-16 h-16 terminal-border bg-terminal-green/20 flex items-center justify-center font-headline-lg text-headline-lg text-terminal-green shadow-[inset_0_0_15px_rgba(0,255,102,0.3)]">
                        {currentPuzzle.target}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-terminal-green/30 pt-6">
                    <div className="font-label-caps text-label-caps text-soft-green mb-4">AVAILABLE MODULES</div>
                    <div className="flex gap-4 flex-wrap">
                      {GATES.map((gate) => {
                        const isAllowed = currentTier.allowed.includes(gate);
                        if (!isAllowed) return null;
                        return (
                          <button
                            key={gate}
                            onClick={() => handleGateSelection(gate)}
                            disabled={showSuccess || showFailure}
                            className={`px-4 py-2 border-2 ${selectedGate === gate ? 'border-solstice-gold text-solstice-gold' : 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-surface'} font-headline-md text-headline-md transition-all active:scale-95`}
                          >
                            {gate}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* AI Terminal Context Passed In */}
          <AiTerminal ref={terminalRef} contextualState={terminalContext} />
        </main>

        <footer className="h-32 terminal-border bg-surface shrink-0 p-4 font-code-sm text-code-sm flex flex-col gap-1 overflow-hidden relative">
          <div className="absolute top-0 right-4 px-2 bg-surface text-terminal-green opacity-50 text-[10px] uppercase font-headline-md">System Logs</div>
          <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar" id="log-container">
            {safeSystemLogs.map((logItem, i) => {
              const text = typeof logItem === 'string' ? logItem : logItem.text;
              const time = typeof logItem === 'string' ? new Date().toLocaleTimeString() : logItem.time;
              return (
                <div key={i} className="flex gap-4 py-1">
                  <span className="text-soft-green opacity-50">[{time}]</span>
                  <span className={`whitespace-pre-line ${
                    text.includes('[SUCCESS]') || text.includes('[RESTORE]') || text.includes('UNLOCKED') 
                      ? 'text-solstice-gold' 
                      : text.includes('[WARNING]') || text.includes('[SYS_WARN]') 
                        ? 'text-warning-red' 
                        : 'text-terminal-green'
                  }`}>{text}</span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        </footer>
      </div>
    </>
  );
}
