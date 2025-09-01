
import React from 'react';
import type { RoomNote } from '../types';
import GridCell from './GridCell';

interface GridProps {
  rows: number;
  cols: number;
  notes: RoomNote[];
  onCellClick: (x: number, y: number) => void;
}

const Grid: React.FC<GridProps> = ({ rows, cols, notes, onCellClick }) => {
  const gridCells = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const note = notes.find(n => n.gridX === x && n.gridY === y);
      gridCells.push(
        <GridCell
          key={`${x}-${y}`}
          x={x}
          y={y}
          note={note}
          onClick={onCellClick}
        />
      );
    }
  }

  return (
    <div 
      className="grid aspect-[5/9] w-full" 
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {gridCells}
    </div>
  );
};

export default Grid;
