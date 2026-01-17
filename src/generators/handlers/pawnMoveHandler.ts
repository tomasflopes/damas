import type { Board } from '../../board/board.js';
import type { Piece } from '../../pieces/piece.js';
import { PieceType } from '../../pieces/pieceType.js';
import type { Coord, MoveOption } from '../../types.js';
import { BaseMoveHandler, isValidSquare } from './moveHandler.js';

export class PawnMoveHandler extends BaseMoveHandler {
  protected generate(from: Coord, piece: Piece, board: Board): MoveOption[] {
    if (piece.type === PieceType.KING) return [];

    const directions: Array<[number, number]> = [];

    if (piece.player === 'light') directions.push([-1, -1], [-1, 1]);
    if (piece.player === 'dark') directions.push([1, -1], [1, 1]);

    const moves: MoveOption[] = [];
    for (const [dr, dc] of directions) {
      const nr = from.row + dr;
      const nc = from.col + dc;
      if (!isValidSquare(board, nr, nc)) continue;

      const occupant = board.getPiece(nr, nc);
      if (!occupant) {
        moves.push({ to: { row: nr, col: nc } });
      } else if (occupant.player !== piece.player) {
        const jumpR = nr + dr;
        const jumpC = nc + dc;
        if (isValidSquare(board, jumpR, jumpC) && !board.getPiece(jumpR, jumpC)) {
          moves.push({ to: { row: jumpR, col: jumpC }, captured: { row: nr, col: nc } });
        }
      }
    }

    return moves;
  }
}
