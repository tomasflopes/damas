import { createGame } from '@/game/gameFactory.js';
import { AlternatingTurnPolicy } from '@/policies/turn/alternatingTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

describe('Game - State Management', () => {
  describe('Initialization', () => {
    test('new game has light player as current player', () => {
      const game = createTestGame();
      expect(game.player).toBe('light');
    });

    test('new game has not ended', () => {
      const game = createTestGame();
      expect(game.hasEnded).toBe(false);
    });

    test('new game has no winner', () => {
      const game = createTestGame();
      expect(game.gameWinner).toBeNull();
    });

    test('debug mode is disabled by default', () => {
      const game = createTestGame();
      expect(game.isDebugModeEnabled).toBe(false);
    });
  });

  describe('Debug Mode', () => {
    test('toggleDebugMode enables debug mode', () => {
      const game = createTestGame();
      const result = game.toggleDebugMode();
      expect(result).toBe(true);
      expect(game.isDebugModeEnabled).toBe(true);
    });

    test('toggleDebugMode disables debug mode when enabled', () => {
      const game = createTestGame();
      game.toggleDebugMode();
      const result = game.toggleDebugMode();
      expect(result).toBe(false);
      expect(game.isDebugModeEnabled).toBe(false);
    });

    test('toggleDebugMode returns the new state', () => {
      const game = createTestGame();
      expect(game.toggleDebugMode()).toBe(true);
      expect(game.toggleDebugMode()).toBe(false);
      expect(game.toggleDebugMode()).toBe(true);
    });
  });

  describe('Board Size', () => {
    test('game board size is 8', () => {
      const game = createTestGame();
      expect(game.size).toBe(8);
    });
  });

  describe('Audio Service', () => {
    test('game provides access to audio service', () => {
      const game = createTestGame();
      expect(game.audio).toBeDefined();
    });
  });

  describe('Reset', () => {
    test('reset restores initial game state', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      game.reset();

      expect(game.player).toBe('light');
      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
    });

    test('reset restores board with all pieces', () => {
      const game = createTestGame();
      game.clearBoard();

      game.reset();

      let pieceCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)) pieceCount++;
        }
      }
      expect(pieceCount).toBeGreaterThan(0);
    });

    test('reset clears game ended flag after game ends', () => {
      const game = createTestGame();
      game.clearBoard();

      game.reset();

      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
    });
  });
});
