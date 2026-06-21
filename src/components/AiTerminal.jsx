import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TUTORIAL_SEQUENCES, HINTS_DB, TRAINING_MODULES } from '../data/terminalData';

const GATE_KNOWLEDGE = {
  'AND': 'AND GATE: Outputs 1 only if BOTH inputs are 1.',
  'OR': 'OR GATE: Outputs 1 if AT LEAST ONE input is 1.',
  'XOR': 'XOR GATE: Outputs 1 if inputs are DIFFERENT.',
  'NAND': 'NAND GATE: Inverse of AND. Outputs 0 only if BOTH inputs are 1.',
  'NOR': 'NOR GATE: Inverse of OR. Outputs 1 only if BOTH inputs are 0.',
  'XNOR': 'XNOR GATE: Inverse of XOR. Outputs 1 if inputs are the SAME.'
};

const AiTerminal = forwardRef(({ contextualState }, ref) => {
  const [messages, setMessages] = useState([
    { sender: 'SYSTEM', text: 'Connection established. Solstice Shell V1.0 active.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [hintTier, setHintTier] = useState(0);
  const [inAcademy, setInAcademy] = useState(false);
  const [isTutorial, setIsTutorial] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const safeContext = contextualState || { tier: 'UNKNOWN', level: 0, allowed: [], module: 'LOGIC' };
  
  let safeUnlocked = [];
  try {
    safeUnlocked = JSON.parse(localStorage.getItem('unlockedGates') || '[]');
  } catch (e) {
    safeUnlocked = [];
  }

  useEffect(() => {
    setHintTier(0);
  }, [safeContext.level, safeContext.difficulty]);

  useEffect(() => {
    const mod = safeContext.module;
    if (mod) {
      const isComplete = localStorage.getItem(`tutorial_${mod}`);
      if (!isComplete && TUTORIAL_SEQUENCES[mod]) {
        setIsTutorial(true);
        const seq = TUTORIAL_SEQUENCES[mod];
        let delay = 500;
        seq.forEach((msg, idx) => {
          setTimeout(() => {
            setMessages(prev => {
              if (localStorage.getItem(`tutorial_${mod}`)) return prev;
              return [...prev, msg];
            });
            if (idx === seq.length - 1) {
               setTimeout(() => {
                  localStorage.setItem(`tutorial_${mod}`, 'true');
                  setIsTutorial(false);
                  setMessages(prev => [...prev, { sender: 'CORE', text: 'AWAITING_INPUT_SIGNAL...' }]);
               }, 1000);
            }
          }, delay);
          delay += 2000;
        });
      } else if (messages.length === 1) {
        addMessage('CORE', 'AWAITING_INPUT_SIGNAL...');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeContext.module]);

  useImperativeHandle(ref, () => ({
    executeCommand(cmd) {
      handleExternalCommand(cmd);
    }
  }));

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

  const handleExternalCommand = (cmd) => {
    addMessage('USER', `> ${cmd}`);
    processCommand(cmd);
  };

  const getHintText = () => {
    const mod = safeContext.module;
    let hintArray = [];
    if (mod === 'LOGIC') {
      hintArray = HINTS_DB.LOGIC[safeContext.level] || ['Analyze the inputs.'];
    } else if (mod === 'MEMORY') {
      hintArray = HINTS_DB.MEMORY.DEFAULT;
    } else if (mod === 'CIPHER') {
      const typeStr = safeContext.difficulty || '1_CAESAR';
      hintArray = HINTS_DB.CIPHER[typeStr] || ['Analyze the cipher pattern.'];
    }
    
    if (hintArray.length === 0) return 'No hint available.';
    const idx = Math.min(hintTier, hintArray.length - 1);
    setHintTier(prev => prev + 1);
    return `[HINT ${idx + 1}/${hintArray.length}]: ${hintArray[idx]}`;
  };

  const handleHint = () => {
    handleExternalCommand('HINT');
  };

  const handleExplain = (gate) => {
    handleExternalCommand(`EXPLAIN ${gate}`);
  };

  const processCommand = (cmdStr) => {
    const cmd = cmdStr.toUpperCase().trim();
    
    setTimeout(() => {
      if (cmd === 'SKIP' || cmd === 'SKIP TUTORIAL') {
         if (isTutorial) {
            localStorage.setItem(`tutorial_${safeContext.module}`, 'true');
            setIsTutorial(false);
            addMessage('SYSTEM', 'TUTORIAL ABORTED.');
            addMessage('CORE', 'AWAITING_INPUT_SIGNAL...');
         } else {
            addMessage('SYSTEM', 'NO ACTIVE TUTORIAL TO SKIP.');
         }
         return;
      }

      if (cmd === 'HELP') {
        addMessage('SYSTEM', 'AVAILABLE COMMANDS: \n- HINT\n- EXPLAIN [GATE]\n- ACADEMY\n- SKIP');
        return;
      }

      if (cmd === 'ACADEMY') {
        setInAcademy(true);
        addMessage('ARCHIVE', '=== TURING ACADEMY ===\nSELECT A TRAINING MODULE:\n[1] Logic Basics\n[2] Memory Basics\n[3] Cipher Basics\n[4] Alan Turing Knowledge Base\n[EXIT] Leave Academy');
        return;
      }

      if (inAcademy) {
        if (cmd === 'EXIT') {
          setInAcademy(false);
          addMessage('SYSTEM', 'EXITING ACADEMY.');
          return;
        }
        if (TRAINING_MODULES[cmd]) {
          addMessage('ARCHIVE', TRAINING_MODULES[cmd]);
        } else {
          addMessage('SYSTEM', 'INVALID MODULE. TYPE 1, 2, 3, 4 OR EXIT.');
        }
        return;
      }

      if (cmd === 'HINT') {
        addMessage('AI', getHintText());
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
        addMessage('SYSTEM', `COMMAND NOT RECOGNIZED. TYPE 'HELP' FOR ASSISTANCE.`);
      }
    }, 400);
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const val = inputValue;
      setInputValue('');
      handleExternalCommand(val);
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
              <span className={`whitespace-pre-wrap ${msg.sender === 'USER' ? 'text-terminal-green' : msg.sender === 'ARCHIVE' ? 'text-solstice-gold' : 'text-soft-green'}`}>
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
});

AiTerminal.displayName = 'AiTerminal';
export default AiTerminal;
