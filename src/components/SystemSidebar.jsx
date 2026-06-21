import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { useGame } from '../context/GameContext';

export default function SystemSidebar({ currentScreen, setCurrentScreen }) {
  const { gameState } = useGame();
  const completedModules = gameState.completedModules || [];
  
  const corruptionBarRef = useRef(null);
  
  useEffect(() => {
    if (corruptionBarRef.current) {
      animate(corruptionBarRef.current, {
        width: `${gameState.corruptionLevel}%`,
        duration: 1500,
        ease: 'outElastic(1, .8)'
      });
    }
  }, [gameState.corruptionLevel]);

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
    if (progress >= 100) {
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
              <div ref={corruptionBarRef} className="h-full bg-warning-red" style={{ width: '92%' }}></div>
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
                <span>AI</span>
              </div>
              <span className="text-[10px]">{aiNav.statusText}</span>
            </div>
          </nav>
        </div>
        
        <button 
          onClick={handleRecoveryClick}
          className={`w-full relative z-10 terminal-border bg-panel-gray font-headline-md py-4 text-xs transition-colors ${progress >= 100 ? 'hover:bg-solstice-gold hover:text-black text-solstice-gold border-solstice-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'hover:bg-terminal-green hover:text-surface text-terminal-green'}`}
        >
          {progress >= 100 ? 'RECONSTRUCT TURING' : 'CONTINUE RESTORATION'}
        </button>
      </section>
    </aside>
  );
}
