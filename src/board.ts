import { Piece } from './piece.js';

export const BOARD_SIZE = 8;

export interface Board {
  readonly size: number;
  getPiece(row: number, col: number): Piece | null;
  setPiece(row: number, col: number, piece: Piece | null): void;
  clearBoard(): void;
  inBounds(row: number, col: number): boolean;
  isDarkSquare(row: number, col: number): boolean;
}

export class DamaBoard implements Board {
  private grid: Array<Array<Piece | null>>;

  constructor() {
    this.grid = this.emptyBoard();
    this.setupPieces();
  }

  get size() {
    return BOARD_SIZE;
  }

  getPiece(row: number, col: number): Piece | null {
    if (!this.inBounds(row, col)) return null;
    return this.grid[row][col];
  }

  setPiece(row: number, col: number, piece: Piece | null): void {
    if (!this.inBounds(row, col)) return;
    this.grid[row][col] = piece;
  }

  clearBoard(): void {
    this.grid = this.emptyBoard();
  }

  private emptyBoard(): Array<Array<Piece | null>> {
    return Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null));
  }

  private setupPieces() {
    const rowsPerSide = 3;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!this.isDarkSquare(row, col)) continue;

        if (row < rowsPerSide) {
          this.grid[row][col] = new Piece('dark');
        } else if (row >= BOARD_SIZE - rowsPerSide) {
          this.grid[row][col] = new Piece('light');
        }
      }
    }
  }

  inBounds(row: number, col: number) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  isDarkSquare(row: number, col: number) {
    return (row + col) % 2 === 1;
  }
}
