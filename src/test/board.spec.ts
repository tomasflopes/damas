import { DamaBoard } from '../board/damaBoard.js';
import { DamaPiece } from '../pieces/damaPiece.js';

describe('Board', () => {
  describe('Board Initialization', () => {
    test('board initializes with correct number of pieces', () => {
      const board = new DamaBoard();
      let lightCount = 0;
      let darkCount = 0;

      for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
          const piece = board.getPiece(row, col);
          if (piece) {
            if (piece.player === 'light') lightCount++;
            else darkCount++;
          }
        }
      }

      expect(lightCount).toBe(12);
      expect(darkCount).toBe(12);
    });

    test('pieces only on dark squares initially', () => {
      const board = new DamaBoard();

      for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
          const piece = board.getPiece(row, col);
          if (piece) {
            expect((row + col) % 2).toBe(1);
          }
        }
      }
    });

    test('light pieces start in bottom 3 rows', () => {
      const board = new DamaBoard();

      for (let row = 5; row < 8; row++) {
        for (let col = 0; col < board.size; col++) {
          const piece = board.getPiece(row, col);
          if (piece) {
            expect(piece.player).toBe('light');
          }
        }
      }
    });

    test('dark pieces start in top 3 rows', () => {
      const board = new DamaBoard();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < board.size; col++) {
          const piece = board.getPiece(row, col);
          if (piece) {
            expect(piece.player).toBe('dark');
          }
        }
      }
    });
  });

  describe('Board Operations', () => {
    test('getPiece returns correct piece', () => {
      const board = new DamaBoard();
      const piece = board.getPiece(5, 0);
      expect(piece).not.toBeNull();
      expect(piece?.player).toBe('light');
    });

    test('setPiece updates board state', () => {
      const board = new DamaBoard();
      board.clearBoard();
      const piece = new DamaPiece('light');
      board.setPiece(3, 3, piece);
      expect(board.getPiece(3, 3)).toBe(piece);
    });

    test('clearBoard removes all pieces', () => {
      const board = new DamaBoard();
      board.clearBoard();
      for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
          expect(board.getPiece(row, col)).toBeNull();
        }
      }
    });

    test('inBounds validates coordinates', () => {
      const board = new DamaBoard();
      expect(board.inBounds(0, 0)).toBe(true);
      expect(board.inBounds(7, 7)).toBe(true);
      expect(board.inBounds(-1, 0)).toBe(false);
      expect(board.inBounds(8, 0)).toBe(false);
    });

    test('isDarkSquare identifies dark squares correctly', () => {
      const board = new DamaBoard();
      expect(board.isDarkSquare(0, 0)).toBe(false);
      expect(board.isDarkSquare(0, 1)).toBe(true);
      expect(board.isDarkSquare(1, 0)).toBe(true);
      expect(board.isDarkSquare(1, 1)).toBe(false);
    });
  });
});
