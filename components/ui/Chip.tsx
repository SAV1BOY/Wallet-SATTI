
import React from 'react';

interface ChipProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ active, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
        active
          ? "bg-cyan-600 text-white border-cyan-600"
          : "bg-zinc-800/20 dark:bg-zinc-700/30 border-zinc-500/30 hover:border-cyan-500/60"
      }`}
    >
      {children}
    </button>
  );
};

export default Chip;
