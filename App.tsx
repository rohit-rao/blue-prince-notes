
import React, { useState, useMemo } from 'react';
import type { AppState, GridCellPosition, RoomNote } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Grid from './components/Grid';
import NoteModal from './components/NoteModal';
import SearchPanel from './components/SearchPanel';

const INITIAL_STATE: AppState = {
  currentDay: 1,
  notes: [
    { day: 1, gridX: 2, gridY: 0, roomName: 'Antechamber', details: [] },
    { day: 1, gridX: 2, gridY: 8, roomName: 'Entrance Hall', details: [] },
  ],
};

function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('bluePrinceNotes', INITIAL_STATE);
  const [modalState, setModalState] = useState<{ day: number, cell: GridCellPosition } | null>(null);

  const notesForCurrentDay = useMemo(() => {
    return appState.notes.filter(note => note.day === appState.currentDay);
  }, [appState.notes, appState.currentDay]);

  const allKeys = useMemo(() => {
    const keys = new Set<string>();
    appState.notes.forEach(note => {
      note.details.forEach(detail => keys.add(detail.key));
    });
    return Array.from(keys);
  }, [appState.notes]);

  const handleCellClick = (x: number, y: number) => {
    setModalState({ day: appState.currentDay, cell: { x, y } });
  };

  const handleCloseModal = () => {
    setModalState(null);
  };
  
  const handleNoteSelectFromSearch = (note: RoomNote) => {
    setModalState({ day: note.day, cell: { x: note.gridX, y: note.gridY } });
  };

  const handleSaveNote = (noteToSave: RoomNote) => {
    setAppState(prevState => {
      const otherNotes = prevState.notes.filter(
        n => !(n.day === noteToSave.day && n.gridX === noteToSave.gridX && n.gridY === noteToSave.gridY)
      );
      // Only add the note if it has a room name and at least one detail with a key
      if (noteToSave.roomName.trim() || noteToSave.details.some(d => d.key.trim())) {
        return { ...prevState, notes: [...otherNotes, noteToSave] };
      }
      return { ...prevState, notes: otherNotes };
    });
    handleCloseModal();
  };

  const handleNextDay = () => {
    setAppState(prevState => {
      const newDay = prevState.currentDay + 1;
      
      const antechamberNote: RoomNote = {
        day: newDay,
        gridX: 2, // Center of 5 columns
        gridY: 0, // Top row of 9
        roomName: 'Antechamber',
        details: [],
      };
      
      const entranceHallNote: RoomNote = {
        day: newDay,
        gridX: 2, // Center of 5 columns
        gridY: 8, // Bottom row of 9
        roomName: 'Entrance Hall',
        details: [],
      };

      return {
        ...prevState,
        currentDay: newDay,
        notes: [...prevState.notes, antechamberNote, entranceHallNote],
      };
    });
  };

  const currentNoteForModal = modalState 
    ? appState.notes.find(n => n.day === modalState.day && n.gridX === modalState.cell.x && n.gridY === modalState.cell.y)
    : undefined;

  return (
    <div className="min-h-screen bg-blue-900/50 text-cyan-200 p-4 md:p-8 blueprint-bg" style={{'--grid-color': 'rgba(6, 78, 120, 0.6)'} as React.CSSProperties}>
       <style>{`
        .blueprint-bg {
          background-color: #0c1427;
          background-image:
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(0,255,255,0.4)]">
          Mount Holly Estate
        </h1>
        <h2 className="text-2xl md:text-3xl font-orbitron text-cyan-300 uppercase tracking-wider">
          Blueprint
        </h2>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border-2 border-cyan-400/50 p-4 bg-black/20 backdrop-blur-sm">
           <Grid
            rows={9}
            cols={5}
            notes={notesForCurrentDay}
            onCellClick={handleCellClick}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="border-2 border-cyan-400/50 p-6 bg-black/20 backdrop-blur-sm flex flex-col items-center gap-4">
              <div className="text-center">
                  <p className="text-2xl text-cyan-300 tracking-widest">DAY</p>
                  <p className="font-orbitron text-5xl font-bold text-white">{appState.currentDay}</p>
              </div>
              <button 
                  onClick={handleNextDay}
                  className="w-full mt-2 bg-cyan-800/50 hover:bg-cyan-700/70 border-2 border-cyan-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out uppercase tracking-widest flex items-center justify-center gap-2"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Call it a Day
              </button>
          </div>
          <div className="border-2 border-cyan-400/50 p-4 bg-black/20 backdrop-blur-sm flex-grow">
            <h3 className="font-orbitron text-2xl text-white uppercase tracking-wider mb-4 text-center">Note Archives</h3>
            <SearchPanel allNotes={appState.notes} onNoteSelect={handleNoteSelectFromSearch} />
          </div>
        </div>
      </main>

      {modalState && (
        <NoteModal
          day={modalState.day}
          cell={modalState.cell}
          note={currentNoteForModal}
          onSave={handleSaveNote}
          onClose={handleCloseModal}
          allKeys={allKeys}
        />
      )}
    </div>
  );
}

export default App;
