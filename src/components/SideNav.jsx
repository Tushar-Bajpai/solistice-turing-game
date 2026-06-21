import React from 'react';

export default function SideNav({ currentScreen, setCurrentScreen }) {
  const getNavClass = (screenName) => {
    if (currentScreen === screenName) {
      return "bg-terminal-green text-surface p-2 flex items-center gap-2 ring-2 ring-solstice-gold cursor-pointer hover:bg-soft-green/80 font-label-caps text-label-caps";
    }
    return "text-terminal-green p-2 flex items-center gap-2 hover:bg-soft-green/20 cursor-pointer font-label-caps text-label-caps";
  };

  return (
    <nav className="flex flex-col gap-2 mt-auto w-full">
      <div onClick={() => setCurrentScreen && setCurrentScreen('MainHub')} className={getNavClass('MainHub')}>
        <span className="material-symbols-outlined">dns</span>
        <span>LOGIC</span>
      </div>
      <div onClick={() => setCurrentScreen && setCurrentScreen('MemoryCore')} className={getNavClass('MemoryCore')}>
        <span className="material-symbols-outlined">database</span>
        <span>MEMORY</span>
      </div>
      <div onClick={() => setCurrentScreen && setCurrentScreen('CipherCore')} className={getNavClass('CipherCore')}>
        <span className="material-symbols-outlined">enhanced_encryption</span>
        <span>CIPHER</span>
      </div>
      <div onClick={() => setCurrentScreen && setCurrentScreen('AiCore')} className={getNavClass('AiCore')}>
        <span className="material-symbols-outlined">psychology</span>
        <span>A.L.A.N._CORE</span>
      </div>
    </nav>
  );
}
