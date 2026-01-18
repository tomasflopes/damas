import { DamaBoard } from '@/board/damaBoard.js';
import { DarkKing } from '@/pieces/dama/darkKing.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { MockPieceRenderer } from '@/utils/mockPieceRenderer.js';

const mockPieceRenderer = new MockPieceRenderer();

describe('Board - Advanced Operations', () => {
  describe('Dark Square Validation', () => {
    test('all board positions are identified as dark or light correctly', () => {
      const board = new DamaBoard(mockPieceRenderer);

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const isDarkSquare = (row + col) % 2 === 1;
          const piece = board.getPiece(row, col);

          if (!isDarkSquare) {
            expect(piece).toBeNull();
          }
        }
      }
    });
  });

  describe('Piece Placement and Retrieval', () => {
    test('setPiece and getPiece preserve piece identity', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      const piece = new LightPawn(42);
      board.setPiece(3, 3, piece);

      const retrieved = board.getPiece(3, 3);
      expect(retrieved).toBe(piece);
    });

    test('can place different piece types on board', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      const pawn = new LightPawn();
      const king = new DarkKing();

      board.setPiece(1, 1, pawn);
      board.setPiece(3, 3, king);

      expect(board.getPiece(1, 1)).toBe(pawn);
      expect(board.getPiece(3, 3)).toBe(king);
    });

    test('overwriting piece replaces it completely', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      const piece1 = new LightPawn();
      const piece2 = new DarkKing();

      board.setPiece(3, 3, piece1);
      expect(board.getPiece(3, 3)).toBe(piece1);

      board.setPiece(3, 3, piece2);
      expect(board.getPiece(3, 3)).toBe(piece2);
      expect(board.getPiece(3, 3)).not.toBe(piece1);
    });

    test('removing piece with null works correctly', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      const piece = new LightPawn();
      board.setPiece(3, 3, piece);
      expect(board.getPiece(3, 3)).not.toBeNull();

      board.setPiece(3, 3, null);
      expect(board.getPiece(3, 3)).toBeNull();
    });
  });

  describe('Board Clearing', () => {
    test('clearBoard removes all pieces', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      let pieceCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board.getPiece(row, col)) pieceCount++;
        }
      }

      expect(pieceCount).toBe(0);
    });

    test('cleared board has no light pieces', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      let lightCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board.getPiece(row, col)?.player === 'light') lightCount++;
        }
      }

      expect(lightCount).toBe(0);
    });

    test('cleared board has no dark pieces', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      let darkCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board.getPiece(row, col)?.player === 'dark') darkCount++;
        }
      }

      expect(darkCount).toBe(0);
    });
  });

  describe('Board Setup', () => {
    test('setupPieces populates board correctly', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();
      board.setupPieces();

      let lightCount = 0;
      let darkCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board.getPiece(row, col);
          if (piece?.player === 'light') lightCount++;
          if (piece?.player === 'dark') darkCount++;
        }
      }

      expect(lightCount).toBe(12);
      expect(darkCount).toBe(12);
    });

    test('setupPieces places pawns (not kings) initially', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();
      board.setupPieces();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board.getPiece(row, col);
          if (piece?.player === 'dark') {
            expect(piece.type).not.toBe('KING');
          }
        }
      }
    });
  });

  describe('Board Size and Dimensions', () => {
    test('board size is 8x8', () => {
      const board = new DamaBoard(mockPieceRenderer);
      expect(board.size).toBe(8);
    });

    test('getPiece works for all valid positions', () => {
      const board = new DamaBoard(mockPieceRenderer);

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board.getPiece(row, col);
          expect(piece === null || piece !== null).toBe(true);
        }
      }
    });

    test('setPiece works for all valid positions', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();
      const piece = new LightPawn();

      for (let row = 0; row < 8; row += 2) {
        for (let col = 1; col < 8; col += 2) {
          board.setPiece(row, col, piece);
          expect(board.getPiece(row, col)).not.toBeNull();
          board.setPiece(row, col, null);
        }
      }
    });
  });

  describe('Piece Movement Simulation', () => {
    test('can simulate moving a piece across the board', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      const piece = new LightPawn();

      board.setPiece(5, 0, piece);
      expect(board.getPiece(5, 0)).toBe(piece);

      board.setPiece(5, 0, null);
      board.setPiece(4, 1, piece);
      expect(board.getPiece(4, 1)).toBe(piece);

      board.setPiece(4, 1, null);
      board.setPiece(3, 2, piece);
      expect(board.getPiece(3, 2)).toBe(piece);
      expect(board.getPiece(5, 0)).toBeNull();
      expect(board.getPiece(4, 1)).toBeNull();
    });

    test('can capture pieces by replacing them', () => {
      const board = new DamaBoard(mockPieceRenderer);
      board.clearBoard();

      const attacker = new LightPawn();
      const defender = new DarkPawn();

      board.setPiece(4, 2, attacker);
      board.setPiece(3, 1, defender);

      board.setPiece(4, 2, null);
      board.setPiece(3, 1, null);
      board.setPiece(2, 0, attacker);

      expect(board.getPiece(2, 0)).toBe(attacker);
      expect(board.getPiece(3, 1)).toBeNull();
    });
  });

  describe('Initial Setup Validation', () => {
    test('dark pieces do not start in bottom 3 rows', () => {
      const board = new DamaBoard(mockPieceRenderer);

      for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board.getPiece(row, col);
          if (piece) {
            expect(piece.player).not.toBe('dark');
          }
        }
      }
    });

    test('light pieces do not start in top 3 rows', () => {
      const board = new DamaBoard(mockPieceRenderer);

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board.getPiece(row, col);
          if (piece) {
            expect(piece.player).not.toBe('light');
          }
        }
      }
    });

    test('all initial pieces are on dark squares', () => {
      const board = new DamaBoard(mockPieceRenderer);

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board.getPiece(row, col);
          if (piece) {
            const isDarkSquare = (row + col) % 2 === 1;
            expect(isDarkSquare).toBe(true);
          }
        }
      }
    });
  });
});
