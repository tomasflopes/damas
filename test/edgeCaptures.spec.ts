import { DamaBoard } from '../src/board/damaBoard.js';
import { DamaMoveGenerator } from '../src/generators/damaMoveGenerator.js';
import { DamaPiece } from '../src/pieces/damaPiece.js';

describe('Edge Captures', () => {
  describe('Pawn Edge Captures', () => {
    test('light pawn captures opponent on left edge and bounces back', () => {
      const board = new DamaBoard();
      board.clearBoard();
      board.setPiece(5, 0, new DamaPiece('dark'));
      board.setPiece(6, 1, new DamaPiece('light'));

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 6, col: 1 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 5, col: 6 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 2, col: 1 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 3, col: 6 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 6, col: 1 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 5, col: 6 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 2, col: 1 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 2, col: 5 });

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

      const generator = new DamaMoveGenerator(board);
      const moves = generator.getValidMoves({ row: 6, col: 1 });

      const edgeCapture = moves.find((m) => m.to.row === 4 && m.to.col === 1 && m.captured);
      expect(edgeCapture).toBeUndefined();
    });
  });
});
