import React, { useEffect } from 'react';
import SystemSidebar from '../components/SystemSidebar';
import AiTerminal from '../components/AiTerminal';

export default function CipherCore({ setCurrentScreen, currentScreen, gameState }) {
  useEffect(() => {
    /* 
    Extracted Scripts from original HTML:
    
        // Micro-interaction: Typing effect simulation
        document.querySelectorAll('.typing-text').forEach(el => {
            const text = el.innerText;
            el.innerText = '';
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    el.innerText += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 20);
        });

        // Interactive DIP switches simulation or Logic Bit Toggles
        // Not explicitly requested but fits the design system
    

    */
  }, []);

  return (
    <>
      
<div className="scanline-overlay"></div>
<div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
{/*  Top Navigation Bar (Shared Component)  */}
<header className="w-full flex justify-between items-center py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
<div className="font-headline-lg text-headline-lg text-terminal-green uppercase">SOLSTICE://TURING</div>

<div className="flex gap-4">
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:scale-110 active:scale-95 transition-transform">settings</span>
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:scale-110 active:scale-95 transition-transform">terminal</span>
</div>
</header>
{/*  Main Content Container  */}
<main className="flex-grow flex gap-gutter overflow-hidden h-full">
{/*  Left Sidebar: System Status (SideNavBar Shared Hybrid)  */}
<SystemSidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} gameState={gameState} />
{/*  Center Panel: Cipher Core  */}
<section className="flex-1 flex flex-col bg-panel-gray border-2 border-terminal-green overflow-hidden">
<header className="border-b-2 border-terminal-green p-3 flex justify-between items-center bg-surface">
<h2 className="font-headline-md text-headline-md glow-green">CIPHER CORE // MODULE_03</h2>
<div className="flex items-center gap-2 text-soft-green font-code-sm">
<span className="w-2 h-2 bg-terminal-green rounded-full animate-ping"></span>
                    ACTIVE_RECONSTRUCTION: TRUE
                </div>
</header>
<div className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto crt-flicker">
{/*  Encrypted String Display  */}
<div className="flex flex-col items-center gap-4">
<div className="text-solstice-gold font-code-sm uppercase tracking-tighter">&gt;&gt;&gt; INTERCEPTED_SIGNAL_STREAM &lt;&lt;&lt;</div>
<div className="bg-surface border-2 border-terminal-green p-8 w-full text-center">
<span className="font-headline-lg text-[48px] tracking-[1rem] glow-green block mb-4">KHOOR</span>
<span className="font-code-sm text-soft-green opacity-50">ENCRYPTION_TYPE: CAESAR_SHIFT_3</span>
</div>
</div>
{/*  Puzzle Interface Bento Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{/*  Key Reference Table  */}
<div className="border-2 border-terminal-green p-4 bg-surface">
<div className="font-label-caps text-label-caps text-solstice-gold mb-3 border-b border-terminal-green pb-1">CYPHER KEY: SHIFT +N</div>
<div className="grid grid-cols-6 gap-2 text-center font-code-sm text-terminal-green">
<div className="border border-terminal-green py-1">A → D</div>
<div className="border border-terminal-green py-1">B → E</div>
<div className="border border-terminal-green py-1">C → F</div>
<div className="border border-terminal-green py-1">D → G</div>
<div className="border border-terminal-green py-1">E → H</div>
<div className="border border-terminal-green py-1">F → I</div>
<div className="border border-terminal-green py-1">G → J</div>
<div className="border border-terminal-green py-1">H → K</div>
<div className="border border-terminal-green py-1">I → L</div>
<div className="border border-terminal-green py-1">J → M</div>
<div className="border border-terminal-green py-1">K → N</div>
<div className="border border-terminal-green py-1">L → O</div>
</div>
<div className="mt-4 font-code-sm text-soft-green opacity-70 italic text-center">...TABLE_CONTINUES...</div>
</div>
{/*  Input Area  */}
<div className="flex flex-col gap-4">
<div className="flex flex-col gap-2">
<label className="font-label-caps text-label-caps text-terminal-green">DECODER_INPUT_PROMPT:</label>
<input className="cipher-input bg-surface border-2 border-terminal-green p-4 font-headline-md text-solstice-gold placeholder-terminal-green/30 text-center uppercase" placeholder="_ENTER_DECRYPTED_TEXT" type="text"/>
</div>
<button className="bg-terminal-green text-surface font-headline-md py-4 hover:bg-solstice-gold transition-colors">EXECUTE_CIPHER_SOLVE</button>
</div>
</div>
{/*  Binary to ASCII (Reference)  */}
<div className="border-2 border-terminal-green p-4 bg-surface relative overflow-hidden">

<div className="font-label-caps text-label-caps text-solstice-gold mb-2">BITSTREAM_REFERENCE_ARCHIVE</div>
<div className="grid grid-cols-4 gap-x-8 gap-y-1 font-code-sm text-soft-green">
<div className="flex justify-between"><span>01001000</span><span>H</span></div>
<div className="flex justify-between"><span>01000101</span><span>E</span></div>
<div className="flex justify-between"><span>01001100</span><span>L</span></div>
<div className="flex justify-between"><span>01001100</span><span>L</span></div>
<div className="flex justify-between"><span>01001111</span><span>O</span></div>
<div className="flex justify-between"><span>01010111</span><span>W</span></div>
<div className="flex justify-between"><span>01010010</span><span>R</span></div>
<div className="flex justify-between"><span>01000100</span><span>D</span></div>
</div>
</div>
</div>
{/*  System Logs (Bottom Pane)  */}
<footer className="border-t-2 border-terminal-green bg-surface h-24 overflow-y-auto p-2 font-code-sm text-soft-green">
<div className="flex gap-4">
<span className="text-terminal-green opacity-40">[14:32:05:22]</span>
<span>ENCRYPTION KEY SYNCED</span>
</div>
<div className="flex gap-4">
<span className="text-terminal-green opacity-40">[14:32:05:48]</span>
<span>CIPHER_CORE_HEURISTICS: ONLINE</span>
</div>
<div className="flex gap-4">
<span className="text-terminal-green opacity-40">[14:32:06:12]</span>
<span className="text-solstice-gold">WARNING: PARTIAL SIGNAL DEGRADATION IN SECTOR 7G</span>
</div>
<div className="flex gap-4">
<span className="text-terminal-green opacity-40">[14:32:06:33]</span>
<span>HEURISTIC SCAN COMPLETE: READY FOR DECODER INPUT</span>
</div>
</footer>
</section>
{/*  Right Panel: AI Terminal & Turing Portrait  */}
<aside className="hidden lg:flex flex-col w-80 gap-gutter">
<div className="terminal-border bg-panel-gray flex-1 flex flex-col overflow-hidden">
<AiTerminal />
</div>
{/*  Portrait Fragment (50%)  */}
<div className="h-64 bg-surface border-2 border-terminal-green relative overflow-hidden flex items-center justify-center">
{/*  Portrait Image with data-alt  */}
<div className="absolute inset-0 grayscale contrast-150 opacity-40 mix-blend-screen" data-alt="A high-contrast, stylized digital portrait of Alan Turing, rendered in the aesthetic of a corrupted 1950s monitor. The image is split into quadrants, with the top-left and top-right sections clearly visible while the bottom half remains obscured by digital noise and green phosphor glitches. The lighting is harsh and dramatic, emphasizing the historical and intellectual gravitas of the subject against a pitch-black background with vibrant terminal-green scanlines." style={{"backgroundImage":"url('https"}}>
</div>
{/*  Masking Overlay to simulate 50% completion  */}
<div className="absolute inset-0 flex flex-col">
<div className="flex-1 flex">
<div className="flex-1"></div> {/*  Top Left Visible  */}
<div className="flex-1"></div> {/*  Top Right Visible  */}
</div>
<div className="flex-1 bg-background flex items-center justify-center border-t-2 border-terminal-green">
<span className="font-headline-md text-xs text-terminal-green animate-pulse">LOCKED: 0x44F2</span>
</div>
</div>
<div className="relative z-10 font-label-caps text-label-caps bg-background px-2 border border-terminal-green shadow-[0_0_10px_rgba(0,255,102,0.5)]">
                    SUBJECT: TURING_A
                </div>
</div>
</aside>
</main>
{/*  Footer (Shared Component)  */}
<footer className="terminal-border bg-surface shrink-0 px-gutter py-2 flex justify-between items-center z-50 border-t-2 border-terminal-green">
<div className="font-headline-lg-mobile text-headline-lg-mobile text-terminal-green">[EST 1954]</div>
<div className="font-code-sm text-code-sm text-soft-green opacity-80">TURING ARCHIVE RECOVERY PROTOCOL</div>
<nav className="flex gap-4">
<a className="font-code-sm text-code-sm text-soft-green opacity-60 hover:text-terminal-green transition-opacity" href="#">REBOOT</a>
<a className="font-code-sm text-code-sm text-soft-green opacity-60 hover:text-terminal-green transition-opacity" href="#">DUMP</a>
<a className="font-code-sm text-code-sm text-soft-green opacity-60 hover:text-terminal-green transition-opacity" href="#">HELP</a>
</nav>
</footer>
</div>
    </>
  );
}
