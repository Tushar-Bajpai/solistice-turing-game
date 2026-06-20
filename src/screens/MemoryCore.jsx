import React, { useEffect } from 'react';
import SystemSidebar from '../components/SystemSidebar';

export default function MemoryCore({ setCurrentScreen, currentScreen, gameState }) {
  useEffect(() => {
    /* 
    Extracted Scripts from original HTML:
    
        // Typing effect for Gemini
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            const text = typingElement.innerText;
            typingElement.innerText = '';
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    typingElement.innerText += text.charAt(i);
                    i++;
                    setTimeout(type, 30);
                }
            };
            type();
        }

        // Simple binary flicker effect
        setInterval(() => {
            const state = document.querySelector('.binary-unit.animate-pulse');
            if (state) {
                state.style.opacity = Math.random() > 0.5 ? '1' : '0.5';
            }
        }, 150);
    

    */
  }, []);

  return (
    <>
      
<div className="crt-overlay"></div>
<div className="scanline"></div>
<div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
{/*  Top Navigation Bar (Shared Component)  */}
<header className="w-full flex justify-between items-center py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
<div className="font-headline-lg text-[24px] text-terminal-green uppercase tracking-widest">SOLSTICE://TURING</div>

<div className="flex gap-4">
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">settings</span>
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">terminal</span>
</div>
</header>
<main className="flex-grow flex gap-gutter overflow-hidden h-full">
{/*  Left Sidebar: Status & Restoration  */}
<SystemSidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} gameState={gameState} />
{/*  Center Panel: The Puzzle Core  */}
<section className="flex-1 flex flex-col gap-4">
<div className="pixel-border bg-panel-gray p-4 flex flex-col relative h-full">
{/*  Header  */}
<div className="flex justify-between items-center mb-6 border-b-2 border-terminal-green pb-2">
<div>
<h1 className="font-headline-md text-[20px] text-terminal-green">MEMORY CORE // MODULE_02</h1>
<p className="font-body-md text-soft-green opacity-80 mt-1">FLIP-FLOP CIRCUIT SYNCHRONIZATION</p>
</div>
<div className="text-right">
<div className="font-label-caps text-terminal-green">MODULE_STATE: <span className="text-solstice-gold animate-pulse">SYNC_REQUIRED</span></div>
<div className="font-code-sm text-soft-green opacity-50">ADDR: 0x4F_2A_99</div>
</div>
</div>
{/*  Main Puzzle Area  */}
<div className="flex-1 flex flex-col items-center justify-center gap-12 py-8 border border-terminal-green/20 relative overflow-hidden">
{/*  Background Shader for Atmosphere  */}

{/*  Circuit Visualization  */}
<div className="relative w-full max-w-2xl flex flex-col items-center">
<div className="flex items-center gap-12">
{/*  Input Nodes  */}
<div className="flex flex-col gap-4">
<div className="flex items-center gap-2">
<span className="font-label-caps text-soft-green">SET</span>
<div className="w-12 h-0.5 bg-terminal-green"></div>
</div>
<div className="flex items-center gap-2">
<span className="font-label-caps text-soft-green">RESET</span>
<div className="w-12 h-0.5 bg-terminal-green"></div>
</div>
</div>
{/*  Logic Gate (Flip-Flop)  */}
<div className="pixel-border w-48 h-32 flex flex-col items-center justify-center bg-surface relative z-10">
<span className="font-headline-md text-[14px] text-terminal-green mb-2">FLIP-FLOP</span>
<div className="flex gap-4">
<div className="flex flex-col items-center">
<span className="font-code-sm text-soft-green">Q</span>
<div className="w-8 h-8 border-2 border-solstice-gold gold-glow flex items-center justify-center font-body-lg">1</div>
</div>
<div className="flex flex-col items-center">
<span className="font-code-sm text-soft-green">!Q</span>
<div className="w-8 h-8 border-2 border-terminal-green opacity-50 flex items-center justify-center font-body-lg">0</div>
</div>
</div>
<div className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-0.5 bg-solstice-gold shadow-[0_0_10px_#FFD54A]"></div>
</div>
{/*  Output State  */}
<div className="flex flex-col items-center gap-2">
<span className="font-label-caps text-solstice-gold gold-glow">CURRENT STATE</span>
<div className="w-16 h-16 pixel-border border-solstice-gold flex items-center justify-center bg-surface-container-low">
<span className="font-headline-lg text-[32px] text-solstice-gold gold-glow">1</span>
</div>
</div>
</div>
{/*  Sequence Display  */}
<div className="mt-16 flex flex-col items-center gap-4 bg-surface-container-low p-6 pixel-border border-soft-green/30">
<span className="font-label-caps text-soft-green">INPUT SEQUENCE BUFFER</span>
<div className="flex gap-4">
<div className="binary-unit text-solstice-gold gold-glow font-body-lg bg-surface">1</div>
<div className="binary-unit text-soft-green opacity-50 font-body-lg bg-surface">0</div>
<div className="binary-unit text-solstice-gold gold-glow font-body-lg bg-surface">1</div>
<div className="binary-unit text-solstice-gold gold-glow font-body-lg bg-surface">1</div>
<div className="flex items-center mx-2">
<span className="material-symbols-outlined text-terminal-green animate-pulse">arrow_forward</span>
</div>
<div className="binary-unit border-dashed border-soft-green text-soft-green animate-pulse font-body-lg">?</div>
</div>
</div>
</div>
</div>
{/*  Interaction Footer  */}
<div className="mt-4 flex flex-col items-center gap-4">
<p className="font-body-lg text-soft-green text-center">Predict the final state of the circuit after the input sequence is processed.</p>
<div className="flex gap-6 mb-2">
<button className="w-20 h-20 pixel-border border-terminal-green font-headline-lg text-[32px] text-terminal-green hover:bg-terminal-green hover:text-black transition-none active:scale-95 active:ring-2 active:ring-solstice-gold group">
                            0
                        </button>
<button className="w-20 h-20 pixel-border border-solstice-gold font-headline-lg text-[32px] text-solstice-gold gold-glow hover:bg-solstice-gold hover:text-black transition-none active:scale-95 active:ring-2 active:ring-white">
                            1
                        </button>
</div>
<div className="font-code-sm text-soft-green/50 italic">[INPUT REQUIRED: SELECT BIT TO COMMIT STATE]</div>
</div>
</div>
</section>
{/*  Right AI Terminal (Gemini)  */}
<aside className="w-80 flex flex-col gap-4">
<div className="pixel-border bg-panel-gray flex-1 flex flex-col overflow-hidden">
{/*  AI Header  */}
<div className="p-3 bg-surface-container-high border-b-2 border-terminal-green flex justify-between items-center">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-terminal-green">terminal</span>
<span className="font-headline-md text-[12px] text-terminal-green">AI_ASSISTANT_GEMINI</span>
</div>
<div className="flex gap-1">
<div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
</div>
</div>
{/*  Chat History  */}
<div className="flex-1 p-4 overflow-y-auto terminal-scroll font-body-md text-soft-green flex flex-col gap-4">
<div className="flex flex-col gap-1">
<div className="flex gap-2">
<span className="text-terminal-green font-bold">SYSTEM:</span>
<span className="opacity-80">Memory Core Module_02 online. Corruption preventing state persistence.</span>
</div>
</div>
<div className="flex flex-col gap-1">
<div className="flex gap-2">
<span className="text-solstice-gold font-bold">GEMINI:</span>
<span className="typing-text">Greetings, operator. A Flip-Flop is a basic storage element. In this configuration, each '1' in the sequence flips the state, while '0' maintains the current value. Observe the sequence carefully...</span>
</div>
</div>
<div className="flex flex-col gap-1 mt-2">
<div className="flex gap-2 text-terminal-green">
<span className="font-bold">&gt;</span>
<span>Explain state flip logic.</span>
</div>
</div>
</div>
{/*  AI Actions  */}
<div className="p-2 border-t border-terminal-green/30 grid grid-cols-2 gap-2">
<button className="pixel-border border-terminal-green/50 text-terminal-green font-label-caps py-2 text-[12px] hover:bg-terminal-green hover:text-black">HINT</button>
<button className="pixel-border border-terminal-green/50 text-terminal-green font-label-caps py-2 text-[12px] hover:bg-terminal-green hover:text-black">EXPLAIN XOR</button>
</div>
{/*  Input Area  */}
<div className="p-3 bg-black flex items-center gap-2">
<span className="text-terminal-green font-bold text-[20px]">&gt;</span>
<input className="bg-transparent border-none outline-none text-terminal-green w-full font-body-md p-0 focus:ring-0" placeholder="Type command..." type="text"/>
<div className="cursor"></div>
</div>
</div>
{/*  Asset Preview / Identity Frame  */}
<div className="pixel-border h-48 bg-panel-gray overflow-hidden relative">
<div className="absolute top-2 left-2 z-10 bg-black/80 px-2 font-code-sm text-terminal-green">FRAG_ID: 1912-A</div>
<div className="w-full h-full bg-cover bg-center grayscale contrast-125 brightness-75" data-alt="A highly detailed, pixelated portrait of Alan Turing in a retro-cyberpunk terminal style. The image uses only black and terminal green colors with phosphor glow effects. His face is partially corrupted by digital noise and horizontal scanlines, suggesting an archive under recovery. The background is a dark mainframe grid with glowing binary code elements." style={{"backgroundImage":"url('https"}}></div>
<div className="absolute inset-0 border-2 border-terminal-green/20 pointer-events-none"></div>
</div>
</aside>
</main>
{/*  Bottom System Logs  */}
<footer className="terminal-border bg-surface shrink-0 px-6 py-2 flex justify-between items-center z-50 border-t-2 border-terminal-green">
<div className="flex gap-8 items-center h-full">
<div className="font-code-sm text-soft-green opacity-60 flex gap-4">
<span className="text-terminal-green">[12:44:02]</span>
<span>SYNC_MODULE_02: WAITING_FOR_USER_INPUT...</span>
</div>
<div className="font-code-sm text-soft-green opacity-60 flex gap-4">
<span className="text-terminal-green">[12:44:05]</span>
<span className="text-solstice-gold">MEMORY_STATE_STORED: ADDR_0x4F</span>
</div>
</div>
<div className="flex gap-6">
<a className="font-code-sm text-soft-green opacity-60 hover:text-terminal-green uppercase" href="#">REBOOT</a>
<a className="font-code-sm text-soft-green opacity-60 hover:text-terminal-green uppercase" href="#">DUMP</a>
<a className="font-code-sm text-soft-green opacity-60 hover:text-terminal-green uppercase" href="#">HELP</a>
</div>
<div className="font-code-sm text-soft-green opacity-60">
            [EST 1954] - TURING ARCHIVE RECOVERY PROTOCOL
        </div>
</footer>
</div>
    </>
  );
}
