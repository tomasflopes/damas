import { createGame } from '../game/gameFactory.js';
import { Piece } from '../piece.js';
import { FreeTurnPolicy } from '../policies/turn/freeTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new FreeTurnPolicy() });

describe('Board', () => {
  describe('Basic Movement', () => {
    test('light piece can move diagonally forward-left on dark square', () => {
      const game = createTestGame();
      const result = game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      expect(result).toBe(true);
      expect(game.getPiece(4, 1)?.player).toBe('light');
      expect(game.getPiece(5, 0)).toBeNull();
    });

    test('light piece can move diagonally forward-right on dark square', () => {
      const game = createTestGame();
      const result = game.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
      expect(result).toBe(true);
      expect(game.getPiece(4, 3)?.player).toBe('light');
      expect(game.getPiece(5, 2)).toBeNull();
    });

    test('dark piece can move diagonally forward-left on dark square', () => {
      const game = createTestGame();
      const result = game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      expect(result).toBe(true);
      expect(game.getPiece(3, 0)?.player).toBe('dark');
      expect(game.getPiece(2, 1)).toBeNull();
    });

    test('dark piece can move diagonally forward-right on dark square', () => {
      const game = createTestGame();
      const result = game.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });
      expect(result).toBe(true);
      expect(game.getPiece(3, 2)?.player).toBe('dark');
      expect(game.getPiece(2, 1)).toBeNull();
    });

    test('piece cannot move backwards (non-king)', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      const result = game.movePiece({ row: 4, col: 1 }, { row: 5, col: 0 });
      expect(result).toBe(false);
    });

    test('piece cannot move to light square', () => {
      const game = createTestGame();
      const result = game.movePiece({ row: 5, col: 0 }, { row: 4, col: 0 });
      expect(result).toBe(false);
    });

    test('piece cannot move to occupied square', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      const result = game.movePiece({ row: 4, col: 1 }, { row: 3, col: 0 });
      expect(result).toBe(false);
    });

    test('cannot move from empty square', () => {
      const game = createTestGame();
      const result = game.movePiece({ row: 4, col: 1 }, { row: 3, col: 0 });
      expect(result).toBe(false);
    });

    test('cannot move out of bounds', () => {
      const game = createTestGame();
      const result = game.movePiece({ row: 5, col: 0 }, { row: -1, col: -1 });
      expect(result).toBe(false);
    });
  });

  describe('Capture Logic', () => {
    test('light piece can capture dark piece', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });

      const game2 = createTestGame();
      game2.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
      game2.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });

      const result = game2.movePiece({ row: 4, col: 3 }, { row: 2, col: 1 });
      expect(result).toBe(true);
      expect(game2.getPiece(2, 1)?.player).toBe('light');
      expect(game2.getPiece(3, 2)).toBeNull();
      expect(game2.getPiece(4, 3)).toBeNull();
    });

    test('dark piece can capture light piece', () => {
      const game = createTestGame();
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      game.movePiece({ row: 3, col: 0 }, { row: 4, col: 1 });

      const game2 = createTestGame();
      game2.movePiece({ row: 2, col: 3 }, { row: 3, col: 2 });
      game2.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      const result = game2.movePiece({ row: 3, col: 2 }, { row: 5, col: 0 });
      expect(result).toBe(true);
      expect(game2.getPiece(5, 0)?.player).toBe('dark');
      expect(game2.getPiece(4, 1)).toBeNull();
    });

    test('cannot capture own piece', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      game.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
      game.movePiece({ row: 4, col: 3 }, { row: 3, col: 2 });

      const result = game.movePiece({ row: 4, col: 1 }, { row: 2, col: 3 });
      expect(result).toBe(false);
    });

    test('cannot capture if landing square is occupied', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });
      game.movePiece({ row: 5, col: 2 }, { row: 2, col: 3 });

      const validMoves = game.getValidMoves({ row: 4, col: 1 });
      const captureMove = validMoves.find((m) => m.captured);
      expect(captureMove).toBeUndefined();
    });
  });

  describe('King Promotion', () => {
    test('light piece promotes to king when reaching row 0', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(1, 0, new Piece('light'));

      const result = game.movePiece({ row: 1, col: 0 }, { row: 0, col: 1 });
      expect(result).toBe(true);

      const piece = game.getPiece(0, 1);
      expect(piece?.isKing).toBe(true);
      expect(piece?.player).toBe('light');
    });

    test('dark piece promotes to king when reaching row 7', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(6, 1, new Piece('dark'));

      const result = game.movePiece({ row: 6, col: 1 }, { row: 7, col: 0 });
      expect(result).toBe(true);

      const piece = game.getPiece(7, 0);
      expect(piece?.isKing).toBe(true);
      expect(piece?.player).toBe('dark');
    });

    test('king can move backwards', () => {
      const game = createTestGame();
      game.clearBoard();
      const king = new Piece('light', true);
      game.setPiece(3, 2, king);

      const resultForward = game.movePiece({ row: 3, col: 2 }, { row: 2, col: 3 });
      expect(resultForward).toBe(true);

      const resultBackward = game.movePiece({ row: 2, col: 3 }, { row: 3, col: 2 });
      expect(resultBackward).toBe(true);
      expect(game.getPiece(3, 2)?.isKing).toBe(true);
    });
  });

  describe('Valid Moves Detection', () => {
    test('getValidMoves returns correct moves for light piece', () => {
      const game = createTestGame();
      const moves = game.getValidMoves({ row: 5, col: 0 });

      expect(moves.length).toBeGreaterThan(0);
      expect(moves.some((m) => m.to.row === 4 && m.to.col === 1)).toBe(true);
    });

    test('getValidMoves returns empty for empty square', () => {
      const game = createTestGame();
      const moves = game.getValidMoves({ row: 4, col: 1 });
      expect(moves.length).toBe(0);
    });

    test('getValidMoves includes capture when available', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });

      const moves = game.getValidMoves({ row: 4, col: 3 });
      const captureMove = moves.find((m) => m.captured);

      expect(captureMove).toBeDefined();
      expect(captureMove?.to.row).toBe(2);
      expect(captureMove?.to.col).toBe(1);
      expect(captureMove?.captured?.row).toBe(3);
      expect(captureMove?.captured?.col).toBe(2);
    });

    test('piece blocked by friendly piece has no moves', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 2 }, { row: 4, col: 1 });

      const moves = game.getValidMoves({ row: 5, col: 0 });
      expect(moves.length).toBe(0);
    });

    test('king has correct valid moves', () => {
      const game = createTestGame();
      game.clearBoard();
      const king = new Piece('dark', true);
      game.setPiece(4, 3, king);

      const moves = game.getValidMoves({ row: 4, col: 3 });
      expect(moves.length).toBe(13);
      expect(moves.some((m) => m.to.row === 3 && m.to.col === 2)).toBe(true);
      expect(moves.some((m) => m.to.row === 5 && m.to.col === 4)).toBe(true);
      expect(moves.some((m) => m.to.row === 1 && m.to.col === 0)).toBe(true);
      expect(moves.some((m) => m.to.row === 7 && m.to.col === 6)).toBe(true);
    });

    test('king capture move is detected', () => {
      const game = createTestGame();
      game.clearBoard();
      const king = new Piece('light', true);
      game.setPiece(4, 3, king);
      game.setPiece(2, 1, new Piece('dark'));

      const moves = game.getValidMoves({ row: 4, col: 3 });
      const captureMove = moves.find((m) => m.captured);
      expect(captureMove).toBeDefined();
      expect(captureMove?.to.row).toBe(1);
      expect(captureMove?.to.col).toBe(0);
      expect(captureMove?.captured?.row).toBe(2);
      expect(captureMove?.captured?.col).toBe(1);
    });

    test('king should not be able to jump over multiple pieces', () => {
      const game = createTestGame();
      game.clearBoard();
      const king = new Piece('dark', true);
      game.setPiece(4, 3, king);
      game.setPiece(3, 2, new Piece('light'));
      game.setPiece(2, 1, new Piece('light'));

      const moves = game.getValidMoves({ row: 4, col: 3 });
      const invalidCaptureMove = moves.find((m) => m.captured && m.to.row === 1 && m.to.col === 0);
      expect(invalidCaptureMove).toBeUndefined();
    });
  });

  describe('Board Initialization', () => {
    test('board initializes with correct number of pieces', () => {
      const game = createTestGame();
      let lightCount = 0;
      let darkCount = 0;

      for (let row = 0; row < game.size; row++) {
        for (let col = 0; col < game.size; col++) {
          const piece = game.getPiece(row, col);
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
      const game = createTestGame();

      for (let row = 0; row < game.size; row++) {
        for (let col = 0; col < game.size; col++) {
          const piece = game.getPiece(row, col);
          if (piece) {
            expect((row + col) % 2).toBe(1);
          }
        }
      }
    });

    test('light pieces start in bottom 3 rows', () => {
      const game = createTestGame();

      for (let row = 5; row < 8; row++) {
        for (let col = 0; col < game.size; col++) {
          const piece = game.getPiece(row, col);
          if (piece) {
            expect(piece.player).toBe('light');
          }
        }
      }
    });

    test('dark pieces start in top 3 rows', () => {
      const game = createTestGame();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < game.size; col++) {
          const piece = game.getPiece(row, col);
          if (piece) {
            expect(piece.player).toBe('dark');
          }
        }
      }
    });
  });
});
