import React from 'react';

export default function AiTerminal() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b-2 border-terminal-green p-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-terminal-green">psychology</span>
        <h2 className="font-headline-md text-headline-md text-xs uppercase text-terminal-green">AI TERMINAL</h2>
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
      <div className="p-4 border-t-2 border-terminal-green flex flex-col gap-2 shrink-0">
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
    </div>
  );
}
