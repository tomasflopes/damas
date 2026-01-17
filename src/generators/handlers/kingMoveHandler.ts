import type { Board } from '../../board/board.js';
import type { Piece } from '../../pieces/piece.js';
import { PieceType } from '../../pieces/pieceType.js';
import type { Coord, MoveOption } from '../../types.js';
import { BaseMoveHandler, isValidSquare } from './moveHandler.js';

export class KingMoveHandler extends BaseMoveHandler {
  protected generate(from: Coord, piece: Piece, board: Board): MoveOption[] {
    if (piece.type !== PieceType.KING) return [];

    const directions: Array<[number, number]> = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    const moves: MoveOption[] = [];

    for (const [dr, dc] of directions) {
      let r = from.row + dr;
      let c = from.col + dc;
      let captured: Coord | undefined;

      while (isValidSquare(board, r, c)) {
        const occupant = board.getPiece(r, c);

        if (!occupant) {
          moves.push({ to: { row: r, col: c }, captured });
        } else {
          if (occupant.player === piece.player) break;
          if (captured) break;
          captured = { row: r, col: c };
        }

        r += dr;
        c += dc;
      }
    }

    return moves;
  }
}
