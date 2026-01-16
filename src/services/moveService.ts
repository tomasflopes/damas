import { Board } from '../board.js';
import { Coord, MoveGenerator, MoveOption, MoveResult, PromotionPolicy } from '../types.js';

export class MoveService {
  constructor(
    private readonly board: Board,
    private readonly moveGenerator: MoveGenerator,
    private readonly promotionPolicy: PromotionPolicy,
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

    if (allowed.captured) this.board.setPiece(allowed.captured.row, allowed.captured.col, null);
    if (this.promotionPolicy.shouldPromote(piece, to.row, this.board.size)) piece.promote();

    return { success: true, captured: allowed.captured };
  }
}
