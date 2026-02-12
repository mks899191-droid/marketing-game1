
export enum GameState {
  START = 'START',
  RUNNING = 'RUNNING',
  BOSS_INTRO = 'BOSS_INTRO',
  FIGHTING = 'FIGHTING',
  WON = 'WON',
  LOST = 'LOST'
}

export interface Lead {
  id: number;
  x: number;
  y: number;
  type: 'hot' | 'warm' | 'cold' | 'viral';
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  type: 'block' | 'edit' | 'blindness';
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}
