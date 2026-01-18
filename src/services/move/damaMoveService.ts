import { Board } from '../../board/board.js';
import { PieceRenderer } from '../../pieces/pieceRenderer.js';
import { Coord, MoveGenerator, MoveOption, MoveResult, PromotionPolicy } from '../../types.js';
import { MoveService } from './moveService.js';

export class DamaMoveService implements MoveService {
  constructor(
    private readonly board: Board,
    private readonly moveGenerator: MoveGenerator,
    private readonly promotionPolicy: PromotionPolicy,
    private readonly pieceRenderer: PieceRenderer,
  ) {}

  getValidMoves(from: Coord): MoveOption[] {
    return this.moveGenerator.getValidMoves(from);
  }

  move(from: Coord, to: Coord): MoveResult {
    const piece = this.board.getPiece(from.row, from.col);
    if (!piece) return { success: false };

    const validMoves = this.moveGenerator.getValidMoves(from);
    const allowed = validMoves.find((m) => m.to.row === to.row && m.to.col === to.col);
    if (!allowed) return { success: false };

    this.board.setPiece(to.row, to.col, piece);
    this.board.setPiece(from.row, from.col, null);

    if (allowed.captured) {
      const captures = Array.isArray(allowed.captured) ? allowed.captured : [allowed.captured];
      for (const capturedCoord of captures) {
        this.board.setPiece(capturedCoord.row, capturedCoord.col, null);
      }
    }

    if (this.promotionPolicy.shouldPromote(piece, to.row, this.board.size)) {
      const promotedPiece = this.pieceRenderer.create(piece.player, true);
      this.board.setPiece(to.row, to.col, promotedPiece);
    }

    return { success: true, captured: allowed.captured };
  }
}
