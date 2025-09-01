
export interface NoteDetail {
  id: string;
  key: string;
  value: string;
}

export interface RoomNote {
  day: number;
  gridX: number;
  gridY: number;
  roomName: string;
  details: NoteDetail[];
}

export interface AppState {
  currentDay: number;
  notes: RoomNote[];
}

export interface GridCellPosition {
  x: number;
  y: number;
}
