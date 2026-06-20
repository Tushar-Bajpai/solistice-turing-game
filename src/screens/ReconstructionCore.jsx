import React, { useEffect } from 'react';
import SideNav from '../components/SideNav';

export default function ReconstructionCore({ setCurrentScreen, currentScreen }) {
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
<header className="w-full flex justify-between items-center py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
<div className="font-headline-lg text-headline-lg text-terminal-green uppercase tracking-widest glow-green">
            SOLSTICE://TURING
        </div>
<div className="flex gap-gutter">
<button className="material-symbols-outlined text-terminal-green hover:bg-terminal-green hover:text-surface-dim p-1">terminal</button>
<button className="material-symbols-outlined text-terminal-green hover:bg-terminal-green hover:text-surface-dim p-1">settings</button>
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
{/*  Corrected fragments are styled with gold borders  */}
<div className="grid-cell pixel-border-gold overflow-hidden">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 contrast-150" data-alt="A pixelated, high-contrast digital reconstruction of Alan Turing's eye area in an emerald green phosphor monochrome style. The image is divided by sharp CRT scanlines, appearing on a vintage computer terminal screen with heavy retro-brutalist digital artifacts and a persistent neon glow." style={{"backgroundImage":"url('https","backgroundPosition":"0% 0%"}}></div>
</div>
<div className="grid-cell pixel-border-gold overflow-hidden">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 contrast-150" data-alt="A central upper segment of a digital portrait reconstruction showing the forehead of Alan Turing. The style is 1950s mainframe computing aesthetic with a green-on-black phosphor palette, heavy digital noise, and horizontal scanlines that give a sense of deep technological archaeology." style={{"backgroundImage":"url('https","backgroundPosition":"50% 0%"}}></div>
</div>
<div className="grid-cell pixel-border-gold overflow-hidden">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 contrast-150" data-alt="The right-side eye area fragment of a pixelated Alan Turing portrait. The visual language uses sharp, jagged pixel edges and glowing terminal green tones against deep shadows. Part of a larger grid system, this segment is illuminated with an intense phosphor bloom typical of old hardware monitors." style={{"backgroundImage":"url('https","backgroundPosition":"100% 0%"}}></div>
</div>
{/*  Row 2  */}
<div className="grid-cell pixel-border-gold overflow-hidden">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 contrast-150" data-alt="A fragment of a retro-computing portrait showing the side of a man's face in high-contrast neon green. The texture is gritty and pixelated, evoking the feeling of a recovered binary file from a corrupted database. The lighting is harsh and direct, following a brutalist digital aesthetic." style={{"backgroundImage":"url('https","backgroundPosition":"0% 50%"}}></div>
</div>
<div className="grid-cell pixel-border-gold overflow-hidden">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 contrast-150" data-alt="The central nose and cheek area of a digital reconstruction of Alan Turing. Rendered in a monochromatic terminal green with heavy scanlines and blooming phosphor glow. The image feels authoritative and historical, treated with a modern cyberpunk hacker interface overlay." style={{"backgroundImage":"url('https","backgroundPosition":"50% 50%"}}></div>
</div>
<div className="grid-cell border-2 border-dashed border-terminal-green/30 bg-terminal-green/5 flex items-center justify-center">
<span className="text-terminal-green animate-pulse">EMPTY</span>
</div>
{/*  Row 3  */}
<div className="grid-cell border-2 border-dashed border-terminal-green/30 bg-terminal-green/5 flex items-center justify-center">
<span className="text-terminal-green animate-pulse">EMPTY</span>
</div>
<div className="grid-cell pixel-border-gold overflow-hidden">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125 contrast-150" data-alt="The lower chin and suit collar area fragment of the Alan Turing reconstruction. The image is starkly green and black, with visible pixel geometry and a sense of flickering cathode-ray tube light. The style is strictly retro-brutalist, prioritizing structural digital clarity." style={{"backgroundImage":"url('https","backgroundPosition":"50% 100%"}}></div>
</div>
<div className="grid-cell border-2 border-dashed border-terminal-green/30 bg-terminal-green/5 flex items-center justify-center">
<span className="text-terminal-green animate-pulse">EMPTY</span>
</div>
</div>
{/*  Buffer area for remaining pieces  */}
<div className="mt-8 flex gap-4 p-4 pixel-border bg-black/20 w-full overflow-x-auto">
<div className="draggable-piece w-20 h-20 pixel-border cursor-grab hover:bg-terminal-green/20 flex-shrink-0">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125" data-alt="A puzzle fragment showing the ear and jawline of Alan Turing. The piece is glowing in a terminal green phosphor hue with sharp digital edges and CRT scanlines, appearing as a floating interactive element in a sophisticated 1950s-styled hacker interface." style={{"backgroundImage":"url('https","backgroundPosition":"100% 50%"}}></div>
</div>
<div className="draggable-piece w-20 h-20 pixel-border cursor-grab hover:bg-terminal-green/20 flex-shrink-0">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125" data-alt="A pixelated corner fragment of a digital portrait showing a suit shoulder in monochromatic green tones. High-contrast, dark background, with glowing green phosphor highlights and a gritty screen texture. Part of a digital archaeology user interface project." style={{"backgroundImage":"url('https","backgroundPosition":"0% 100%"}}></div>
</div>
<div className="draggable-piece w-20 h-20 pixel-border cursor-grab hover:bg-terminal-green/20 flex-shrink-0">
<div className="w-full h-full bg-cover grayscale sepia hue-rotate-[90deg] brightness-125" data-alt="The final puzzle piece of a high-contrast green monochrome reconstruction of Alan Turing. It shows the lower right corner of a portrait with suit details. The visual style is retro-brutalist and digital, featuring a thick pixelated aesthetic and glowing cathode-ray tube artifacts." style={{"backgroundImage":"url('https","backgroundPosition":"100% 100%"}}></div>
</div>
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
<span className="text-solstice-gold">[GEMINI_OS_ROOT]</span>
<div className="typing-container bg-terminal-green/5 p-3 pixel-border border-terminal-green/30">
                            CONGRATULATIONS, USER. THE RECONSTRUCTION IS COMPLETE. THE FRAGMENTS OF THE TURING MODULE HAVE BEEN RE-SEQUENCED WITH 100% ACCURACY.
                        </div>
</div>
<div className="flex flex-col gap-1">
<span className="text-solstice-gold">[GEMINI_OS_ROOT]</span>
<div className="bg-terminal-green/5 p-3 pixel-border border-terminal-green/30">
                            YOU HAVE SUCCESSFULLY RESTORED THE MEMORY OF THE FATHER OF MODERN COMPUTING. THE SOLSTICE EVENT HAS BEEN DIVERTED. THE ARCHIVE IS NOW SECURE.
                        </div>
</div>
<div className="flex flex-col gap-1 italic opacity-70">
<span className="text-terminal-green">&gt; ARCHIVE_STATUS?</span>
</div>
<div className="flex flex-col gap-1">
<span className="text-solstice-gold">[GEMINI_OS_ROOT]</span>
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
<button className="w-full mt-2 bg-terminal-green text-surface-dim font-bold py-2 hover:bg-solstice-gold transition-colors duration-0">
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
