import { Board } from './board/board.js';
import { Piece, Player } from './pieces/piece.js';

export type MoveOption = { to: Coord; captured?: Coord | Coord[] };
export type MoveResult = { success: boolean; captured?: Coord | Coord[] };

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

export interface MoveHandler {
  setNext(handler: MoveHandler): MoveHandler;
  handle(from: Coord, piece: Piece, board: Board): MoveOption[];
}
