import React, { useEffect } from 'react';
import SystemSidebar from '../components/SystemSidebar';
import AiTerminal from '../components/AiTerminal';

export default function AiCore({ setCurrentScreen, currentScreen, gameState }) {
  useEffect(() => {
    /* 
    Extracted Scripts from original HTML:
    
        document.addEventListener('mousemove', (e) => {
            const glow = document.querySelector('.scanline-anim');
            // Subtle lighting follow effect could be added here
        });

        // Typing effect for the AI chat
        const chatLogs = [
            "Analyzing synaptic weighting...",
            "Heuristic discrepancy detected in sector 4.",
            "Integrity check: 88.4%."
        ];

        let logIndex = 0;
        const appendLog = () => {
            if (logIndex < chatLogs.length) {
                const container = document.querySelector('.overflow-y-auto');
                const logDiv = document.createElement('div');
                logDiv.className = 'flex gap-2 opacity-0 transition-opacity duration-500';
                logDiv.innerHTML = `<span className="text-soft-green shrink-0">AI:</span> <span>${chatLogs[logIndex]}</span>`;
                container.insertBefore(logDiv, container.lastElementChild);
                setTimeout(() => logDiv.classList.remove('opacity-0'), 50);
                logIndex++;
                setTimeout(appendLog, 3000);
            }
        };

        setTimeout(appendLog, 2000);
    

    */
  }, []);

  return (
    <>
      
<div className="crt-overlay"></div>
<div className="scanline-anim"></div>
<div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
{/*  Header / TopAppBar  */}
<header className="w-full flex justify-between items-center py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
<div className="font-headline-lg text-headline-lg text-terminal-green uppercase phosphor-glow">
            SOLSTICE://TURING
        </div>
<div className="flex gap-gutter items-center">

<div className="flex gap-4">
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:scale-95">settings</span>
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:scale-95">terminal</span>
</div>
</div>
</header>
<main className="flex-grow flex gap-gutter overflow-hidden h-full">
{/*  Sidebar / SideNavBar  */}
<SystemSidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} gameState={gameState} />
{/*  Main Content Canvas  */}
<main className="flex-1 flex flex-col p-gutter gap-gutter bg-surface relative">
<div className="absolute inset-0 z-0 opacity-10">

</div>
{/*  Workspace Header  */}
<div className="flex justify-between items-end border-b-2 border-terminal-green pb-2 z-10">
<div className="flex flex-col">
<span className="text-soft-green font-label-caps text-label-caps">LOCATION: SYSTEM_ROOT / CORE_AI</span>
<h1 className="font-headline-lg text-headline-lg phosphor-glow">AI CORE // MODULE_04</h1>
</div>
<div className="text-terminal-green font-code-sm text-code-sm border-2 border-terminal-green px-2 py-1">
                    TIME_UNTIL_SYNC: 04:22:19
                </div>
</div>
{/*  Center Panel: Neural Network Puzzle  */}
<div className="flex-1 grid grid-cols-12 gap-gutter z-10">
<div className="col-span-8 pixel-border bg-panel-gray/80 p-gutter flex flex-col relative overflow-hidden">
<div className="flex justify-between items-center mb-6">
<span className="font-headline-md text-headline-md">NEURAL NETWORK RESTORATION</span>
<div className="flex items-center gap-2">
<span className="w-3 h-3 bg-solstice-gold gold-glow"></span>
<span className="font-label-caps text-label-caps">ACTIVE SYNAPSE</span>
</div>
</div>
<div className="flex-1 flex items-center justify-center relative">
{/*  Neural Connection Visualization  */}
<div className="w-full h-full max-w-2xl max-h-96 relative">
{/*  SVG for lines  */}
<svg className="absolute inset-0 w-full h-full" style={{"pointerEvents":"none"}}>
<path d="M 50,150 L 150,100" opacity="0.4" stroke="#00FF66" stroke-dasharray="4" stroke-width="2"></path>
<path d="M 50,150 L 150,200" opacity="0.4" stroke="#00FF66" stroke-dasharray="4" stroke-width="2"></path>
<path d="M 150,100 L 250,100" stroke="#FFD54A" stroke-width="3"></path>
<path d="M 150,200 L 250,200" opacity="0.4" stroke="#00FF66" stroke-dasharray="4" stroke-width="2"></path>
<path d="M 250,100 L 350,150" stroke="#FFD54A" stroke-width="3"></path>
<path className="animate-[pulse_1.5s_infinite]" d="M 350,150 L 450,150" stroke="#FFD54A" stroke-dasharray="8 4" stroke-width="3"></path>
{/*  Gap to bridge  */}
<circle cx="450" cy="150" fill="#FFD54A" r="4"></circle>
</svg>
{/*  Nodes as absolute div elements for interactivity  */}
<div className="absolute neural-node active" style={{"left":"50px","top":"150px"}}></div>
<div className="absolute neural-node active" style={{"left":"150px","top":"100px"}}></div>
<div className="absolute neural-node" style={{"left":"150px","top":"200px"}}></div>
<div className="absolute neural-node active" style={{"left":"250px","top":"100px"}}></div>
<div className="absolute neural-node active" style={{"left":"350px","top":"150px"}}></div>
{/*  Decision Point  */}
<div className="absolute top-[130px] right-[50px] flex flex-col gap-4 items-center">
<span className="font-label-caps text-label-caps text-solstice-gold mb-2">BRIDGE SYNAPTIC GAP</span>
<div className="flex gap-8">
<button className="w-16 h-16 pixel-border-gold bg-panel-gray flex items-center justify-center font-headline-lg text-headline-lg text-solstice-gold hover:bg-solstice-gold hover:text-surface transition-none group">
                                        0
                                        <span className="absolute -bottom-6 text-[10px] font-label-caps opacity-0 group-hover:opacity-100">LOGIC_PATH_A</span>
</button>
<button className="w-16 h-16 pixel-border border-terminal-green bg-panel-gray flex items-center justify-center font-headline-lg text-headline-lg text-terminal-green hover:bg-terminal-green hover:text-surface transition-none group">
                                        1
                                        <span className="absolute -bottom-6 text-[10px] font-label-caps opacity-0 group-hover:opacity-100">LOGIC_PATH_B</span>
</button>
</div>
</div>
</div>
</div>
<div className="mt-4 border-t border-terminal-green/30 pt-2 flex justify-between font-code-sm text-code-sm">
<div className="flex gap-4">
<span>LATENCY: 14ms</span>
<span>THROUGHPUT: 1.2 GB/s</span>
</div>
<div className="text-solstice-gold">AWAITING BINARY INPUT...</div>
</div>
</div>
{/*  Right Panel: Command Center  */}
<div className="col-span-4 flex flex-col gap-gutter">
<div className="flex-1 pixel-border bg-panel-gray/80 flex flex-col overflow-hidden">
<AiTerminal />
</div>
{/*  Portrait Preview Fragment  */}
<div className="h-48 pixel-border bg-surface p-2 flex flex-col relative">
<div className="font-label-caps text-label-caps mb-1 flex justify-between">
<span>FRAGMENT 3/4 RECOVERED</span>
<span className="text-soft-green">75% VISIBLE</span>
</div>
<div className="flex-1 bg-black relative overflow-hidden flex flex-wrap">
{/*  3/4 Portrait Mosaic  */}
<div className="w-1/2 h-1/2 pixel-border border-terminal-green/20 bg-black flex items-center justify-center overflow-hidden pt-4 pr-2">
<pre className="text-[4px] leading-[4px] sm:text-[6px] sm:leading-[6px] text-terminal-green">
{`
    .@@@@@@
   @@@@@@@@
  @@@      
  @@  (o)  
  @@       
`}
</pre>
</div>
<div className="w-1/2 h-1/2 pixel-border border-terminal-green/20 bg-black flex items-center justify-center overflow-hidden pt-4 pl-2">
<pre className="text-[4px] leading-[4px] sm:text-[6px] sm:leading-[6px] text-terminal-green">
{`
@@@@@@.    
@@@@@@@@   
      @@@  
  (o)  @@  
       @@  
`}
</pre>
</div>
<div className="w-1/2 h-1/2 pixel-border border-terminal-green/20 bg-black flex items-center justify-center overflow-hidden pb-4 pr-2">
<pre className="text-[4px] leading-[4px] sm:text-[6px] sm:leading-[6px] text-terminal-green">
{`
  @@    _  
  @@@  \\_  
   @@@@@@  
    '@@@@  
`}
</pre>
</div>
<div className="w-1/2 h-1/2 border-2 border-dashed border-warning-red flex items-center justify-center bg-warning-red/10">
<span className="text-warning-red font-label-caps text-label-caps animate-pulse">LOCKED</span>
</div>
</div>
</div>
</div>
</div>
{/*  Bottom Panel: System Logs  */}
<footer className="h-32 terminal-border bg-surface shrink-0 p-4 font-code-sm text-code-sm flex flex-col gap-1 overflow-hidden relative">
<div className="absolute top-0 right-4 px-2 bg-surface text-terminal-green opacity-50 text-[10px] uppercase font-headline-md">Live Stream logs</div>
<div className="flex flex-col gap-1" id="log-container">
<div className="flex gap-4">
<span className="text-soft-green opacity-50">[21:14:02:12]</span>
<span className="text-terminal-green">AI CORE SYNC IN PROGRESS...</span>
</div>
<div className="flex gap-4">
<span className="text-soft-green opacity-50">[21:14:05:44]</span>
<span className="text-soft-green">NEURAL PATHWAY ALPHA RESTORED</span>
</div>
<div className="flex gap-4">
<span className="text-soft-green opacity-50">[21:14:09:88]</span>
<span className="text-solstice-gold">TURING PORTRAIT FRAGMENT 3/4 RECOVERED</span>
</div>
</div>
</footer>
</main>
</main>
</div>


    </>
  );
}
