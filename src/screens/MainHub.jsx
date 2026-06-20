import React, { useState, useEffect } from 'react';
import SystemSidebar from '../components/SystemSidebar';

const PUZZLES = [
  { a: 0, b: 0, target: 0 },
  { a: 1, b: 0, target: 1 },
  { a: 1, b: 1, target: 0 },
  { a: 0, b: 1, target: 1 },
  { a: 0, b: 0, target: 1 },
  { a: 1, b: 1, target: 1 },
  { a: 1, b: 0, target: 0 },
  { a: 0, b: 1, target: 0 },
  { a: 1, b: 1, target: 0 },
  { a: 0, b: 0, target: 1 }
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

export default function MainHub({ setCurrentScreen, currentScreen, gameState, setGameState, addSystemLog, systemLogs, updateProgress }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedGate, setSelectedGate] = useState(null);

  const safeGameState = gameState || { lightRestoration: 0, corruptionLevel: 92, logicComplete: false };
  const safeSystemLogs = systemLogs || [];
  const currentPuzzle = PUZZLES[puzzleIndex];

  const handleGateSelection = (gate) => {
    if (safeGameState.logicComplete || showSuccess) return;
    
    setSelectedGate(gate);
    const result = evaluateGate(gate, currentPuzzle.a, currentPuzzle.b);
    
    if (result === currentPuzzle.target) {
      setShowSuccess(true);
      
      // Incrementally update global state here
      if (setGameState) {
        setGameState(prev => ({
          ...prev,
          lightRestoration: prev.lightRestoration + 2.5,
          corruptionLevel: Math.max(0, prev.corruptionLevel - 2.3)
        }));
      }

      setTimeout(() => {
        if (puzzleIndex + 1 >= PUZZLES.length) {
          if (updateProgress) updateProgress('logic', true);
        } else {
          setPuzzleIndex(prev => prev + 1);
        }
        setShowSuccess(false);
        setSelectedGate(null);
      }, 1000);
    } else {
      setTimeout(() => setSelectedGate(null), 500);
    }
  };
  useEffect(() => {
    /* 
    Extracted Scripts from original HTML:
    
        // Simple Typing Effect for AI Terminal
        const aiTyping = document.getElementById('ai-typing');
        const phrases = [
            "SCANNING_LOGIC_PATHWAYS...",
            "CORRUPTION_THRESHOLD_CRITICAL",
            "AWAITING_INPUT_SIGNAL...",
            "QUERY SYSTEM CORE..."
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                aiTyping.textContent = currentPhrase.substring(0, charIndex--);
            } else {
                aiTyping.textContent = currentPhrase.substring(0, charIndex++);
            }

            if (!isDeleting && charIndex === currentPhrase.length + 1) {
                setTimeout(() => isDeleting = true, 3000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            const speed = isDeleting ? 30 : 60;
            setTimeout(type, speed);
        }

        // Random Log Generation
        const logs = [
            "BUFFER OVERFLOW IN MEMORY_BANK_4",
            "DATA INTEGRITY CHECK: FAILED",
            "RESTORING SYSTEM ASSETS...",
            "PHOSPHOR DECAY DETECTED",
            "ENCRYPTION KEY SYNCED",
            "ALERT: UNAUTHORIZED ACCESS ATTEMPT",
            "KERNEL PANIC AVERTED"
        ];
        const logContainer = document.getElementById('log-container');

        function addLog() {
            const time = new Date();
            const timeStr = `[${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}:${Math.floor(Math.random() * 99).toString().padStart(2, '0')}]`;
            
            const logEntry = document.createElement('div');
            logEntry.className = 'flex gap-4';
            const logText = logs[Math.floor(Math.random() * logs.length)];
            const colorClass = Math.random() > 0.8 ? 'text-warning-red' : 'text-soft-green';
            
            logEntry.innerHTML = `<span className="text-soft-green opacity-50">${timeStr}</span><span className="${colorClass}">${logText}</span>`;
            
            logContainer.appendChild(logEntry);
            if (logContainer.children.length > 5) {
                logContainer.removeChild(logContainer.firstChild);
            }
            
            setTimeout(addLog, 2000 + Math.random() * 3000);
        }

        document.addEventListener('DOMContentLoaded', () => {
            type();
            addLog();
            
            // Interaction Simulation
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const ripple = document.createElement('div');
                    ripple.className = 'fixed inset-0 pointer-events-none bg-terminal-green opacity-10';
                    document.body.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 50);
                });
            });
        });
    

    */
  }, []);

  return (
    <>
      
<div className="crt-overlay"></div>
<div className="scanline"></div>
<div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
{/*  TOP APP BAR  */}
<header className="w-full flex justify-between items-center py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
<div className="font-headline-lg text-headline-lg text-terminal-green uppercase tracking-tighter phosphor-glow">
                SOLSTICE://TURING
            </div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">terminal</span>
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">settings</span>
</div>
</header>
{/*  MAIN DASHBOARD CONTENT  */}
<main className="flex-grow flex gap-gutter overflow-hidden h-full">
{/*  LEFT PANEL: SYSTEM STATUS  */}
<SystemSidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} gameState={safeGameState} />
{/*  CENTER PANEL: LOGIC CORE  */}
<section className="flex-grow flex flex-col terminal-border bg-panel-gray overflow-hidden">
<div className="bg-terminal-green text-surface px-4 py-2 flex justify-between items-center shrink-0">
<h2 className="font-headline-md text-headline-md text-sm">LOGIC CORE // MODULE_01</h2>
<span className="font-label-caps text-label-caps">STATUS: CORRUPTED</span>
</div>
<div className="flex-grow relative p-gutter flex flex-col items-center justify-center gap-12">
{/*  Retro Puzzle Interface  */}
{safeGameState.logicComplete ? (
  <div className="w-full max-w-2xl terminal-border p-12 bg-surface-container relative flex flex-col items-center justify-center text-center gap-6">
    <div className="w-24 h-24 rounded-full border-4 border-solstice-gold flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-6xl text-solstice-gold">done</span>
    </div>
    <h3 className="font-headline-lg text-headline-lg text-solstice-gold tracking-widest">LOGIC CORE RESTORED</h3>
    <p className="font-code-sm text-code-sm text-terminal-green uppercase">System heuristics successfully realigned. Power restored to Module 01.</p>
  </div>
) : (
  <div className="w-full max-w-2xl terminal-border p-8 bg-surface-container relative">
  <div className="absolute -top-3 left-6 bg-surface px-2 text-terminal-green font-code-sm uppercase">Binary Logic Reconstruction ({puzzleIndex + 1}/10)</div>
  <div className="grid grid-cols-3 gap-8 items-center">
  {/*  Inputs  */}
  <div className="flex flex-col gap-8">
  <div className="flex items-center gap-4">
  <div className={`w-12 h-12 terminal-border flex items-center justify-center font-headline-lg ${currentPuzzle.a ? 'text-solstice-gold solstice-glow' : 'text-panel-gray opacity-30'}`}>{currentPuzzle.a}</div>
  <div className="font-label-caps text-label-caps">INPUT A</div>
  </div>
  <div className="flex items-center gap-4">
  <div className={`w-12 h-12 terminal-border flex items-center justify-center font-headline-lg ${currentPuzzle.b ? 'text-solstice-gold solstice-glow' : 'text-panel-gray opacity-30'}`}>{currentPuzzle.b}</div>
  <div className="font-label-caps text-label-caps">INPUT B</div>
  </div>
  </div>
  {/*  Gate Center  */}
  <div className="flex flex-col items-center justify-center gap-4">
  <div className={`w-24 h-24 terminal-border ${showSuccess ? 'border-terminal-green text-terminal-green' : selectedGate ? 'border-solstice-gold text-warning-red' : 'border-solstice-gold border-dashed text-solstice-gold'} flex items-center justify-center`}>
    {showSuccess ? (
      <span className="material-symbols-outlined text-4xl animate-bounce">check_circle</span>
    ) : selectedGate ? (
      <span className="font-headline-md text-xl">{selectedGate}</span>
    ) : (
      <span className="material-symbols-outlined text-4xl animate-pulse">question_mark</span>
    )}
  </div>
  <div className="h-0.5 w-16 bg-terminal-green"></div>
  </div>
  {/*  Target Output  */}
  <div className="flex flex-col items-center gap-4">
  <div className={`w-16 h-16 terminal-border flex items-center justify-center ${showSuccess ? 'border-terminal-green text-terminal-green' : 'border-solstice-gold text-solstice-gold'}`}>
  <span className={`font-headline-lg ${showSuccess ? 'phosphor-glow-green' : 'phosphor-glow'}`}>{currentPuzzle.target}</span>
  </div>
  <div className={`font-label-caps text-label-caps ${showSuccess ? 'text-terminal-green' : 'text-solstice-gold'}`}>TARGET</div>
  </div>
  </div>
  <div className={`mt-12 text-center font-body-md ${showSuccess ? 'text-terminal-green' : selectedGate ? 'text-warning-red' : 'text-terminal-green animate-pulse'}`}>
                              {showSuccess ? 'GATE ALIGNED. PROCEEDING...' : selectedGate ? 'INCORRECT GATE CONFIGURATION' : 'REPAIR LOGIC GATE TO RESTORE 25% LIGHT'}
                          </div>
  </div>
)}

{/*  Interaction Buttons  */}
{!safeGameState.logicComplete && (
<div className="flex flex-wrap justify-center gap-4 max-w-2xl">
{GATES.map(gate => (
  <button 
    key={gate} 
    onClick={() => handleGateSelection(gate)}
    className={`px-8 py-3 terminal-border hover:bg-terminal-green hover:text-surface transition-all font-headline-md text-xs active:scale-95 ${selectedGate === gate && !showSuccess ? 'bg-warning-red text-surface border-warning-red' : ''}`}
  >
    {gate}
  </button>
))}
</div>
)}
</div>
</section>
{/*  RIGHT PANEL: AI TERMINAL  */}
<section className="w-80 flex flex-col terminal-border bg-panel-gray h-full shrink-0">
<div className="border-b-2 border-terminal-green p-4 flex items-center gap-2">
<span className="material-symbols-outlined text-terminal-green">psychology</span>
<h2 className="font-headline-md text-headline-md text-xs uppercase">AI TERMINAL</h2>
</div>
<div className="flex-grow p-4 font-code-sm text-soft-green overflow-y-auto space-y-4" id="ai-messages">
<div className="flex gap-2">
<span className="text-terminal-green opacity-50">[SYSTEM]:</span>
<span>Connection established. Solstice Shell V1.0 active.</span>
</div>
<div className="flex gap-2">
<span className="text-terminal-green opacity-50">[CORE]:</span>
<span id="ai-typing">QUERY SYSTEM CORE...</span><span className="cursor"></span>
</div>
</div>
<div className="p-4 border-t-2 border-terminal-green flex flex-col gap-2">
<button className="w-full text-left p-2 font-code-sm text-terminal-green border border-terminal-green/30 hover:border-terminal-green hover:bg-terminal-green hover:text-surface">
                        &gt; EXPLAIN XOR
                    </button>
<button className="w-full text-left p-2 font-code-sm text-terminal-green border border-terminal-green/30 hover:border-terminal-green hover:bg-terminal-green hover:text-surface">
                        &gt; GIVE HINT
                    </button>
<div className="mt-2 flex gap-2 terminal-border p-2">
<span className="text-terminal-green">&gt;</span>
<input className="bg-transparent border-none focus:ring-0 p-0 text-terminal-green w-full font-code-sm" placeholder="COMMAND..." type="text"/>
</div>
</div>
</section>
</main>
{/*  BOTTOM PANEL: SYSTEM LOGS  */}
<footer className="h-32 terminal-border bg-surface shrink-0 p-4 font-code-sm text-code-sm flex flex-col gap-1 overflow-hidden relative">
<div className="absolute top-0 right-4 px-2 bg-surface text-terminal-green opacity-50 text-[10px] uppercase font-headline-md">Live Stream logs</div>
<div className="flex flex-col gap-1 overflow-y-auto" id="log-container">
{safeSystemLogs.length > 0 ? (
  safeSystemLogs.map((log, index) => (
    <div key={index} className="flex gap-4">
      <span className="text-soft-green opacity-50">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
      <span className="text-terminal-green">{log}</span>
    </div>
  ))
) : (
  <>
    <div className="flex gap-4">
    <span className="text-soft-green opacity-50">[08:42:15:23]</span>
    <span className="text-warning-red">CORRUPTION DETECTED IN SECTOR 7...</span>
    </div>
    <div className="flex gap-4">
    <span className="text-soft-green opacity-50">[08:42:16:01]</span>
    <span className="text-soft-green">WAITING FOR INPUT...</span>
    </div>
    <div className="flex gap-4">
    <span className="text-soft-green opacity-50">[08:42:17:88]</span>
    <span className="text-terminal-green">LOGIC_GATE_STATUS: DISCONNECTED</span>
    </div>
    <div className="flex gap-4">
    <span className="text-soft-green opacity-50">[08:42:19:42]</span>
    <span className="text-solstice-gold">GOLD_CORE_HEURISTICS: OFFLINE</span>
    </div>
  </>
)}
</div>
</footer>
</div>
{/*  AUDIO/VISUAL FEEDBACK SCRIPT  */}


    </>
  );
}
