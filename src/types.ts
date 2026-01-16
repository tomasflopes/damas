import { Player } from './pieces/damaPiece.js';
import { Piece } from './pieces/piece.js';

export type MoveOption = { to: Coord; captured?: Coord };
export type MoveResult = { success: boolean; captured?: Coord };

export interface MoveGenerator {
  getValidMoves(from: Coord): MoveOption[];
}

export interface PromotionPolicy {
  shouldPromote(piece: Piece, destinationRow: number, boardSize: number): boolean;
}

export interface TurnPolicy {
  canMove(piece: Piece, current: Player): boolean;
  next(current: Player): Player;
}

export type Coord = { row: number; col: number };
