import type { Board } from '../../board/board.js';
import type { Piece } from '../../pieces/piece.js';
import { PieceType } from '../../pieces/pieceType.js';
import type { Coord, MoveOption } from '../../types.js';
import { KingEdgeMoveHandler } from './kingEdgeMoveHandler.js';
import { BaseMoveHandler, isValidSquare } from './moveHandler.js';
import { PawnEdgeMoveHandler } from './pawnEdgeMoveHandler.js';

export class MultiCaptureHandler extends BaseMoveHandler {
  private pawnEdgeHandler = new PawnEdgeMoveHandler();
  private kingEdgeHandler = new KingEdgeMoveHandler();

  protected generate(from: Coord, piece: Piece, board: Board): MoveOption[] {
    const multiCaptureMoves: MoveOption[] = [];

    this.findMultiCaptureSequences(from, piece, board, from, [], (captures, destination) => {
      if (captures.length > 1) {
        multiCaptureMoves.push({
          to: destination,
          captured: captures,
        });
      }
    });

    return multiCaptureMoves;
  }

  private findMultiCaptureSequences(
    from: Coord,
    piece: Piece,
    board: Board,
    currentPos: Coord,
    capturedSoFar: Coord[],
    callback: (captures: Coord[], destination: Coord) => void,
  ): void {
    const directions: Array<[number, number]> = [];

    if (piece.type === PieceType.PAWN) {
      if (piece.player === 'light') directions.push([-1, -1], [-1, 1]);
      if (piece.player === 'dark') directions.push([1, -1], [1, 1]);
    } else {
      directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }

    for (const [dr, dc] of directions) {
      const targetRow = currentPos.row + dr;
      const targetCol = currentPos.col + dc;

      if (!isValidSquare(board, targetRow, targetCol)) continue;

      const target = board.getPiece(targetRow, targetCol);
      if (target && target.player !== piece.player) {
        const jumpRow = targetRow + dr;
        const jumpCol = targetCol + dc;

        if (isValidSquare(board, jumpRow, jumpCol) && !board.getPiece(jumpRow, jumpCol)) {
          const captureCoord = { row: targetRow, col: targetCol };
          const alreadyCaptured = capturedSoFar.some(
            (c) => c.row === captureCoord.row && c.col === captureCoord.col,
          );

          if (!alreadyCaptured) {
            const newCaptured = [...capturedSoFar, captureCoord];

            this.findMultiCaptureSequences(
              from,
              piece,
              board,
              { row: jumpRow, col: jumpCol },
              newCaptured,
              callback,
            );

            callback(newCaptured, { row: jumpRow, col: jumpCol });
          }
        }
      }
    }

    const edgeMoves =
      piece.type === PieceType.PAWN
        ? this.pawnEdgeHandler.handle(currentPos, piece, board)
        : this.kingEdgeHandler.handle(currentPos, piece, board);

    for (const move of edgeMoves) {
      const capturedEdge = move.captured;
      if (!Array.isArray(capturedEdge) && capturedEdge) {
        const alreadyCaptured = capturedSoFar.some(
          (c) => c.row === capturedEdge.row && c.col === capturedEdge.col,
        );

        if (!alreadyCaptured) {
          const newCaptured = [...capturedSoFar, capturedEdge];

          this.findMultiCaptureSequences(from, piece, board, move.to, newCaptured, callback);

          callback(newCaptured, move.to);
        }
      }
    }
  }
}
