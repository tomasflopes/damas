import type { Board } from '../../board/board.js';
import type { Piece } from '../../pieces/piece.js';
import { PieceType } from '../../pieces/pieceType.js';
import type { Coord, MoveOption } from '../../types.js';
import { BaseMoveHandler, isValidSquare } from './moveHandler.js';

export class KingEdgeMoveHandler extends BaseMoveHandler {
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
      let captured: Coord | null = null;

      while (isValidSquare(board, r, c)) {
        const occ = board.getPiece(r, c);

        if (!occ) {
          r += dr;
          c += dc;
          continue;
        }

        if (occ.player === piece.player) break;

        captured = { row: r, col: c };
        const opponentOnEdge = captured.col === 0 || captured.col === 7;
        if (!opponentOnEdge) break;

        const landingR = captured.row + dr;
        const landingC = captured.col - dc;

        if (isValidSquare(board, landingR, landingC) && !board.getPiece(landingR, landingC))
          moves.push({ to: { row: landingR, col: landingC }, captured });

        break;
      }
    }

    return moves;
  }
}
