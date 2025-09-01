
import React, { useState, useEffect, useRef } from 'react';
import type { RoomNote, NoteDetail, GridCellPosition } from '../types';
import { ROOM_NAMES } from '../constants';
import AutoCompleteInput from './AutoCompleteInput';

interface NoteModalProps {
  day: number;
  cell: GridCellPosition;
  note?: RoomNote;
  onSave: (note: RoomNote) => void;
  onClose: () => void;
  allKeys: string[];
}

const NoteModal: React.FC<NoteModalProps> = ({ day, cell, note, onSave, onClose, allKeys }) => {
  const [localNote, setLocalNote] = useState<RoomNote>(
    note || { day, gridX: cell.x, gridY: cell.y, roomName: '', details: [] }
  );
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalNote(note || { day, gridX: cell.x, gridY: cell.y, roomName: '', details: [] });
  }, [note, day, cell]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleRoomNameChange = (name: string) => {
    setLocalNote(prev => ({ ...prev, roomName: name }));
  };

  const handleDetailChange = (index: number, field: 'key' | 'value', value: string) => {
    const newDetails = [...localNote.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setLocalNote(prev => ({ ...prev, details: newDetails }));
  };

  const addDetail = () => {
    const newDetail: NoteDetail = { id: crypto.randomUUID(), key: '', value: '' };
    setLocalNote(prev => ({ ...prev, details: [...prev.details, newDetail] }));
  };

  const removeDetail = (id: string) => {
    setLocalNote(prev => ({ ...prev, details: prev.details.filter(d => d.id !== id) }));
  };

  const handleSave = () => {
    onSave(localNote);
  };
  
  const handleClickOutside = (event: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClickOutside}>
      <div ref={modalRef} className="bg-slate-900 border-2 border-cyan-400 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
           style={{boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'}}>
        <header className="p-4 border-b border-cyan-700">
          <h2 className="text-2xl font-orbitron text-white">
            Notes for Day {day} (Cell {cell.x + 1}, {cell.y + 1})
          </h2>
        </header>
        <main className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            <label className="block text-cyan-300 text-sm font-bold mb-2 uppercase tracking-wider" htmlFor="roomName">
              Room Name
            </label>
            <AutoCompleteInput
              id="roomName"
              value={localNote.roomName}
              onChange={(e) => handleRoomNameChange(e.target.value)}
              onSuggestionClick={(suggestion) => handleRoomNameChange(suggestion)}
              suggestions={ROOM_NAMES}
              placeholder="e.g. Entrance Hall"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2 uppercase tracking-wider">Details</h3>
            <div className="space-y-4">
              {localNote.details.map((detail, index) => (
                <div key={detail.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2 items-center">
                  <AutoCompleteInput
                    value={detail.key}
                    onChange={(e) => handleDetailChange(index, 'key', e.target.value)}
                    onSuggestionClick={(suggestion) => handleDetailChange(index, 'key', suggestion)}
                    suggestions={allKeys}
                    placeholder="Key (e.g. Item)"
                  />
                  <input
                    type="text"
                    value={detail.value}
                    onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g. Blue Key)"
                    className="bg-slate-800 border border-cyan-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
                  />
                  <button onClick={() => removeDetail(detail.id)} className="text-red-400 hover:text-red-300 p-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addDetail} className="mt-4 bg-cyan-800/50 hover:bg-cyan-700/70 border border-cyan-600 text-cyan-200 font-bold py-2 px-4 rounded transition-colors text-sm">
              + Add Detail
            </button>
          </div>
        </main>
        <footer className="p-4 border-t border-cyan-700 flex justify-end gap-4">
          <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold py-2 px-6 rounded transition-colors">
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default NoteModal;
