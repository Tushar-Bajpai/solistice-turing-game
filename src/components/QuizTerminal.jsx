import React, { useState, useEffect, useRef } from 'react';

const QUIZ_QUESTIONS = [
  {
    question: "What infamous encryption machine did Alan Turing help decode during World War II?",
    answer: "ENIGMA"
  },
  {
    question: "In what year did Alan Turing propose his famous 'Turing Test'?",
    answer: "1950"
  },
  {
    question: "The June Solstice typically occurs around which date? (Enter Number)",
    answer: "21"
  },
  {
    question: "During the June Solstice, what is the highest point the sun reaches in the sky called?",
    answer: "ZENITH"
  },
  {
    question: "Alan Turing formalized the concepts of algorithm and computation with what theoretical device?",
    answer: "TURING MACHINE"
  }
];

export default function QuizTerminal({ onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState([
    { sender: 'SYSTEM', text: 'INITIALIZING TURING PROTOCOL...' },
    { sender: 'SYSTEM', text: 'COMPLETE THIS ASSESSMENT TO UPGRADE SYSTEM LIVES.' }
  ]);
  const [completed, setCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(prev => [...prev, { sender: 'A.L.A.N.', text: `QUESTION ${currentIdx + 1}/5: ${QUIZ_QUESTIONS[currentIdx].question}` }]);
    }, 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const val = inputValue.trim().toUpperCase();
      setInputValue('');
      setLogs(prev => [...prev, { sender: 'USER', text: `> ${val}` }]);

      if (val === QUIZ_QUESTIONS[currentIdx].answer) {
        setLogs(prev => [...prev, { sender: 'SYSTEM', text: 'CORRECT.' }]);
        
        if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
          setCurrentIdx(prev => prev + 1);
          setTimeout(() => {
            setLogs(prev => [...prev, { sender: 'A.L.A.N.', text: `QUESTION ${currentIdx + 2}/5: ${QUIZ_QUESTIONS[currentIdx + 1].question}` }]);
          }, 500);
        } else {
          setCompleted(true);
          setLogs(prev => [...prev, { sender: 'SYSTEM', text: 'ASSESSMENT COMPLETE.' }]);
          
          setTimeout(() => {
            const currentBonus = parseInt(localStorage.getItem('solsticeBonusAttempts') || '0');
            localStorage.setItem('solsticeBonusAttempts', currentBonus + 1);
            setLogs(prev => [...prev, { sender: 'ARCHIVE', text: '=== UPGRADE GRANTED ===\n+1 BONUS ATTEMPT ADDED GLOBALLY' }]);
          }, 1000);
        }
      } else {
        setLogs(prev => [...prev, { sender: 'SYSTEM', text: 'INCORRECT. TRY AGAIN.' }]);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-2xl h-[500px] flex flex-col terminal-border bg-panel-gray shadow-[0_0_30px_rgba(0,255,102,0.15)] relative animate-[fadeIn_0.3s_ease-out]">
        
        <header className="border-b-2 border-terminal-green p-4 flex justify-between items-center bg-surface shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-terminal-green">terminal</span>
            <h2 className="font-headline-md text-terminal-green tracking-widest">TURING ASSESSMENT TERMINAL</h2>
          </div>
          <button onClick={onClose} className="text-terminal-green hover:text-warning-red transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-grow p-6 font-code-sm text-soft-green overflow-y-auto space-y-4 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="text-terminal-green opacity-50 shrink-0 w-20">[{log.sender}]</span>
              <span className={`whitespace-pre-wrap flex-1 ${log.sender === 'USER' ? 'text-terminal-green' : log.sender === 'ARCHIVE' ? 'text-solstice-gold font-headline-md glow-gold' : 'text-soft-green'}`}>
                {log.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!completed && (
          <div className="p-4 border-t-2 border-terminal-green bg-surface shrink-0 flex gap-4">
            <span className="text-terminal-green">&gt;</span>
            <input 
              className="bg-transparent border-none outline-none focus:ring-0 p-0 text-terminal-green w-full font-code-sm uppercase placeholder-terminal-green/30" 
              placeholder="ENTER ANSWER..." 
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleSubmit}
              autoFocus
            />
          </div>
        )}
        {completed && (
          <div className="p-4 border-t-2 border-terminal-green bg-surface shrink-0 flex justify-center">
            <button onClick={onClose} className="bg-terminal-green text-black font-headline-md px-6 py-2 hover:bg-solstice-gold transition-colors">
              CLOSE TERMINAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
