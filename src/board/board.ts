import { Piece } from '../pieces/piece.js';

export interface Board {
  readonly size: number;
  getPiece(row: number, col: number): Piece | null;
  setPiece(row: number, col: number, piece: Piece | null): void;
  clearBoard(): void;
  inBounds(row: number, col: number): boolean;
  isDarkSquare(row: number, col: number): boolean;
}
