import React, { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import { useGame } from '../context/GameContext';

const TURING_URL = "url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80')";

const ALL_PIECES = [
  { id: 0, bgPos: "0% 0%" },
  { id: 1, bgPos: "50% 0%" },
  { id: 2, bgPos: "100% 0%" },
  { id: 3, bgPos: "0% 50%" },
  { id: 4, bgPos: "50% 50%" },
  { id: 5, bgPos: "100% 50%" },
  { id: 6, bgPos: "0% 100%" },
  { id: 7, bgPos: "50% 100%" },
  { id: 8, bgPos: "100% 100%" },
];

export default function ReconstructionCore({ setCurrentScreen, currentScreen }) {
  const { addSystemLog } = useGame();
  
  const [grid, setGrid] = useState([
    ALL_PIECES[0], ALL_PIECES[1], ALL_PIECES[2],
    ALL_PIECES[3], ALL_PIECES[4], null,
    null, ALL_PIECES[7], null
  ]);
  const [buffer, setBuffer] = useState([ALL_PIECES[5], ALL_PIECES[6], ALL_PIECES[8]]);
  const [isSolved, setIsSolved] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    let correctCount = 0;
    grid.forEach((piece, index) => {
      if (piece && piece.id === index) correctCount++;
    });
    if (correctCount === 9) {
      if (!isSolved) {
        setIsSolved(true);
        addSystemLog("[RESTORE]\nTURING RECONSTRUCTION COMPLETE.\nAWAITING FINAL BOOT.");
      }
    } else {
      setIsSolved(false);
    }
  }, [grid, isSolved, addSystemLog]);

  const handleDragStart = (e, pieceId) => {
    e.dataTransfer.setData('pieceId', pieceId.toString());
    setDraggedId(pieceId);
  };

  const handleDropOnGrid = (e, index) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData('pieceId');
    if (!pieceIdStr) return;
    const pieceId = parseInt(pieceIdStr, 10);
    
    let piece = buffer.find(p => p.id === pieceId);
    let sourceIndex = -1;
    if (!piece) {
      sourceIndex = grid.findIndex(p => p && p.id === pieceId);
      if (sourceIndex > -1) piece = grid[sourceIndex];
    }
    
    if (!piece) return;

    if (!grid[index]) {
      const newGrid = [...grid];
      newGrid[index] = piece;
      if (sourceIndex > -1) newGrid[sourceIndex] = null;
      else setBuffer(buffer.filter(p => p.id !== pieceId));
      setGrid(newGrid);
    } else {
      const targetPiece = grid[index];
      const newGrid = [...grid];
      newGrid[index] = piece;
      if (sourceIndex > -1) newGrid[sourceIndex] = targetPiece;
      else setBuffer([...buffer.filter(p => p.id !== pieceId), targetPiece]);
      setGrid(newGrid);
    }
    setDraggedId(null);
  };

  const handleDropOnBuffer = (e) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData('pieceId');
    if (!pieceIdStr) return;
    const pieceId = parseInt(pieceIdStr, 10);
    
    if (buffer.some(p => p.id === pieceId)) return;
    
    const sourceIndex = grid.findIndex(p => p && p.id === pieceId);
    if (sourceIndex > -1) {
      const piece = grid[sourceIndex];
      const newGrid = [...grid];
      newGrid[sourceIndex] = null;
      setGrid(newGrid);
      setBuffer([...buffer, piece]);
    }
    setDraggedId(null);
  };
  useEffect(() => {
    /* 
    Extracted Scripts from original HTML:
    
        // Micro-interactions for the "terminal" feel
        const logs = document.getElementById('scrolling-logs');
        const phrases = [
            "[14:24:00:112] BUFFER_CLEARING...",
            "[14:24:02:445] LOGIC_STREAM_STABLE",
            "[14:24:05:001] INTEGRITY_CHECK_PASS",
            "[14:24:07:221] MEMORY_ALLOCATED",
            "[14:24:10:999] SOLSTICE_SIGNAL_LOCKED"
        ];

        setInterval(() => {
            const span = document.createElement('span');
            span.innerHTML = `<span className="opacity-50">|</span> <span>${phrases[Math.floor(Math.random() * phrases.length)]}</span>`;
            logs.appendChild(span);
            if (logs.children.length > 5) {
                logs.removeChild(logs.firstChild);
            }
        }, 3000);

        // Simple typing simulation for the final archive
        const typingContainer = document.querySelector('.typing-container');
        if (typingContainer) {
            const text = typingContainer.innerText;
            typingContainer.innerText = '';
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    typingContainer.innerText += text.charAt(i);
                    i++;
                    setTimeout(type, 20);
                }
            };
            type();
        }

        // Draggable simulation logic (Visual feedback only)
        document.querySelectorAll('.draggable-piece').forEach(piece => {
            piece.addEventListener('mousedown', () => {
                piece.style.borderColor = '#FFD54A';
            });
            piece.addEventListener('mouseup', () => {
                piece.style.borderColor = '#00FF66';
            });
        });
    

    */
  }, []);

  return (
    <>
      
<div className="scanline-overlay"></div>
<div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
{/*  TOP BAR  */}
<header className="w-full flex justify-between items-center h-16 py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
<div className="font-headline-lg text-headline-lg text-terminal-green uppercase tracking-tighter phosphor-glow">
            SOLSTICE://TURING
        </div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">terminal</span>
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">settings</span>
</div>
</header>
<main className="flex-grow grid grid-cols-12 gap-gutter overflow-hidden h-full">
{/*  LEFT SIDEBAR: SYSTEM STATUS  */}
<aside className="col-span-3 flex flex-col gap-gutter h-full">
<div className="pixel-border p-4 bg-panel-gray flex-1">
<div className="font-headline-md text-headline-md mb-6 border-b border-terminal-green pb-2">ARCHIVE_ROOT</div>
<div className="space-y-6">
<div className="flex flex-col gap-1">
<span className="text-label-caps text-soft-green">SYSTEM_STATUS</span>
<span className="text-solstice-gold font-bold text-body-lg glow-gold">SOLSTICE_RESTORED</span>
</div>
<div className="flex flex-col gap-2">
<div className="flex justify-between items-end">
<span className="text-label-caps">SOLSTICE_METER</span>
<span className="text-solstice-gold">100%</span>
</div>
<div className="h-6 w-full pixel-border p-[2px] flex gap-1">
<div className="h-full w-full bg-solstice-gold glow-gold"></div>
</div>
</div>
<div className="grid grid-cols-2 gap-2 mt-4">
<div className="pixel-border p-2 bg-terminal-green/10 flex flex-col items-center">
<span className="text-code-sm">CORRUPTION</span>
<span className="text-headline-md">0%</span>
</div>
<div className="pixel-border p-2 bg-terminal-green/10 flex flex-col items-center">
<span className="text-code-sm">LIGHT</span>
<span className="text-headline-md">100%</span>
</div>
</div>
<div className="mt-8"><SideNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} /></div>
</div>
</div>
</aside>
{/*  CENTER PANEL: TURING RECONSTRUCTION GRID  */}
<section className="col-span-6 flex flex-col gap-gutter h-full">
<div className="pixel-border-gold p-1 bg-panel-gray flex flex-col h-full relative">
<div className="bg-solstice-gold text-surface-dim px-4 py-1 font-headline-md flex justify-between items-center">
<span>RECONSTRUCTION_WORKSPACE</span>
<span className="animate-pulse">STABLE</span>
</div>
<div className="flex-1 flex flex-col items-center justify-center p-gutter">
{/*  3x3 Puzzle Grid  */}
<div className="grid grid-cols-3 gap-2 w-full max-w-md aspect-square pixel-border-gold p-2 bg-black/50 backdrop-blur-sm">
  {grid.map((piece, index) => (
    <div 
      key={`slot-${index}`} 
      className={`grid-cell flex items-center justify-center ${piece ? (piece.id === index ? 'pixel-border-gold' : 'border-2 border-warning-red/50') : 'border-2 border-dashed border-terminal-green/30 bg-terminal-green/5'}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDropOnGrid(e, index)}
    >
      {piece ? (
        <div 
          className={`w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 contrast-150 cursor-grab active:cursor-grabbing ${draggedId === piece.id ? 'opacity-50' : 'opacity-100'}`} 
          style={{ backgroundImage: TURING_URL, backgroundPosition: piece.bgPos }}
          draggable
          onDragStart={(e) => handleDragStart(e, piece.id)}
          onDragEnd={() => setDraggedId(null)}
        ></div>
      ) : (
        <span className="text-terminal-green animate-pulse text-xs">EMPTY</span>
      )}
    </div>
  ))}
</div>
{/*  Buffer area for remaining pieces  */}
<div 
  className="mt-8 flex gap-4 p-4 pixel-border bg-black/20 w-full overflow-x-auto min-h-[116px]"
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDropOnBuffer}
>
  {buffer.length === 0 && <span className="text-terminal-green/30 italic text-sm my-auto w-full text-center">BUFFER EMPTY</span>}
  {buffer.map((piece) => (
    <div 
      key={`buffer-${piece.id}`} 
      className="draggable-piece w-20 h-20 pixel-border hover:bg-terminal-green/20 flex-shrink-0 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => handleDragStart(e, piece.id)}
      onDragEnd={() => setDraggedId(null)}
    >
      <div 
        className={`w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 ${draggedId === piece.id ? 'opacity-50' : 'opacity-100'}`} 
        style={{ backgroundImage: TURING_URL, backgroundPosition: piece.bgPos }}
      ></div>
    </div>
  ))}
</div>
</div>
<div className="p-2 text-center text-code-sm bg-terminal-green/10 border-t-2 border-terminal-green">
                    DRAG_AND_DROP_TO_SEQUENCE_LOGIC_FRAGMENTS
                </div>
</div>
</section>
{/*  RIGHT PANEL: AI FINAL ARCHIVE  */}
<aside className="col-span-3 flex flex-col gap-gutter h-full">
<div className="pixel-border p-4 bg-panel-gray flex-1 flex flex-col">
<div className="font-headline-md text-headline-md mb-4 flex justify-between items-center">
<span>AI_FINAL_ARCHIVE</span>
<span className="w-2 h-2 bg-solstice-gold rounded-full glow-gold"></span>
</div>
<div className="flex-1 overflow-y-auto font-code-sm flex flex-col gap-4 mb-4" id="ai-chat">
<div className="flex flex-col gap-1">
<span className="text-solstice-gold">[A.L.A.N.]</span>
<div className="typing-container bg-terminal-green/5 p-3 pixel-border border-terminal-green/30">
                            CONGRATULATIONS, USER. THE RECONSTRUCTION IS COMPLETE. THE FRAGMENTS OF THE TURING MODULE HAVE BEEN RE-SEQUENCED WITH 100% ACCURACY.
                        </div>
</div>
<div className="flex flex-col gap-1">
<span className="text-solstice-gold">[A.L.A.N.]</span>
<div className="bg-terminal-green/5 p-3 pixel-border border-terminal-green/30">
                            YOU HAVE SUCCESSFULLY RESTORED THE MEMORY OF THE FATHER OF MODERN COMPUTING. THE SOLSTICE EVENT HAS BEEN DIVERTED. THE ARCHIVE IS NOW SECURE.
                        </div>
</div>
<div className="flex flex-col gap-1 italic opacity-70">
<span className="text-terminal-green">&gt; ARCHIVE_STATUS?</span>
</div>
<div className="flex flex-col gap-1">
<span className="text-solstice-gold">[A.L.A.N.]</span>
<div className="bg-terminal-green/5 p-3 pixel-border border-terminal-green/30">
                            ALL LOGIC GATES ARE PURIFIED. ENIGMA DECRYPTION MODULES REMAIN ACTIVE. WE ARE READY FOR THE FINAL HANDOFF TO THE ARCHIVE ROOT.
                        </div>
</div>
</div>
<div className="mt-auto">
<div className="flex items-center gap-2 pixel-border p-2 bg-black">
<span className="text-terminal-green">&gt;</span>
<input className="bg-transparent border-none focus:ring-0 text-terminal-green font-code-sm w-full" placeholder="Enter final command..." type="text"/>
</div>
<button 
  className={`w-full mt-2 font-bold py-2 transition-colors duration-0 ${isSolved ? 'bg-terminal-green text-surface-dim hover:bg-solstice-gold' : 'bg-terminal-green/20 text-terminal-green/50 cursor-not-allowed'}`}
  disabled={!isSolved}
  onClick={() => {
    if (isSolved) setCurrentScreen('RestorationComplete');
  }}
>
  INITIALIZE_FINAL_BOOT
</button>
</div>
</div>
</aside>
</main>
{/*  FOOTER: SYSTEM LOGS  */}
<footer className="terminal-border bg-surface shrink-0 px-margin py-unit flex justify-between items-center z-50 border-t-2 border-terminal-green h-12">
<div className="font-code-sm text-terminal-green flex items-center gap-4">
<span className="text-solstice-gold">[SOLSTICE_OS_V.1954]</span>
<div className="flex gap-2 text-soft-green" id="scrolling-logs">
<span>[14:23:01:002] SYNC_COMPLETE</span>
<span className="opacity-50">|</span>
<span>[14:23:02:441] TURING_ENIGMA_STABLE</span>
<span className="opacity-50">|</span>
<span>[14:23:03:910] SYSTEM_RESTORE_100%</span>
</div>
</div>
<div className="flex gap-gutter text-code-sm">
<a className="hover:text-solstice-gold transition-colors underline" href="#">MANUAL</a>
<a className="hover:text-solstice-gold transition-colors underline" href="#">DECRYPT</a>
<a className="hover:text-solstice-gold transition-colors underline text-solstice-gold" href="#">REPORT_ERROR</a>
</div>
</footer>
</div>
    </>
  );
}
