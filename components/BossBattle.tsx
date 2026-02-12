
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

interface BossBattleProps {
  onWin: () => void;
  onLose: () => void;
}

const BossBattle: React.FC<BossBattleProps> = ({ onWin, onLose }) => {
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(150);
  const [turn, setTurn] = useState<'player' | 'boss'>('player');
  const [log, setLog] = useState<string[]>(["A wild ROP appears! Prove the lead quality!"]);
  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  const playerMove = (type: 'attack' | 'shield' | 'budget') => {
    if (turn !== 'player' || isAnimating) return;
    setIsAnimating(true);

    let damage = 0;
    let message = "";

    if (type === 'attack') {
      damage = 25 + Math.floor(Math.random() * 15);
      message = `You launched a Viral Campaign! Dealt ${damage} damage.`;
    } else if (type === 'shield') {
      setPlayerHp(h => Math.min(100, h + 20));
      message = "You optimized the Landing Page. Gained 20 Mental Health.";
    } else if (type === 'budget') {
      damage = 40 + Math.floor(Math.random() * 20);
      message = "YOU DOUBLED THE AD BUDGET! CRITICAL HIT!";
    }

    addLog(message);
    setBossHp(h => {
      const newH = Math.max(0, h - damage);
      if (newH === 0) {
        setTimeout(onWin, 1500);
      }
      return newH;
    });

    setTimeout(() => {
      setTurn('boss');
      setIsAnimating(false);
    }, 1000);
  };

  useEffect(() => {
    if (turn === 'boss' && bossHp > 0) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        const move = Math.random();
        let damage = 0;
        let message = "";

        if (move > 0.6) {
          damage = 20 + Math.floor(Math.random() * 10);
          message = "ROP shouts: 'THESE ARE TRASH LEADS!'. Mental damage: " + damage;
        } else if (move > 0.3) {
          damage = 15;
          message = "ROP demands a spreadsheet by EOD. Fatigue: " + damage;
        } else {
          setBossHp(h => Math.min(150, h + 15));
          message = "ROP drank an espresso. He's fired up!";
        }

        addLog(message);
        setPlayerHp(h => {
          const newH = Math.max(0, h - damage);
          if (newH === 0) setTimeout(onLose, 1500);
          return newH;
        });

        setIsAnimating(false);
        setTurn('player');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, bossHp, onLose]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 p-8">
      {/* Arena */}
      <div className="flex-1 flex justify-between items-center relative">
        {/* Player Side */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500" 
              style={{ width: `${(playerHp / 100) * 100}%` }}
            />
          </div>
          <div className="text-green-400 font-mono text-sm">MARKETER HP: {Math.ceil(playerHp)}</div>
          <div className={`w-32 h-32 transform transition-transform ${turn === 'player' ? 'scale-110' : 'opacity-80'}`}>
            {ICONS.MARKETER}
          </div>
        </div>

        {/* VS text */}
        <div className="text-slate-700 text-6xl font-black italic select-none">VS</div>

        {/* Boss Side */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-500" 
              style={{ width: `${(bossHp / 150) * 100}%` }}
            />
          </div>
          <div className="text-red-500 font-mono text-sm">ROP HP: {Math.ceil(bossHp)}</div>
          <div className={`w-32 h-32 transform transition-transform ${turn === 'boss' ? 'scale-110' : 'opacity-80'}`}>
            {ICONS.ROP}
          </div>
        </div>

        {/* Turn Indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
          {turn === 'player' ? "YOUR TURN" : "ROP IS COMPLAINING..."}
        </div>
      </div>

      {/* Battle Log */}
      <div className="h-24 bg-black/50 border border-slate-700 rounded-lg p-3 overflow-hidden mb-6">
        {log.map((m, i) => (
          <div key={i} className={`text-sm font-mono ${i === 0 ? 'text-white' : 'text-slate-500'}`}>
            {i === 0 ? '> ' : ''}{m}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => playerMove('attack')}
          disabled={turn !== 'player' || isAnimating}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white p-4 rounded-xl font-bold shadow-lg transition-all active:scale-95"
        >
          VIRAL CAMPAIGN
          <div className="text-[10px] opacity-70">Moderate Damage</div>
        </button>
        <button 
          onClick={() => playerMove('shield')}
          disabled={turn !== 'player' || isAnimating}
          className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white p-4 rounded-xl font-bold shadow-lg transition-all active:scale-95"
        >
          A/B TEST
          <div className="text-[10px] opacity-70">Heal Health</div>
        </button>
        <button 
          onClick={() => playerMove('budget')}
          disabled={turn !== 'player' || isAnimating}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white p-4 rounded-xl font-bold shadow-lg transition-all active:scale-95"
        >
          SCALE BUDGET
          <div className="text-[10px] opacity-70">High Damage</div>
        </button>
      </div>
    </div>
  );
};

export default BossBattle;
