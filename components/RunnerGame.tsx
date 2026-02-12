
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Lead, Obstacle } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE, CEO_SIZE, LEAD_SIZE, TARGET_LEADS, ICONS, CORPORATE_JARGON } from '../constants';

interface RunnerGameProps {
  onWin: (budget: number) => void;
  onLose: () => void;
}

const RunnerGame: React.FC<RunnerGameProps> = ({ onWin, onLose }) => {
  const [playerY, setPlayerY] = useState(GAME_HEIGHT / 2);
  const [ceoDistance, setCeoDistance] = useState(350);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [budget, setBudget] = useState(0);
  const [health, setHealth] = useState(100);
  const [shout, setShout] = useState("");
  const [isCaught, setIsCaught] = useState(false);
  const [flash, setFlash] = useState(false);
  const [isBlinded, setIsBlinded] = useState(false);
  const [isStunned, setIsStunned] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  // Fix: Added initial value 0 to satisfy TypeScript requirement for 1 argument in useRef<number>()
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const playerYRef = useRef(GAME_HEIGHT / 2);
  const ceoDistanceRef = useRef(350);
  const budgetRef = useRef(0);
  const isCaughtRef = useRef(false);
  const isStunnedRef = useRef(false);

  useEffect(() => {
    playerYRef.current = playerY;
    ceoDistanceRef.current = ceoDistance;
    budgetRef.current = budget;
    isCaughtRef.current = isCaught;
    isStunnedRef.current = isStunned;
  }, [playerY, ceoDistance, budget, isCaught, isStunned]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isCaughtRef.current || isStunnedRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scaleY = GAME_HEIGHT / rect.height;
    const relativeY = (e.clientY - rect.top) * scaleY;
    const clampedY = Math.max(PLAYER_SIZE / 2, Math.min(GAME_HEIGHT - PLAYER_SIZE / 2, relativeY));
    setPlayerY(clampedY);
  }, []);

  const spawnEntities = useCallback(() => {
    const chance = Math.random();
    // Easy: 80% chance for budget item, 20% for obstacle
    if (chance > 0.20) {
      const type: 'hot' | 'viral' = Math.random() > 0.93 ? 'viral' : 'hot';
      const newLead: Lead = {
        id: Date.now() + Math.random(),
        x: GAME_WIDTH + 50,
        y: Math.random() * (GAME_HEIGHT - LEAD_SIZE) + LEAD_SIZE / 2,
        type: type
      };
      setLeads(prev => [...prev, newLead]);
    } else {
      const types: Array<'block' | 'edit' | 'blindness'> = ['block', 'edit', 'blindness'];
      const type = types[Math.floor(Math.random() * types.length)];
      const newObs: Obstacle = {
        id: Date.now() + Math.random(),
        x: GAME_WIDTH + 50,
        y: Math.random() * (GAME_HEIGHT - LEAD_SIZE) + LEAD_SIZE / 2,
        type: type
      };
      setObstacles(prev => [...prev, newObs]);
    }
  }, []);

  const triggerShout = useCallback((textOverride?: string) => {
    const text = textOverride || CORPORATE_JARGON[Math.floor(Math.random() * CORPORATE_JARGON.length)];
    setShout(text);
    setTimeout(() => setShout(""), 1500);
  }, []);

  const triggerBeating = useCallback(() => {
    setIsCaught(true);
    setFlash(true);
    setCeoDistance(0);
    
    let hits = 0;
    const beatInterval = setInterval(() => {
      setFlash(f => !f);
      hits++;
      if (hits > 12) {
        clearInterval(beatInterval);
        onLose();
      }
    }, 150);
  }, [onLose]);

  const animate = useCallback((time: number) => {
    if (isCaughtRef.current) return;

    // Slower spawn timing for easier catching
    if (time - lastSpawnTime.current > 750) {
      spawnEntities();
      lastSpawnTime.current = time;
    }

    // Slower scroll speed (6.8)
    setLeads(prevLeads => {
      const nextLeads: Lead[] = [];
      const playerX = 150;
      for (const lead of prevLeads) {
        const nextX = lead.x - 6.8;
        const dx = nextX - playerX;
        const dy = lead.y - playerYRef.current;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < (PLAYER_SIZE + LEAD_SIZE) / 2) {
          if (lead.type === 'viral') {
            setBudget(b => b + 3000);
            setCeoDistance(d => Math.min(480, d + 150)); // Huge reward
          } else {
            setBudget(b => b + 1000);
            setCeoDistance(d => Math.min(480, d + 30)); // Generous reward
          }
          continue;
        }
        if (nextX > -50) nextLeads.push({ ...lead, x: nextX });
      }
      return nextLeads;
    });

    setObstacles(prevObs => {
      const nextObs: Obstacle[] = [];
      const playerX = 150;
      for (const obs of prevObs) {
        const nextX = obs.x - 7.2;
        const dx = nextX - playerX;
        const dy = obs.y - playerYRef.current;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < (PLAYER_SIZE + LEAD_SIZE) / 1.8) {
          if (obs.type === 'block') {
            setIsStunned(true);
            setCeoDistance(d => d - 35); // Lowered penalty
            triggerShout("ACCOUNT BLOCKED!");
            setTimeout(() => setIsStunned(false), 500); // Shorter stun
          } else if (obs.type === 'blindness') {
            setIsBlinded(true);
            setTimeout(() => setIsBlinded(false), 2000); // Shorter blindness
            triggerShout("BANNER BLINDNESS!");
          } else if (obs.type === 'edit') {
             setCeoDistance(d => d - 20); // Lowered penalty
             triggerShout("URGENT EDITS!");
          }
          continue;
        }
        if (nextX > -50) nextObs.push({ ...obs, x: nextX });
      }
      return nextObs;
    });

    // Easy CEO Speed: 0.65 base, very slow close-up factor (0.35)
    const baseSpeed = 0.65;
    const distanceFactor = ceoDistanceRef.current < 120 ? 0.35 : 1.0;
    setCeoDistance(d => d - (baseSpeed * distanceFactor));

    if (ceoDistanceRef.current <= 30) {
       setHealth(h => {
         const newH = h - 0.75; // Slower health drain
         if (newH <= 0) {
            triggerBeating();
            return 0;
         }
         return newH;
       });
    }

    if (budgetRef.current >= TARGET_LEADS) {
      onWin(budgetRef.current);
      return;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [onWin, spawnEntities, triggerShout, triggerBeating]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden transition-all duration-300 select-none touch-none 
        ${flash ? 'bg-red-900' : (isBlinded ? 'bg-slate-950 blur-[1px]' : 'bg-slate-900')}`}
      onPointerMove={handlePointerMove}
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-0 opacity-5 flex flex-col justify-between p-4 pointer-events-none">
         <div className="text-white text-6xl md:text-8xl font-black italic uppercase">Cashing</div>
         <div className="text-white text-6xl md:text-8xl font-black italic text-right uppercase">In</div>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {leads.map(lead => (
        <div 
          key={lead.id}
          className="absolute transition-transform duration-75"
          style={{ 
            left: lead.x, 
            top: lead.y, 
            width: LEAD_SIZE, 
            height: LEAD_SIZE,
            transform: 'translate(-50%, -50%)',
            opacity: isBlinded ? 0.5 : 1
          }}
        >
          <div className="animate-bounce">
            {lead.type === 'viral' ? ICONS.VIRAL : ICONS.LEAD}
          </div>
          <div className="absolute -top-4 left-0 right-0 text-center text-yellow-400 font-black text-[10px] drop-shadow-md">
            {lead.type === 'viral' ? '+$3k' : '+$1k'}
          </div>
        </div>
      ))}

      {obstacles.map(obs => (
        <div 
          key={obs.id}
          className="absolute transition-transform duration-75"
          style={{ 
            left: obs.x, 
            top: obs.y, 
            width: LEAD_SIZE * 1.5, 
            height: LEAD_SIZE * 0.8,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {obs.type === 'block' && ICONS.BLOCK}
          {obs.type === 'edit' && ICONS.EDIT}
          {obs.type === 'blindness' && ICONS.BLIND}
        </div>
      ))}

      <div 
        className={`absolute transition-all duration-75 z-10 
          ${isCaught ? 'rotate-[360deg] scale-150' : ''} 
          ${isStunned ? 'brightness-200 blur-sm' : ''}`}
        style={{ 
          left: 150, 
          top: playerY, 
          width: PLAYER_SIZE, 
          height: PLAYER_SIZE,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {ICONS.MARKETER}
        {isStunned && <div className="absolute inset-0 flex items-center justify-center text-red-500 font-black text-xl">BLOCKED!</div>}
      </div>

      <div 
        className={`absolute transition-all duration-100 ease-linear flex items-center justify-center ${isCaught ? 'scale-[2.0] z-20' : ''}`}
        style={{ 
          left: 150 - ceoDistance, 
          top: playerY, 
          width: CEO_SIZE, 
          height: CEO_SIZE,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {ICONS.CEO}
        {(ceoDistance < 80 || isCaught) && (
          <div className="absolute -right-8">
            {ICONS.CEO_ATTACK}
          </div>
        )}
      </div>

      {shout && (
        <div 
          className="absolute bg-white border-4 border-red-600 rounded-2xl p-2 md:p-4 shadow-2xl z-30 animate-bounce"
          style={{ left: Math.max(20, 150 - ceoDistance + 50), top: playerY - 120 }}
        >
          <div className="text-red-700 font-black text-sm md:text-lg uppercase whitespace-nowrap">{shout}</div>
          <div className="absolute -bottom-3 left-4 w-6 h-6 bg-white border-b-4 border-r-4 border-red-600 rotate-45"></div>
        </div>
      )}

      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none z-50">
        <div className="bg-slate-800/95 p-3 md:p-4 rounded-2xl border-2 border-slate-700 shadow-2xl backdrop-blur-md">
          <div className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1">Budget</div>
          <div className="w-24 md:w-56 h-4 md:h-6 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-600 flex items-center px-1">
            <div 
              className="h-2 md:h-3 bg-gradient-to-r from-yellow-600 to-green-400 transition-all duration-300 rounded-full" 
              style={{ width: `${Math.min(100, (budget / TARGET_LEADS) * 100)}%` }}
            />
          </div>
          <div className="text-right text-yellow-500 text-[10px] md:text-sm mt-1 font-black italic">
            ${budget.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-800/95 p-3 md:p-4 rounded-2xl border-2 border-slate-700 shadow-2xl backdrop-blur-md">
          <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Job Security</div>
          <div className="w-24 md:w-56 h-4 md:h-6 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-600 flex items-center px-1">
            <div 
              className={`h-2 md:h-3 transition-all duration-100 rounded-full ${health < 30 ? 'bg-red-500 animate-pulse' : 'bg-red-600'}`} 
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
      </div>

      {!isCaught && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-[8px] md:text-xs font-black uppercase tracking-widest bg-green-600 px-6 py-2 rounded-full border-2 border-green-400 shadow-lg">
          Easy Mode: Relax and Run
        </div>
      )}
    </div>
  );
};

export default RunnerGame;
