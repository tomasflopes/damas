import { createGame } from '@/game/gameFactory.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { AlternatingTurnPolicy } from '@/policies/turn/alternatingTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

describe('Game - Board Operations', () => {
  describe('Piece Access', () => {
    test('getPiece returns null for empty square', () => {
      const game = createTestGame();
      game.clearBoard();

      const piece = game.getPiece(0, 0);
      expect(piece).toBeNull();
    });

    test('getPiece returns piece at specified location', () => {
      const game = createTestGame();
      const piece = game.getPiece(2, 1);
      expect(piece).toBeDefined();
      expect(piece?.player).toBe('dark');
    });

    test('getPiece returns correct piece after move', () => {
      const game = createTestGame();
      const originalPiece = game.getPiece(5, 0);

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      expect(game.getPiece(4, 1)).toEqual(originalPiece);
      expect(game.getPiece(5, 0)).toBeNull();
    });
  });

  describe('Piece Placement', () => {
    test('setPiece places piece at specified location', () => {
      const game = createTestGame();
      game.clearBoard();

      const piece = new LightPawn(1);
      game.setPiece(3, 3, piece);

      expect(game.getPiece(3, 3)).toEqual(piece);
    });

    test('setPiece can overwrite existing piece', () => {
      const game = createTestGame();
      const oldPiece = game.getPiece(2, 1);
      const newPiece = new LightPawn(1);

      game.setPiece(2, 1, newPiece);

      expect(game.getPiece(2, 1)).toEqual(newPiece);
      expect(game.getPiece(2, 1)).not.toEqual(oldPiece);
    });

    test('setPiece with null removes piece', () => {
      const game = createTestGame();
      game.setPiece(5, 0, null);

      expect(game.getPiece(5, 0)).toBeNull();
    });

    test('setPiece does not affect game state flags', () => {
      const game = createTestGame();
      const playerBefore = game.player;

      game.setPiece(3, 3, new DarkPawn(1));

      expect(game.player).toBe(playerBefore);
      expect(game.hasEnded).toBe(false);
    });
  });

  describe('Board Clearing', () => {
    test('clearBoard removes all pieces', () => {
      const game = createTestGame();
      game.clearBoard();

      let pieceCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)) pieceCount++;
        }
      }

      expect(pieceCount).toBe(0);
    });

    test('clearBoard does not change game state flags', () => {
      const game = createTestGame();
      game.clearBoard();

      expect(game.player).toBe('light');
      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
    });

    test('clearBoard allows setPiece to work', () => {
      const game = createTestGame();
      game.clearBoard();

      const piece = new LightPawn(1);
      game.setPiece(0, 1, piece);

      expect(game.getPiece(0, 1)).toEqual(piece);
    });
  });

  describe('Board Reset', () => {
    test('reset restores initial board configuration', () => {
      const game = createTestGame();
      game.clearBoard();

      game.reset();

      expect(game.getPiece(2, 1)?.player).toBe('dark');
      expect(game.getPiece(5, 0)?.player).toBe('light');
    });

    test('reset restores exactly 24 pieces (12 per side)', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(3, 3, new DarkPawn(1));

      game.reset();

      let lightCount = 0;
      let darkCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = game.getPiece(row, col);
          if (piece?.player === 'light') lightCount++;
          if (piece?.player === 'dark') darkCount++;
        }
      }

      expect(lightCount).toBe(12);
      expect(darkCount).toBe(12);
    });

    test('reset places dark pieces in rows 0-2', () => {
      const game = createTestGame();
      game.clearBoard();

      game.reset();

      for (let row = 0; row < 3; row++) {
        let hasDarkPiece = false;
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)?.player === 'dark') {
            hasDarkPiece = true;
            break;
          }
        }
        expect(hasDarkPiece).toBe(true);
      }
    });
    test('reset places light pieces in rows 5-7', () => {
      const game = createTestGame();
      game.clearBoard();

      game.reset();

      for (let row = 5; row < 8; row++) {
        let hasLightPiece = false;
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)?.player === 'light') {
            hasLightPiece = true;
            break;
          }
        }
        expect(hasLightPiece).toBe(true);
      }
    });
  });
});
