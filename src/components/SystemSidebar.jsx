import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { useGame } from '../context/GameContext';

export default function SystemSidebar({ currentScreen, setCurrentScreen }) {
  const { gameState, resetSystem } = useGame();
  const completedModules = gameState.completedModules || [];
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootText, setRebootText] = useState("");
  
  const handleResetConfirm = () => {
    setIsRebooting(true);
    
    const sequence = [
      "TERMINATING SESSION...",
      "CLEARING MEMORY...",
      "RESETTING CORES...",
      "REBOOT COMPLETE"
    ];
    
    let delay = 0;
    sequence.forEach((text, i) => {
      setTimeout(() => {
        setRebootText(text);
        if (i === sequence.length - 1) {
          setTimeout(() => {
            resetSystem();
            setCurrentScreen('MainHub');
            setIsRebooting(false);
            setShowResetModal(false);
          }, 1500);
        }
      }, delay);
      delay += 800;
    });
  };

  useEffect(() => {
    if (showResetModal && !isRebooting) {
      animate('.reset-modal-overlay', {
        opacity: [0, 1],
        duration: 500,
        easing: 'outQuad'
      });
      animate('.reset-modal-content', {
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 500,
        easing: 'outElastic(1, .8)'
      });
    }
  }, [showResetModal, isRebooting]);
  
  // removed corruptionBarRef directly manipulating DOM

  const progress = gameState.solsticeProgress;
  const [displayProgress, setDisplayProgress] = useState(progress);
  const corruption = gameState.corruptionLevel;
  const [displayCorruption, setDisplayCorruption] = useState(corruption);

  useEffect(() => {
    const obj = { val: displayProgress };
    animate(obj, {
      val: progress,
      duration: 1000,
      easing: 'outQuad',
      update: () => setDisplayProgress(obj.val)
    });

    animate('.solstice-block', {
      scale: [0.8, 1],
      opacity: [0.3, 1],
      duration: 600,
      delay: stagger(50),
      easing: 'outElastic(1, .8)'
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  useEffect(() => {
    const obj = { val: displayCorruption };
    animate(obj, {
      val: corruption,
      duration: 1500,
      easing: 'outElastic(1, .8)',
      update: () => setDisplayCorruption(obj.val)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corruption]);

  const filledBlocks = Math.floor(progress / 10);

  const getNavClass = (screenName, moduleKey) => {
    let base = "p-2 flex justify-between items-center cursor-pointer font-label-caps text-label-caps border border-transparent transition-all ";
    
    const isCompleted = gameState.completedModules.includes(moduleKey);
    const isUnlocked = gameState.unlockedModules.includes(moduleKey);
    
    let statusText = 'LOCKED';
    if (isCompleted) {
      statusText = 'COMPLETED';
    } else if (isUnlocked) {
      statusText = 'ACTIVE';
    }
    
    if (currentScreen === screenName) {
      base += "bg-terminal-green text-surface ring-2 ring-solstice-gold ";
    } else if (!isUnlocked) {
      base += "text-terminal-green/40 cursor-not-allowed ";
    } else {
      base += "text-terminal-green hover:bg-soft-green/20 ";
    }
    
    if (isCompleted) {
      base += currentScreen === screenName ? "" : "text-solstice-gold opacity-80 ";
    }

    return { className: base, statusText, isUnlocked };
  };

  const logicNav = getNavClass('MainHub', 'logic');
  const memoryNav = getNavClass('MemoryCore', 'memory');
  const cipherNav = getNavClass('CipherCore', 'cipher');
  const aiNav = getNavClass('AiCore', 'ai');

  const handleRecoveryClick = () => {
    if (gameState.reconstructionUnlocked) {
      setCurrentScreen('ReconstructionCore');
    }
  };

  return (
    <aside className="w-64 flex flex-col gap-gutter shrink-0 h-full">
      <section className="flex flex-col h-full terminal-border bg-panel-gray p-4 gap-4 relative overflow-y-auto custom-scrollbar">
        {currentScreen === 'AiCore' ? (
          <div className="flex flex-col gap-2 mb-4 relative z-10 shrink-0">
            <div className="w-48 h-48 mx-auto pixel-border p-1 bg-surface relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-[6px] leading-[6px] sm:text-[8px] sm:leading-[8px] text-terminal-green font-code-sm bg-black overflow-hidden opacity-80">
                <pre>{`
    .@@@@@@@@.
   @@@@@@@@@@@@
  @@@        @@@
  @@  (o)  (o)  @@
  @@    __    @@
  @@@  \\__/  @@@
   @@@@@@@@@@@@
    '@@@@@@@@'
`}</pre>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-terminal-green text-surface font-label-caps text-label-caps px-1 z-10">TURING PROFILE FRAME</div>
            </div>
            <div className="font-headline-md text-headline-md text-terminal-green mt-2">SOLSTICE v1.0</div>
            <div className="text-warning-red font-label-caps text-label-caps">STATUS: CORRUPTED</div>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-b border-terminal-green pb-2 relative z-10">
            <span className="material-symbols-outlined text-terminal-green">memory</span>
            <h2 className="font-headline-md text-headline-md text-terminal-green">SYSTEM</h2>
          </div>
        )}
        
        <div className="space-y-6 flex-grow relative z-10">
          {/* Corruption Level */}
          <div>
            <div className="flex justify-between font-label-caps text-label-caps mb-1">
              <span>CORRUPTION_LVL</span>
              <span className="text-warning-red">{Number(displayCorruption.toFixed(1))}%</span>
            </div>
            <div className="w-full h-4 terminal-border p-0.5 overflow-hidden">
              <div className="h-full bg-warning-red" style={{ width: `${displayCorruption}%` }}></div>
            </div>
          </div>
          
          {/* Solstice Meter */}
          <div>
            <div className="flex justify-between font-label-caps text-label-caps mb-1 text-solstice-gold">
              <span>SOLSTICE_METER</span>
              <span>{Number(displayProgress.toFixed(1))}%</span>
            </div>
            <div className="grid grid-cols-10 gap-1 h-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`solstice-block terminal-border transition-colors duration-500 ${i < filledBlocks ? 'bg-solstice-gold border-solstice-gold' : 'border-solstice-gold'}`}
                  style={{ opacity: i < filledBlocks ? 1 : 0.3 }}
                ></div>
              ))}
            </div>
            <p className="font-code-sm text-code-sm text-solstice-gold mt-2 uppercase">
              {progress >= 100 ? 'Light Restoration: COMPLETE' : 'Light Restoration: REQUIRED'}
            </p>
          </div>
          
          {/* NAV LINKS */}
          <nav className="flex flex-col gap-2 mt-auto w-full">
            <div onClick={() => logicNav.isUnlocked && setCurrentScreen('MainHub')} className={logicNav.className}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">dns</span>
                <span>LOGIC</span>
              </div>
              <span className="text-[10px]">{logicNav.statusText}</span>
            </div>
            <div onClick={() => memoryNav.isUnlocked && setCurrentScreen('MemoryCore')} className={memoryNav.className}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">database</span>
                <span>MEMORY</span>
              </div>
              <span className="text-[10px]">{memoryNav.statusText}</span>
            </div>
            <div onClick={() => cipherNav.isUnlocked && setCurrentScreen('CipherCore')} className={cipherNav.className}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span>
                <span>CIPHER</span>
              </div>
              <span className="text-[10px]">{cipherNav.statusText}</span>
            </div>
            <div onClick={() => aiNav.isUnlocked && setCurrentScreen('AiCore')} className={aiNav.className}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">psychology</span>
                <span>A.L.A.N.</span>
              </div>
              <span className="text-[10px]">{aiNav.statusText}</span>
            </div>
          </nav>
        </div>
        
        <div className="flex flex-col gap-2 relative z-10 w-full mt-2">
          <button 
            onClick={handleRecoveryClick}
            disabled={!gameState.reconstructionUnlocked}
            className={`w-full terminal-border bg-panel-gray font-headline-md py-4 text-xs transition-colors ${gameState.reconstructionUnlocked ? 'hover:bg-solstice-gold hover:text-black text-solstice-gold border-solstice-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'opacity-40 cursor-not-allowed hover:bg-terminal-green hover:text-surface text-terminal-green'}`}
          >
            {gameState.reconstructionUnlocked ? 'RECONSTRUCT TURING' : 'CONTINUE RESTORATION'}
          </button>
          
          <button 
            onClick={() => setShowResetModal(true)}
            className="w-full terminal-border border-warning-red bg-panel-gray font-headline-md py-2 text-[10px] text-warning-red hover:bg-warning-red hover:text-black transition-colors"
          >
            RESET SYSTEM
          </button>
        </div>
      </section>

      {/* Reset Modal Overlay */}
      {showResetModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm crt-flicker reset-modal-overlay">
          {!isRebooting ? (
            <div className="pixel-border border-warning-red bg-[#050505] p-8 max-w-lg w-full text-center reset-modal-content shadow-[0_0_50px_rgba(255,51,51,0.2)]">
              <h2 className="font-headline-lg text-4xl text-warning-red mb-4 animate-pulse">WARNING</h2>
              <p className="font-code-sm text-warning-red/80 mb-8 tracking-widest leading-relaxed">
                THIS ACTION WILL ERASE ALL GAME PROGRESS.<br/>
                PROCEED WITH SYSTEM RESET?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleResetConfirm}
                  className="flex-1 bg-warning-red/10 border-2 border-warning-red text-warning-red font-headline-md py-3 hover:bg-warning-red hover:text-black transition-colors"
                >
                  YES
                </button>
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-surface border-2 border-terminal-green text-terminal-green font-headline-md py-3 hover:bg-terminal-green hover:text-surface transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center font-headline-lg text-3xl md:text-5xl text-warning-red tracking-[0.2em] md:tracking-[0.5em] drop-shadow-[0_0_15px_rgba(255,51,51,0.8)]">
              {rebootText}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
