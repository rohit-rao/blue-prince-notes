
import React from 'react';
import type { RoomNote } from '../types';

interface GridCellProps {
  x: number;
  y: number;
  note?: RoomNote;
  onClick: (x: number, y: number) => void;
}

const GridCell: React.FC<GridCellProps> = ({ x, y, note, onClick }) => {
  const hasNote = !!note;

  return (
    <div
      onClick={() => onClick(x, y)}
      className={`border border-cyan-600/50 flex items-center justify-center p-1 cursor-pointer transition-all duration-200 ease-in-out ${
        hasNote
          ? 'bg-cyan-500/30 hover:bg-cyan-500/50'
          : 'bg-transparent hover:bg-cyan-500/20'
      }`}
    >
      {hasNote && (
        <div className="text-center leading-tight">
          <span className="text-white font-bold text-[8px] sm:text-[10px] md:text-xs uppercase break-words">
            {note.roomName}
          </span>
        </div>
      )}
    </div>
  );
};

export default GridCell;
