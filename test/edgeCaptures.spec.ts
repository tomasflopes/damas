import { DamaBoard } from '../src/board/damaBoard.js';
import { KingEdgeMoveHandler } from '../src/generators/handlers/kingEdgeMoveHandler.js';
import { PawnEdgeMoveHandler } from '../src/generators/handlers/pawnEdgeMoveHandler.js';
import { DamaPiece } from '../src/pieces/damaPiece.js';

describe('Edge Captures', () => {
  describe('Pawn Edge Captures', () => {
    test('light pawn captures opponent on left edge and bounces back', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(5, 0, new DamaPiece('dark'));
      board.setPiece(6, 1, new DamaPiece('light'));

      const moves = new PawnEdgeMoveHandler().handle(
        { row: 6, col: 1 },
        new DamaPiece('light'),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 4 && m.to.col === 1 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(5);
      expect(edgeCapture?.captured?.col).toBe(0);
    });

    test('light pawn captures opponent on right edge and bounces back', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(4, 7, new DamaPiece('dark'));
      board.setPiece(5, 6, new DamaPiece('light'));

      const moves = new PawnEdgeMoveHandler().handle(
        { row: 5, col: 6 },
        new DamaPiece('light'),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 3 && m.to.col === 6 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(4);
      expect(edgeCapture?.captured?.col).toBe(7);
    });

    test('dark pawn captures opponent on left edge and bounces back', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(2, 1, new DamaPiece('dark'));
      board.setPiece(3, 0, new DamaPiece('light'));

      const moves = new PawnEdgeMoveHandler().handle(
        { row: 2, col: 1 },
        new DamaPiece('dark'),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 4 && m.to.col === 1 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(3);
      expect(edgeCapture?.captured?.col).toBe(0);
    });

    test('dark pawn captures opponent on right edge and bounces back', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(3, 6, new DamaPiece('dark'));
      board.setPiece(4, 7, new DamaPiece('light'));

      const moves = new PawnEdgeMoveHandler().handle(
        { row: 3, col: 6 },
        new DamaPiece('dark'),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 5 && m.to.col === 6 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(4);
      expect(edgeCapture?.captured?.col).toBe(7);
    });
  });

  describe('King Edge Captures', () => {
    test('king captures opponent on left edge and bounces back (forward direction)', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(6, 1, new DamaPiece('light', true));
      board.setPiece(5, 0, new DamaPiece('dark'));

      const moves = new KingEdgeMoveHandler().handle(
        { row: 6, col: 1 },
        new DamaPiece('light', true),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 4 && m.to.col === 1 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(5);
      expect(edgeCapture?.captured?.col).toBe(0);
    });

    test('king captures opponent on right edge and bounces back (forward direction)', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(5, 6, new DamaPiece('light', true));
      board.setPiece(4, 7, new DamaPiece('dark'));

      const moves = new KingEdgeMoveHandler().handle(
        { row: 5, col: 6 },
        new DamaPiece('light', true),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 3 && m.to.col === 6 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(4);
      expect(edgeCapture?.captured?.col).toBe(7);
    });

    test('king captures opponent on left edge and bounces back (backward direction)', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(2, 1, new DamaPiece('dark', true));
      board.setPiece(3, 0, new DamaPiece('light'));

      const moves = new KingEdgeMoveHandler().handle(
        { row: 2, col: 1 },
        new DamaPiece('dark', true),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 4 && m.to.col === 1 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(3);
      expect(edgeCapture?.captured?.col).toBe(0);
    });

    test('king captures opponent on right edge and bounces back (backward direction)', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(2, 5, new DamaPiece('light', true));
      board.setPiece(4, 7, new DamaPiece('dark'));

      const moves = new KingEdgeMoveHandler().handle(
        { row: 2, col: 5 },
        new DamaPiece('light', true),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 5 && m.to.col === 6 && m.captured);
      expect(edgeCapture).toBeDefined();
      expect(edgeCapture?.captured?.row).toBe(4);
      expect(edgeCapture?.captured?.col).toBe(7);
    });

    test('king cannot capture when bounce-back square is occupied', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(6, 1, new DamaPiece('light', true));
      board.setPiece(5, 0, new DamaPiece('dark'));
      board.setPiece(4, 1, new DamaPiece('light'));

      const moves = new KingEdgeMoveHandler().handle(
        { row: 6, col: 1 },
        new DamaPiece('light', true),
        board,
      );

      const edgeCapture = moves.find((m) => m.to.row === 4 && m.to.col === 1 && m.captured);
      expect(edgeCapture).toBeUndefined();
    });
  });
});
