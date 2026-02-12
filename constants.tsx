
import React from 'react';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 500;
export const PLAYER_SIZE = 60;
export const CEO_SIZE = 80;
export const LEAD_SIZE = 40;
export const TARGET_LEADS = 15000; // More achievable target

export const ICONS = {
  LEAD: (
    <svg className="w-full h-full text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.184a4.535 4.535 0 00-1.676.662C6.602 13.234 6 14.009 6 15a1 1 0 102 0v-.092a4.535 4.535 0 011.676-.662C10.398 13.766 11 12.991 11 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 008 9.092V7.908c.51-.058 1.012-.21 1.458-.508C10.182 6.91 11 6.134 11 5.234A1 1 0 0010 4.234V5z" clipRule="evenodd" />
    </svg>
  ),
  VIRAL: (
    <span className="text-3xl animate-pulse">🚀</span>
  ),
  BLOCK: (
    <div className="flex items-center justify-center bg-red-600 rounded-lg w-full h-full border-2 border-white text-white font-bold text-xs shadow-lg">
      🚫 BLOCK
    </div>
  ),
  EDIT: (
    <div className="flex items-center justify-center bg-orange-500 rounded-lg w-full h-full border-2 border-white text-white font-bold text-[10px] shadow-lg">
      📝 EDITS
    </div>
  ),
  BLIND: (
    <div className="flex items-center justify-center bg-gray-700 rounded-lg w-full h-full border-2 border-white text-white font-bold text-[8px] shadow-lg">
      🌫️ BLIND
    </div>
  ),
  CEO_ATTACK: (
    <svg className="w-16 h-16 text-red-600 animate-ping" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  MARKETER: (
    <div className="relative w-full h-full flex items-center justify-center">
       <span className="text-4xl">🏃‍♂️</span>
       <div className="absolute -top-6 bg-white px-2 py-0.5 rounded text-[10px] text-blue-900 font-bold whitespace-nowrap shadow-sm border border-blue-200">
         MARKETER
       </div>
    </div>
  ),
  CEO: (
    <div className="relative w-full h-full flex items-center justify-center">
       <span className="text-5xl">👺</span>
       <div className="absolute -top-8 bg-red-600 px-2 py-1 rounded text-[10px] text-white font-bold whitespace-nowrap shadow-lg">
         ANGRY CEO
       </div>
    </div>
  ),
  ROP: (
     <div className="relative w-full h-full flex items-center justify-center">
       <span className="text-6xl">💼</span>
       <div className="absolute -top-10 bg-indigo-600 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap shadow-lg">
         ROP (HEAD OF SALES)
       </div>
    </div>
  )
};

export const CORPORATE_JARGON = [
  "ACCOUNT DISABLED!",
  "FIX THE LANDING!",
  "LOWER THE CPL!",
  "WHERE IS THE VIRALITY?",
  "THIS IS SPAM!",
  "ROI IS NEGATIVE!",
  "UNSUBSCRIBE!",
  "STUPID ALGORITHMS!"
];
