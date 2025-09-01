
import React, { useState, useMemo } from 'react';
import type { RoomNote } from '../types';

interface SearchPanelProps {
  allNotes: RoomNote[];
  onNoteSelect: (note: RoomNote) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ allNotes, onNoteSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndProcessedNotes = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
        return [...allNotes]
            .sort((a, b) => b.day - a.day)
            .map(note => ({ note, matchedDetailIds: new Set<string>() }));
    }

    const results = allNotes
      .map(note => {
        const dayMatch = note.day.toString() === term;
        const roomMatch = note.roomName.toLowerCase().includes(term);
        const matchingDetails = note.details.filter(d =>
          d.key.toLowerCase().includes(term)
        );

        if (dayMatch || roomMatch || matchingDetails.length > 0) {
          return {
            note,
            matchedDetailIds: new Set(matchingDetails.map(d => d.id)),
          };
        }
        return null;
      })
      .filter((item): item is { note: RoomNote; matchedDetailIds: Set<string> } => item !== null);

    return results.sort((a, b) => b.note.day - a.note.day);
  }, [allNotes, searchTerm]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={`Search...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-slate-800 border border-cyan-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {searchTerm.trim() && filteredAndProcessedNotes.length === 0 && (
          <p className="text-center text-cyan-400">No notes found.</p>
        )}
        <ul className="space-y-4">
          {filteredAndProcessedNotes.map(({ note, matchedDetailIds }) => (
            <li 
              key={`${note.day}-${note.gridX}-${note.gridY}`} 
              className="bg-blue-900/50 p-3 rounded-md border border-cyan-800 cursor-pointer hover:bg-blue-800/60 transition-colors"
              onClick={() => onNoteSelect(note)}
            >
              <p className="font-bold text-white">
                Day {note.day} - {note.roomName}
              </p>
              <p className="text-xs text-cyan-400 mb-2">
                (Grid: {note.gridX + 1}, {note.gridY + 1})
              </p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-sm">
                {note.details.map((detail) => {
                  const isAnyKeyMatchInNote = matchedDetailIds.size > 0;
                  const isThisDetailAMatch = matchedDetailIds.has(detail.id);

                  let liClasses = "transition-all duration-300 ease-in-out";
                  if (isAnyKeyMatchInNote) {
                    if (isThisDetailAMatch) {
                      // Highlight this one
                      liClasses += " bg-cyan-500/20 rounded-md p-1 -m-1";
                    } else {
                      // De-emphasize others by reducing opacity
                      liClasses += " opacity-40";
                    }
                  }

                  return (
                    <li key={detail.id} className={liClasses}>
                      <span className="font-semibold text-cyan-200">{detail.key}:</span>{' '}
                      <span className="text-cyan-100">{detail.value}</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchPanel;
