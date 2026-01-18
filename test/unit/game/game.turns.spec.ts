import { createGame } from '@/game/gameFactory.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { AlternatingTurnPolicy } from '@/policies/turn/alternatingTurnPolicy.js';
import { FreeTurnPolicy } from '@/policies/turn/freeTurnPolicy.js';

describe('Game - Turn Management', () => {
  describe('Turn Switching with FreeTurnPolicy', () => {
    const createTestGame = () => createGame({ turnPolicy: new FreeTurnPolicy() });

    test('same player can move twice in a row with FreeTurnPolicy', () => {
      const game = createTestGame();

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      const playerAfterFirstMove = game.player;

      game.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
      const playerAfterSecondMove = game.player;

      expect(playerAfterFirstMove).toBe(playerAfterSecondMove);
    });
  });

  describe('Turn Switching with AlternatingTurnPolicy', () => {
    const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

    test('turns alternate between light and dark', () => {
      const game = createTestGame();

      expect(game.player).toBe('light');
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      expect(game.player).toBe('dark');

      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      expect(game.player).toBe('light');
    });

    test('player alternates correctly over multiple moves', () => {
      const game = createTestGame();
      const moves = [
        [
          { row: 5, col: 0 },
          { row: 4, col: 1 },
        ],
        [
          { row: 2, col: 1 },
          { row: 3, col: 0 },
        ],
        [
          { row: 5, col: 2 },
          { row: 4, col: 3 },
        ],
        [
          { row: 2, col: 3 },
          { row: 3, col: 2 },
        ],
      ];

      let expectedPlayer: 'light' | 'dark' = 'light';
      for (const [from, to] of moves) {
        expect(game.player).toBe(expectedPlayer);
        game.movePiece(from, to);
        expectedPlayer = expectedPlayer === 'light' ? 'dark' : 'light';
      }
      expect(game.player).toBe(expectedPlayer);
    });

    test('cannot move opponent piece', () => {
      const game = createTestGame();

      // Light's turn - can move light piece
      const lightMove = game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      expect(lightMove).toBe(true);

      // Dark's turn - cannot move light piece
      const darkMoveLight = game.movePiece({ row: 4, col: 1 }, { row: 3, col: 2 });
      expect(darkMoveLight).toBe(false);

      // Dark's turn - can move dark piece
      const darkMove = game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      expect(darkMove).toBe(true);
    });
  });

  describe('Valid Move Checking', () => {
    const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

    test('current player cannot move opponent pieces', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(2, 1, new DarkPawn(1));
      game.setPiece(5, 0, new LightPawn(1));

      // Light's turn - can only see light piece moves
      const darkMoves = game.getValidMoves({ row: 2, col: 1 });
      expect(darkMoves.length).toBe(0);

      const lightMoves = game.getValidMoves({ row: 5, col: 0 });
      expect(lightMoves.length).toBeGreaterThan(0);
    });

    test('getValidMoves returns empty array for non-existent piece', () => {
      const game = createTestGame();
      game.clearBoard();

      const moves = game.getValidMoves({ row: 0, col: 0 });
      expect(moves).toEqual([]);
    });

    test('getValidMoves respects turn policy', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(2, 1, new DarkPawn(1));
      game.setPiece(5, 0, new LightPawn(1));

      // Light's turn
      expect(game.player).toBe('light');

      // Cannot get moves for dark piece
      const darkMoves = game.getValidMoves({ row: 2, col: 1 });
      expect(darkMoves.length).toBe(0);
    });
  });

  describe('Move Result Validation', () => {
    const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

    test('movePiece returns false for non-existent piece', () => {
      const game = createTestGame();
      game.clearBoard();

      const result = game.movePiece({ row: 0, col: 0 }, { row: 1, col: 1 });
      expect(result).toBe(false);
    });

    test('movePiece returns false when moving opponent piece', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(2, 1, new DarkPawn(1));

      // Light's turn - cannot move dark piece
      const result = game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      expect(result).toBe(false);
    });

    test('failed move does not change current player', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(5, 0, new LightPawn(1));

      const playerBefore = game.player;
      game.movePiece({ row: 5, col: 0 }, { row: 5, col: 1 }); // Invalid move
      const playerAfter = game.player;

      expect(playerBefore).toBe(playerAfter);
    });
  });
});
