import { Board } from '../board/board.js';
import { Coord, MoveGenerator, MoveHandler, MoveOption } from '../types.js';
import { KingEdgeMoveHandler } from './handlers/kingEdgeMoveHandler.js';
import { KingMoveHandler } from './handlers/kingMoveHandler.js';
import { MultiCaptureHandler } from './handlers/multiCaptureHandler.js';
import { PawnEdgeMoveHandler } from './handlers/pawnEdgeMoveHandler.js';
import { PawnMoveHandler } from './handlers/pawnMoveHandler.js';

export class DamaMoveGenerator implements MoveGenerator {
  private readonly chain: MoveHandler;

  constructor(private readonly board: Board) {
    const multiCapture = new MultiCaptureHandler();
    const pawn = new PawnMoveHandler();
    const king = new KingMoveHandler();
    const pawnEdge = new PawnEdgeMoveHandler();
    const kingEdge = new KingEdgeMoveHandler();

    multiCapture.setNext(pawn).setNext(king).setNext(pawnEdge).setNext(kingEdge);

    this.chain = multiCapture;
  }

  getValidMoves(from: Coord): MoveOption[] {
    const piece = this.board.getPiece(from.row, from.col);
    if (!piece) return [];

    return this.chain.handle(from, piece, this.board);
  }
}
