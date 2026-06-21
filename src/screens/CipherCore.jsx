import React, { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import SystemSidebar from '../components/SystemSidebar';
import AiTerminal from '../components/AiTerminal';
import { cipherQuestions } from '../data/cipherQuestions';
import { useGame } from '../context/GameContext';

export default function CipherCore({ setCurrentScreen, currentScreen }) {
  const { setGameState, updateProgress, revokeProgress, updateSolstice, updateCorruption, addSystemLog, systemLogs } = useGame();
  const safeSystemLogs = systemLogs || [];
  const [userInput, setUserInput] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showGuide, setShowGuide] = useState(() => localStorage.getItem('hasSeenCipherGuide') === null);
  const logsEndRef = useRef(null);
  const terminalRef = useRef(null);

  const handleHelp = (e) => {
    e?.preventDefault();
    terminalRef.current?.executeCommand('HELP');
  };

  const initializeState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [cipherLevel, setCipherLevel] = useState(() => initializeState('cipherLevel', 1));
  const [cipherHealth, setCipherHealth] = useState(() => initializeState('cipherHealth', 0));
  const [currentPuzzle, setCurrentPuzzle] = useState(() => initializeState('currentPuzzle', cipherQuestions[0]));
  const bonusAttempts = parseInt(localStorage.getItem('solsticeBonusAttempts') || '0');
  const baseAttempts = 3 + bonusAttempts;

  const [attemptsRemaining, setAttemptsRemaining] = useState(() => initializeState('attemptsRemaining', baseAttempts));
  const [archivesRestored, setArchivesRestored] = useState(() => initializeState('archivesRestored', 0));
  const [cipherScore, setCipherScore] = useState(() => initializeState('cipherScore', 0));
  const [unlockedTuringArchives, setUnlockedTuringArchives] = useState(() => initializeState('unlockedTuringArchives', []));

  const TURING_FACTS = {
    3: "Alan Turing helped decode the Enigma machine during World War II.",
    6: "He formalized the concepts of algorithm and computation with the Turing machine.",
    9: "Turing proposed the 'Turing Test' in 1950 as a criterion of machine intelligence."
  };

  const [logs, setLogs] = useState([
    { time: "14:32:05:22", msg: "ENCRYPTION KEY SYNCED", isWarning: false },
    { time: "14:32:05:48", msg: "CIPHER_CORE_HEURISTICS: ONLINE", isWarning: false },
    { time: "14:32:06:12", msg: "WARNING: PARTIAL SIGNAL DEGRADATION IN SECTOR 7G", isWarning: true },
    { time: "14:32:06:33", msg: "HEURISTIC SCAN COMPLETE: READY FOR DECODER INPUT", isWarning: false }
  ]);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('cipherLevel', JSON.stringify(cipherLevel));
    localStorage.setItem('cipherHealth', JSON.stringify(cipherHealth));
    localStorage.setItem('currentPuzzle', JSON.stringify(currentPuzzle));
    localStorage.setItem('attemptsRemaining', JSON.stringify(attemptsRemaining));
    localStorage.setItem('archivesRestored', JSON.stringify(archivesRestored));
    localStorage.setItem('cipherScore', JSON.stringify(cipherScore));
    localStorage.setItem('unlockedTuringArchives', JSON.stringify(unlockedTuringArchives));
  }, [cipherLevel, cipherHealth, currentPuzzle, attemptsRemaining, archivesRestored, cipherScore, unlockedTuringArchives]);

  useEffect(() => {
    if (showCompletion) {
      animate('#completion-overlay', {
        opacity: [0, 1],
        duration: 1500,
        ease: 'inOutQuad'
      });
      animate('.completion-text', {
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: stagger(600, {start: 500}),
        duration: 1500,
        ease: 'outElastic(1, .8)'
      });
      
      setTimeout(() => {
        if (updateProgress) updateProgress('cipher');
        setCurrentScreen('MainHub');
      }, 5000);
    }
  }, [showCompletion, setCurrentScreen, updateProgress]);

  const generateTimestamp = () => {
    const now = new Date();
    const ms = now.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${ms}`;
  };

  const handleExecuteCipher = () => {
    if (isSolved || attemptsRemaining <= 0) return;
    
    const time = generateTimestamp();
    const cleanInput = userInput.trim().toUpperCase();
    
    if (cleanInput === '') return;
    
    if (cleanInput === currentPuzzle.answer) {
      setIsSolved(true);
      setCipherScore(prev => prev + 100);
      setArchivesRestored(prev => prev + 1);
      setCipherHealth(prev => Math.min(100, prev + 10));
      
      const unlockedLogs = [];
      if (TURING_FACTS[cipherLevel] && !unlockedTuringArchives.includes(cipherLevel)) {
        setUnlockedTuringArchives(prev => [...prev, cipherLevel]);
        unlockedLogs.push({ time: generateTimestamp(), msg: "TURING ARCHIVE UNLOCKED", isWarning: true });
        unlockedLogs.push({ time: generateTimestamp(), msg: TURING_FACTS[cipherLevel], isWarning: false });
      }

      const isFinal = cipherLevel >= cipherQuestions.length;

      setLogs(prev => [...prev, 
        { time, msg: `DECRYPTING HASH: [${cleanInput}]...`, isWarning: false },
        { time: generateTimestamp(), msg: "COMMUNICATION RESTORED.", isWarning: false },
        ...(isFinal ? [
          { time: generateTimestamp(), msg: "ENCRYPTION NETWORK RESTORED", isWarning: false },
          { time: generateTimestamp(), msg: "COMMUNICATION CHANNELS ONLINE", isWarning: false }
        ] : []),
        ...unlockedLogs
      ]);
      
      // Removed manual corruption level set in setGameState since we use updateCorruption
      setGameState(prev => ({
        ...prev
      }));
      updateSolstice(2.5);
      updateCorruption(-2);
      
      if (addSystemLog) addSystemLog(`[SUCCESS]\nCipher Decrypted\n\n+2.5% Light Restoration\n-2% Corruption`);

      if (isFinal) {
        setShowCompletion(true);
      } else {
        setTimeout(() => {
          setCipherLevel(prev => {
            const nextIndex = prev % cipherQuestions.length;
            setCurrentPuzzle(cipherQuestions[nextIndex]);
            setLogs(logsPrev => [...logsPrev, { time: generateTimestamp(), msg: `LEVEL ${prev + 1} INITIALIZED.`, isWarning: false }]);
            return prev + 1;
          });
          setIsSolved(false);
          setUserInput('');
          setShowHint(false);
          setAttemptsRemaining(baseAttempts);
        }, 3000);
      }
    } else {
      setAttemptsRemaining(prev => prev - 1);
      updateCorruption(1);
      
      if (addSystemLog) addSystemLog(`[WARNING]\nInvalid Hash\n\n+1% Corruption`);

      setLogs(prev => [...prev, 
        { time, msg: `DECRYPTING HASH: [${cleanInput}]...`, isWarning: false },
        { time: generateTimestamp(), msg: `INVALID HASH DETECTED. ATTEMPTS REMAINING: ${attemptsRemaining - 1}`, isWarning: true }
      ]);
      setUserInput('');
    }
  };

  const handleRestartLevel = (e) => {
    if (e) e.preventDefault();
    setAttemptsRemaining(baseAttempts);
    setIsSolved(false);
    setUserInput('');
    setLogs(prev => [...prev, { time: generateTimestamp(), msg: "LEVEL RESTARTED.", isWarning: false }]);
  };

  const handleResetCore = (e) => {
    if (e) e.preventDefault();
    setCipherLevel(1);
    setCipherHealth(0);
    revokeProgress('cipher');
    setCurrentPuzzle(cipherQuestions[0]);
    setAttemptsRemaining(baseAttempts);
    setArchivesRestored(0);
    setCipherScore(0);
    setIsSolved(false);
    setUserInput('');
    setShowHint(false);
    setShowResetConfirm(false);
    
    localStorage.removeItem('cipherLevel');
    localStorage.removeItem('cipherHealth');
    localStorage.removeItem('currentPuzzle');
    localStorage.removeItem('attemptsRemaining');
    localStorage.removeItem('archivesRestored');
    localStorage.removeItem('cipherScore');
    localStorage.removeItem('unlockedTuringArchives');
    
    setLogs([{ time: generateTimestamp(), msg: "CORE RESET. SYSTEM MEMORY WIPED.", isWarning: true }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleExecuteCipher();
    }
  };

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
      
<div className="crt-overlay"></div>
<div className="scanline"></div>
<div className="flex flex-col h-screen p-gutter gap-gutter flicker-layer">
{/*  Top Navigation Bar (Shared Component)  */}
<header className="w-full flex justify-between items-center h-16 py-unit terminal-border border-b-2 border-terminal-green bg-surface px-gutter shrink-0">
<div className="font-headline-lg text-headline-lg text-terminal-green uppercase tracking-tighter phosphor-glow">SOLSTICE://TURING</div>

<div className="flex items-center gap-4">
<button onClick={() => setShowGuide(true)} className="font-code-sm text-terminal-green hover:text-solstice-gold border border-terminal-green/30 px-2 py-1 transition-colors">GUIDE</button>
<button onClick={handleHelp} className="font-code-sm text-terminal-green hover:text-solstice-gold border border-terminal-green/30 px-2 py-1 transition-colors">HELP</button>
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">terminal</span>
<span className="material-symbols-outlined text-terminal-green cursor-pointer hover:bg-terminal-green hover:text-surface p-1">settings</span>
</div>
</header>
{/*  Main Content Container  */}
<main className="flex-grow flex gap-gutter overflow-hidden h-full">
{/*  Left Sidebar: System Status (SideNavBar Shared Hybrid)  */}
<SystemSidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
{/*  Center Panel: Cipher Core  */}
<section className="flex-1 flex flex-col bg-panel-gray border-2 border-terminal-green overflow-hidden relative">
{showCompletion && (
  <div id="completion-overlay" className="absolute inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-8 backdrop-blur-md border-4 border-terminal-green opacity-0">
    <h1 className="font-headline-lg text-[64px] text-terminal-green mb-4 text-center leading-tight completion-text opacity-0">ENCRYPTION NETWORK RESTORED</h1>
    <p className="font-code-sm text-terminal-green mb-12 text-center max-w-lg completion-text opacity-0">
      COMMUNICATION CHANNELS ONLINE
    </p>
  </div>
)}
{showGuide && (
  <div className="absolute inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-8 backdrop-blur-md">
    <h1 className="font-headline-lg text-[48px] text-terminal-green mb-4 text-center leading-tight">CIPHER CORE: GUIDE</h1>
    <div className="font-code-sm text-soft-green mb-12 max-w-2xl space-y-4 border-2 border-terminal-green p-6 bg-surface shadow-[0_0_20px_rgba(0,255,102,0.15)]">
      <p><span className="text-terminal-green font-bold">&gt; OBJECTIVE:</span> Decrypt the <span className="text-solstice-gold uppercase">Intercepted Signal Stream</span>.</p>
      <p><span className="text-terminal-green font-bold">&gt; METHOD:</span> Identify the encryption type (e.g., CAESAR_SHIFT_3 means shift letters forward by 3 in the alphabet).</p>
      <p><span className="text-terminal-green font-bold">&gt; INPUT:</span> Use the <span className="text-solstice-gold uppercase">Decoder Input</span> to enter the plain text.</p>
      <p><span className="text-terminal-green font-bold">&gt; RULES:</span> You have limited attempts. Correct decryptions restore the archive health and uncover hidden files.</p>
      <p className="pt-4 border-t border-terminal-green/30"><span className="text-terminal-green font-bold">Need assistance?</span> The AI Terminal can provide contextual hints and puzzle analysis.</p>
    </div>
    <div className="flex gap-6 w-full max-w-md">
      <button 
        className="flex-1 bg-terminal-green text-surface font-headline-md py-4 hover:bg-solstice-gold transition-colors"
        onClick={() => {
          setShowGuide(false);
          localStorage.setItem('hasSeenCipherGuide', 'true');
        }}
      >
        START DECRYPTION
      </button>
      <button 
        className="flex-1 bg-surface border-2 border-terminal-green text-terminal-green font-headline-md py-4 hover:bg-terminal-green hover:text-surface transition-colors"
        onClick={(e) => {
          setShowGuide(false);
          localStorage.setItem('hasSeenCipherGuide', 'true');
          handleHelp(e);
        }}
      >
        ASK AI FOR HELP
      </button>
    </div>
  </div>
)}
{showResetConfirm && (
  <div className="absolute inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-8 backdrop-blur-md">
    <h1 className="font-headline-lg text-[48px] text-solstice-gold mb-4 text-center leading-tight">WARNING: CORE PURGE</h1>
    <p className="font-code-sm text-solstice-gold mb-12 opacity-80 text-center max-w-lg">
      ARE YOU SURE YOU WANT TO DUMP ALL PROGRESS? THIS WILL WIPE MEMORY, SCORE, AND RESTORE SETTINGS TO FACTORY DEFAULTS.
    </p>
    <div className="flex gap-6 w-full max-w-md">
      <button 
        className="flex-1 bg-solstice-gold text-surface font-headline-md py-4 hover:opacity-80 transition-opacity"
        onClick={handleResetCore}
      >
        CONFIRM PURGE
      </button>
      <button 
        className="flex-1 bg-surface border-2 border-terminal-green text-terminal-green font-headline-md py-4 hover:bg-terminal-green hover:text-surface transition-colors"
        onClick={() => setShowResetConfirm(false)}
      >
        CANCEL
      </button>
    </div>
  </div>
)}
{attemptsRemaining <= 0 && (
  <div className="absolute inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-8 backdrop-blur-md">
    <h1 className="font-headline-lg text-[64px] text-solstice-gold mb-2 animate-pulse text-center leading-tight">ARCHIVE CORRUPTED</h1>
    <p className="font-code-sm text-solstice-gold mb-12 opacity-80 text-center max-w-lg">
      CRITICAL ERROR: MAXIMUM DECRYPTION ATTEMPTS EXCEEDED. DATA STREAM SEVERED.
    </p>
    <div className="flex gap-6 w-full max-w-md">
      <button 
        className="flex-1 bg-surface border-2 border-terminal-green text-terminal-green font-headline-md py-4 hover:bg-terminal-green hover:text-surface transition-colors"
        onClick={handleRestartLevel}
      >
        RETRY LEVEL
      </button>
      <button 
        className="flex-1 bg-solstice-gold text-surface font-headline-md py-4 hover:opacity-80 transition-opacity"
        onClick={() => setCurrentScreen('MainHub')}
      >
        RETURN TO HUB
      </button>
    </div>
  </div>
)}
<header className="border-b-2 border-terminal-green p-3 flex justify-between items-center bg-surface">
<h2 className="font-headline-md text-headline-md glow-green truncate">CIPHER CORE // LEVEL_{cipherLevel} // TIER_{currentPuzzle.difficulty}</h2>
<div className="flex items-center gap-2 text-soft-green font-code-sm shrink-0">
<span className="w-2 h-2 bg-terminal-green rounded-full animate-ping"></span>
                    {isSolved ? "COMMUNICATION RESTORED" : `ARCHIVE HEALTH: ${cipherHealth}%`}
                </div>
</header>
<div className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto crt-flicker">
{/*  Encrypted String Display  */}
<div className="flex flex-col items-center gap-4">
<div className="text-solstice-gold font-code-sm uppercase tracking-tighter">&gt;&gt;&gt; INTERCEPTED_SIGNAL_STREAM &lt;&lt;&lt;</div>
<div className="bg-surface border-2 border-terminal-green p-8 w-full text-center">
<span className="font-headline-lg text-[48px] tracking-[1rem] glow-green block mb-4">
  {isSolved ? currentPuzzle.answer : currentPuzzle.encryptedMessage}
</span>
<span className="font-code-sm text-soft-green opacity-50">ENCRYPTION_TYPE: {currentPuzzle.type}</span>
</div>
</div>
{/*  Puzzle Interface Bento Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{/*  Hint / Puzzle Analysis Area  */}
<div className="border-2 border-terminal-green p-4 bg-surface flex flex-col justify-between">
<div className="font-label-caps text-label-caps text-solstice-gold mb-3 border-b border-terminal-green pb-1">PUZZLE_ANALYSIS</div>
<div className="flex-1 flex items-center justify-center font-code-sm text-soft-green text-center p-4">
  {showHint ? currentPuzzle.hint : "ANALYSIS_PENDING"}
</div>
{!showHint && (
  <button 
    className="bg-terminal-green text-surface font-headline-md py-2 hover:bg-solstice-gold transition-colors mt-4"
    onClick={() => setShowHint(true)}
  >
    REQUEST_HINT
  </button>
)}
</div>
{/*  Input Area  */}
<div className="flex flex-col gap-4">
<div className="flex flex-col gap-2">
<div className="flex justify-between items-end">
  <label className="font-label-caps text-label-caps text-terminal-green">DECODER_INPUT_PROMPT:</label>
  <span className="font-code-sm text-solstice-gold">ATTEMPTS REMAINING: {attemptsRemaining}</span>
</div>
<input 
  className="cipher-input bg-surface border-2 border-terminal-green p-4 font-headline-md text-solstice-gold placeholder-terminal-green/30 text-center uppercase disabled:opacity-50" 
  placeholder="_ENTER_DECRYPTED_TEXT" 
  type="text"
  value={userInput}
  onChange={(e) => setUserInput(e.target.value)}
  onKeyDown={handleKeyDown}
  disabled={isSolved}
/>
</div>
<button 
  className="bg-terminal-green text-surface font-headline-md py-4 hover:bg-solstice-gold transition-colors disabled:opacity-50 disabled:hover:bg-terminal-green"
  onClick={handleExecuteCipher}
  disabled={isSolved}
>
  {isSolved ? "CIPHER_SOLVED" : "EXECUTE_CIPHER_SOLVE"}
</button>
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
<footer className="border-t-2 border-terminal-green bg-surface h-24 overflow-y-auto p-2 font-code-sm text-soft-green custom-scrollbar">
{safeSystemLogs.map((logItem, i) => {
  const text = typeof logItem === 'string' ? logItem : logItem.text;
  const time = typeof logItem === 'string' ? new Date().toLocaleTimeString() : logItem.time;
  return (
    <div key={i} className="flex gap-4 py-1">
      <span className="text-soft-green opacity-50">[{time}]</span>
      <span className={`whitespace-pre-line ${
        text.includes('[SUCCESS]') || text.includes('[RESTORE]') || text.includes('UNLOCKED') 
          ? 'text-solstice-gold' 
          : text.includes('[WARNING]') || text.includes('[SYS_WARN]') 
            ? 'text-warning-red' 
            : 'text-terminal-green'
      }`}>{text}</span>
    </div>
  );
})}
<div ref={logsEndRef} />
</footer>
</section>
{/*  Right Panel: AI Terminal & Turing Portrait  */}
<aside className="w-80 flex flex-col gap-4 shrink-0">
<div className="terminal-border bg-panel-gray flex-1 flex flex-col overflow-hidden">
<AiTerminal ref={terminalRef} contextualState={{ module: 'CIPHER', difficulty: currentPuzzle.difficulty, type: currentPuzzle.type }} />
</div>
{/*  Portrait Fragment (50%)  */}
<div className="h-64 bg-surface border-2 border-terminal-green relative overflow-hidden flex items-center justify-center">
{/*  Portrait Image with data-alt  */}
<div className="absolute inset-0 grayscale contrast-150 opacity-40 mix-blend-screen" data-alt="Turing portrait" style={{backgroundImage: "url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80')"}}>
</div>
{/*  Masking Overlay to simulate 50% completion  */}
<div className="absolute inset-0 flex flex-col">
<div className="flex-1 flex">
<div className="flex-1"></div> {/*  Top Left Visible  */}
<div className="flex-1"></div> {/*  Top Right Visible  */}
</div>
<div className={`flex-1 bg-background flex items-center justify-center border-t-2 border-terminal-green relative overflow-hidden ${isSolved ? 'opacity-0 transition-opacity duration-1000' : ''}`}>
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
<a className="font-code-sm text-code-sm text-soft-green opacity-60 hover:text-terminal-green transition-opacity" href="#" onClick={handleRestartLevel}>REBOOT</a>
<a className="font-code-sm text-code-sm text-soft-green opacity-60 hover:text-terminal-green transition-opacity" href="#" onClick={(e) => { e.preventDefault(); setShowResetConfirm(true); }}>DUMP</a>
</nav>
</footer>
</div>
    </>
  );
}
