import type { Board } from '../../board/board.js';
import type { Piece } from '../../pieces/piece.js';
import type { Coord, MoveHandler, MoveOption } from '../../types.js';

export abstract class BaseMoveHandler implements MoveHandler {
  protected next?: MoveHandler;

  setNext(handler: MoveHandler): MoveHandler {
    this.next = handler;
    return handler;
  }

  handle(from: Coord, piece: Piece, board: Board): MoveOption[] {
    const mine = this.generate(from, piece, board);
    const rest = this.next ? this.next.handle(from, piece, board) : [];
    return mine.concat(rest);
  }

  protected abstract generate(from: Coord, piece: Piece, board: Board): MoveOption[];
}

export function isValidSquare(board: Board, row: number, col: number): boolean {
  return board.inBounds(row, col) && board.isDarkSquare(row, col);
}
