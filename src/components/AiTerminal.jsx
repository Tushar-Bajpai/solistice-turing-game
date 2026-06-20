import React, { useState, useEffect, useRef } from 'react';

const GATE_KNOWLEDGE = {
  'AND': 'AND GATE: Outputs 1 only if BOTH inputs are 1.',
  'OR': 'OR GATE: Outputs 1 if AT LEAST ONE input is 1.',
  'XOR': 'XOR GATE: Outputs 1 if inputs are DIFFERENT.',
  'NAND': 'NAND GATE: Inverse of AND. Outputs 0 only if BOTH inputs are 1.',
  'NOR': 'NOR GATE: Inverse of OR. Outputs 1 only if BOTH inputs are 0.',
  'XNOR': 'XNOR GATE: Inverse of XOR. Outputs 1 if inputs are the SAME.'
};

const LOGIC_HINTS = {
  1: 'Basic AND logic. Output is 0 if any input is 0.',
  2: 'Basic OR logic. Output is 1 if any input is 1.',
  3: 'Both are 1, target is 1. Standard OR or AND applies.',
  4: 'Inputs differ. Target is 1. Exclusive OR required.',
  5: 'Inputs are same, target is 0. Exclusive OR required.',
  6: 'Basic OR logic. One input is 1.',
  7: 'Both inputs 1, but target is 0. You need an inverted AND.',
  8: 'Both inputs 0, target 1. You need an inverted OR.',
  9: 'Inputs are same, target is 1. Exclusive NOR required.',
  10: 'Boss Phase: Reconstruct the path step by step. First, resolve 1 and 0 to 0.'
};

export default function AiTerminal({ contextualState, gameState }) {
  const [messages, setMessages] = useState([
    { sender: 'SYSTEM', text: 'Connection established. Solstice Shell V1.0 active.' },
    { sender: 'CORE', text: 'AWAITING_INPUT_SIGNAL...' }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef(null);

  const safeContext = contextualState || { tier: 'UNKNOWN', level: 0, allowed: [], module: 'LOGIC' };
  const safeUnlocked = (gameState && gameState.unlockedGates) ? gameState.unlockedGates : [];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  const getHint = () => {
    if (safeContext.module === 'MEMORY') {
      return `MEMORY MODULE: Expected sequence length is ${safeContext.sequenceLength} bits. Chunk the binary string into blocks of 3 for easier retention.`;
    }
    return LOGIC_HINTS[safeContext.level] || 'No hint available for current state.';
  };

  const handleHint = () => {
    addMessage('USER', '> GIVE HINT');
    setTimeout(() => addMessage('AI', getHint()), 500);
  };

  const handleExplain = (gate) => {
    addMessage('USER', `> EXPLAIN ${gate}`);
    if (safeUnlocked.includes(gate)) {
      setTimeout(() => addMessage('ARCHIVE', GATE_KNOWLEDGE[gate]), 500);
    } else {
      setTimeout(() => addMessage('AI', `ERROR: Knowledge of [${gate}] is locked. Use it correctly to extract its archive data.`), 500);
    }
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addMessage('USER', `> ${inputValue.toUpperCase()}`);
      
      const cmd = inputValue.toUpperCase().trim();
      setTimeout(() => {
        if (cmd === 'HINT') {
          addMessage('AI', getHint());
        } else if (cmd.startsWith('EXPLAIN ')) {
          const gate = cmd.replace('EXPLAIN ', '').trim();
          if (GATE_KNOWLEDGE[gate]) {
            if (safeUnlocked.includes(gate)) {
              addMessage('ARCHIVE', GATE_KNOWLEDGE[gate]);
            } else {
              addMessage('AI', `ERROR: Knowledge of [${gate}] is locked.`);
            }
          } else {
            addMessage('AI', `UNKNOWN GATE: ${gate}`);
          }
        } else {
          addMessage('SYSTEM', `COMMAND NOT RECOGNIZED.`);
        }
      }, 400);
      
      setInputValue('');
    }
  };

  return (
    <div className="w-80 flex flex-col shrink-0 overflow-hidden h-full">
      <div className="flex-1 terminal-border bg-panel-gray flex flex-col overflow-hidden">
        <div className="border-b-2 border-terminal-green p-4 flex items-center gap-2 shrink-0 bg-surface">
          <span className="material-symbols-outlined text-terminal-green">psychology</span>
          <h2 className="font-headline-md text-headline-md text-xs uppercase text-terminal-green">AI TERMINAL</h2>
        </div>
        
        <div className="flex-grow p-4 font-code-sm text-soft-green overflow-y-auto space-y-4 custom-scrollbar" id="ai-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-terminal-green opacity-50 shrink-0">[{msg.sender}]:</span>
              <span className={msg.sender === 'USER' ? 'text-terminal-green' : msg.sender === 'ARCHIVE' ? 'text-solstice-gold' : 'text-soft-green'}>
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t-2 border-terminal-green flex flex-col gap-2 shrink-0 bg-surface">
          {safeContext.allowed && safeContext.allowed.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {safeContext.allowed.map(gate => (
                <button 
                  key={gate}
                  onClick={() => handleExplain(gate)}
                  className={`px-2 py-1 text-[10px] font-code-sm border ${safeUnlocked.includes(gate) ? 'border-solstice-gold text-solstice-gold hover:bg-solstice-gold hover:text-surface' : 'border-terminal-green/30 text-terminal-green hover:bg-terminal-green hover:text-surface'}`}
                >
                  EXPLAIN {gate}
                </button>
              ))}
            </div>
          )}
          <button 
            onClick={handleHint}
            className="w-full text-left p-2 font-code-sm text-terminal-green border border-terminal-green/30 hover:border-terminal-green hover:bg-terminal-green hover:text-surface"
          >
            &gt; GIVE HINT
          </button>
          <div className="mt-2 flex gap-2 terminal-border p-2">
            <span className="text-terminal-green">&gt;</span>
            <input 
              className="bg-transparent border-none outline-none focus:ring-0 p-0 text-terminal-green w-full font-code-sm" 
              placeholder="COMMAND..." 
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
