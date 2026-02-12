
import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import RunnerGame from './components/RunnerGame';
import BossBattle from './components/BossBattle';
import { GAME_WIDTH, GAME_HEIGHT, TARGET_LEADS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [totalLeads, setTotalLeads] = useState(0);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const padding = 20;
      const availableWidth = window.innerWidth - padding * 2;
      const availableHeight = window.innerHeight - 100;
      
      const scaleX = availableWidth / GAME_WIDTH;
      const scaleY = availableHeight / GAME_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1.2); 
      
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setGameState(GameState.RUNNING);
    setTotalLeads(0);
  };

  const handleRunnerWin = (leads: number) => {
    setTotalLeads(leads);
    setGameState(GameState.BOSS_INTRO);
    setTimeout(() => {
      setGameState(GameState.FIGHTING);
    }, 3000);
  };

  const handleBossWin = () => {
    setGameState(GameState.WON);
  };

  const handleLose = () => {
    setGameState(GameState.LOST);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden touch-none p-4">
      {/* Scalable Container */}
      <div 
        style={{ 
          width: GAME_WIDTH * scale, 
          height: GAME_HEIGHT * scale,
        }}
        className="relative transition-all duration-300"
      >
        <div 
          ref={stageRef}
          className="absolute origin-top-left bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          style={{ 
            width: GAME_WIDTH, 
            height: GAME_HEIGHT,
            transform: `scale(${scale})`
          }}
        >
          {gameState === GameState.START && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-12 text-center">
              <div className="mb-8 animate-float">
                <span className="text-9xl drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">💸</span>
              </div>
              <h1 className="text-5xl font-black mb-4 italic uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Marketing Run
              </h1>
              <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
                Reach <span className="text-yellow-400 font-bold">${TARGET_LEADS.toLocaleString()}</span> budget. 
                Watch out for <span className="text-red-500 font-bold">Account Blocks</span> and <span className="text-orange-400 font-bold">Urgent Edits</span>. 
                If you slow down, the <span className="text-red-600 font-black">CEO</span> will catch you!
              </p>
              <button 
                onClick={startGame}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-14 py-5 rounded-2xl font-black text-2xl shadow-xl active:scale-95 transition-all transform hover:rotate-1"
              >
                SECURE THE BUDGET
              </button>
            </div>
          )}

          {gameState === GameState.RUNNING && (
            <RunnerGame onWin={handleRunnerWin} onLose={handleLose} />
          )}

          {gameState === GameState.BOSS_INTRO && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-12 text-center">
              <div className="text-indigo-500 text-2xl font-black mb-4 uppercase tracking-[0.3em]">Evaluation Phase</div>
              <div className="text-7xl font-black mb-8 italic animate-pulse">BATTLE THE ROP</div>
              <div className="text-9xl">📊</div>
              <div className="mt-8 text-slate-500">"He thinks your budget was spent on junk traffic..."</div>
            </div>
          )}

          {gameState === GameState.FIGHTING && (
            <BossBattle onWin={handleBossWin} onLose={handleLose} />
          )}

          {gameState === GameState.WON && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-slate-900 text-white p-12 text-center">
               <div className="text-9xl mb-6 animate-bounce">🏆</div>
               <h2 className="text-6xl font-black mb-2 italic">CMO STATUS</h2>
               <div className="text-indigo-300 text-2xl font-bold mb-8 uppercase tracking-widest">PROMOTION SECURED</div>
               <button 
                onClick={() => setGameState(GameState.START)}
                className="bg-white text-blue-900 px-12 py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform"
              >
                RETIRE & REPLAY
              </button>
            </div>
          )}

          {gameState === GameState.LOST && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-950 text-white p-12 text-center">
               <div className="text-9xl mb-6 grayscale">🤕</div>
               <h2 className="text-5xl font-black mb-2 uppercase italic">Hospitalized</h2>
               <div className="text-red-400 text-xl font-bold mb-8 tracking-widest">CEO BEAT YOU IN THE PARKING LOT</div>
               <button 
                onClick={() => setGameState(GameState.START)}
                className="bg-red-600 hover:bg-red-500 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform"
              >
                START RECOVERY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
