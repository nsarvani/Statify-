
import React from 'react';

export const StatifyLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-end h-6 gap-[2px]">
        <div className="w-[6px] h-[30%] bg-green-500 rounded-t"></div>
        <div className="w-[6px] h-[60%] bg-green-500 rounded-t"></div>
        <div className="w-[6px] h-[45%] bg-green-500 rounded-t"></div>
        <div className="w-[6px] h-[80%] bg-green-500 rounded-t"></div>
        <div className="w-[6px] h-[50%] bg-green-500 rounded-t"></div>
      </div>
      <span className="font-bold text-xl tracking-tight">Statify <span className="text-green-500">🎵</span></span>
    </div>
  );
};

export default StatifyLogo;
