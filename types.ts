
export enum GamePhase {
  SETUP,
  REVEAL,
  GAMEPLAY,
  GAME_OVER,
}

export interface Player {
  id: number;
  name: string;
  isSpy: boolean;
  isEliminated: boolean;
}

// FIX: Add types for the Chips game.
export enum ChipsGamePhase {
  INTRO,
  SETUP,
  GAMEPLAY,
  GAME_OVER,
}

export interface Chip {
  isBomb: boolean;
  isRevealed: boolean;
}

export type Board = Chip[];

export interface Boards {
  player1: Board;
  player2: Board;
}
