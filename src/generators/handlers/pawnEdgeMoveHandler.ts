import type { Board } from '../../board/board.js';
import type { Piece } from '../../pieces/piece.js';
import { PieceType } from '../../pieces/pieceType.js';
import type { Coord, MoveOption } from '../../types.js';
import { BaseMoveHandler, isValidSquare } from './moveHandler.js';

export class PawnEdgeMoveHandler extends BaseMoveHandler {
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

      if (occupant && occupant.player !== piece.player) {
        const opponentOnEdge = nc === 0 || nc === 7;

        if (opponentOnEdge) {
          const edgeJumpR = from.row + 2 * dr;
          const edgeJumpC = from.col;

          if (isValidSquare(board, edgeJumpR, edgeJumpC) && !board.getPiece(edgeJumpR, edgeJumpC)) {
            moves.push({ to: { row: edgeJumpR, col: edgeJumpC }, captured: { row: nr, col: nc } });
          }
        }
      }
    }

    return moves;
  }
}
