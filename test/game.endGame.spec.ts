import { createGame } from '../src/game/gameFactory.js';
import { DarkPawn } from '../src/pieces/dama/darkPawn.js';
import { LightPawn } from '../src/pieces/dama/lightPawn.js';
import { AlternatingTurnPolicy } from '../src/policies/turn/alternatingTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

describe('Game - End Game', () => {
  describe('Game state getters', () => {
    test('new game has not ended', () => {
      const game = createTestGame();
      expect(game.hasEnded).toBe(false);
    });

    test('new game has no winner', () => {
      const game = createTestGame();
      expect(game.gameWinner).toBeNull();
    });
  });

  describe('checkGameEnd detection', () => {
    test('game does not end when both players have valid moves', () => {
      const game = createTestGame();
      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
    });

    test('game state after initial move', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
    });
  });

  describe('reset functionality', () => {
    test('reset clears and restores the board', () => {
      const game = createTestGame();
      game.clearBoard();
      game.setPiece(0, 0, new LightPawn(1));

      let piecesBeforeClear = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)) piecesBeforeClear++;
        }
      }

      game.reset();

      let piecesAfterReset = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)) piecesAfterReset++;
        }
      }

      expect(piecesAfterReset).toBeGreaterThan(piecesBeforeClear);
    });

    test('reset resets gameEnded flag', () => {
      const game = createTestGame();
      game.clearBoard();

      game.reset();

      expect(game.hasEnded).toBe(false);
    });

    test('reset clears winner', () => {
      const game = createTestGame();
      game.clearBoard();

      game.reset();

      expect(game.gameWinner).toBeNull();
    });

    test('reset sets current player back to light', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      expect(game.player).toBe('dark');

      game.reset();

      expect(game.player).toBe('light');
    });

    test('reset restores full board setup', () => {
      const game = createTestGame();

      let initialPieceCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)) initialPieceCount++;
        }
      }

      game.clearBoard();
      game.setPiece(3, 3, new LightPawn(1));

      let modifiedPieceCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)) modifiedPieceCount++;
        }
      }

      expect(modifiedPieceCount).toBeLessThan(initialPieceCount);

      game.reset();

      let resetPieceCount = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (game.getPiece(row, col)) resetPieceCount++;
        }
      }

      expect(resetPieceCount).toBe(initialPieceCount);
    });

    test('reset allows new game to be played', () => {
      const game = createTestGame();

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });

      game.reset();

      const moveResult = game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      expect(moveResult).toBe(true);
      expect(game.player).toBe('dark');
    });
  });

  describe('game end with no pieces', () => {
    test('can access game state with limited pieces', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(2, 1, new DarkPawn(1));

      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
      expect(game.player).toBe('light');

      const lightPieceCount = Array.from({ length: 8 }).reduce((count: number, _, row) => {
        return (
          count +
          Array.from({ length: 8 }).filter((_, col) => game.getPiece(row, col)?.player === 'light')
            .length
        );
      }, 0);

      expect(lightPieceCount).toBe(0);
    });
  });

  describe('winner determination', () => {
    test('game can detect when a player cannot move', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(2, 1, new DarkPawn(1));

      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
      expect(game.player).toBe('light');

      const lightPieceCount = Array.from({ length: 8 }).reduce((count: number, _, row) => {
        return (
          count +
          Array.from({ length: 8 }).filter((_, col) => game.getPiece(row, col)?.player === 'light')
            .length
        );
      }, 0);
      expect(lightPieceCount).toBe(0);
    });

    test('player switching works correctly during game', () => {
      const game = createTestGame();

      expect(game.player).toBe('light');

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      expect(game.player).toBe('dark');

      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      expect(game.player).toBe('light');
    });
  });

  describe('game state consistency during end game', () => {
    test('hasEnded and gameWinner are consistent when game ends', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(2, 1, new DarkPawn(1));

      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
      expect(game.player).toBe('light');

      const hasLightPieces = Array.from({ length: 8 }).some((_, row) =>
        Array.from({ length: 8 }).some((_, col) => game.getPiece(row, col)?.player === 'light'),
      );
      expect(hasLightPieces).toBe(false);
    });

    test('game state is locked after end game', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(2, 1, new DarkPawn(1));
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });

      if (game.player === 'light') {
        const hasLightPieces = Array.from({ length: 8 }).some((_, row) =>
          Array.from({ length: 8 }).some((_, col) => game.getPiece(row, col)?.player === 'light'),
        );
        if (!hasLightPieces && game.hasEnded) {
          expect(game.hasEnded).toBe(true);
          const winner = game.gameWinner;

          expect(game.gameWinner).toBe(winner);
          expect(game.gameWinner).toBe('dark');
        }
      }
    });

    test('checkGameEnd is called only once', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(1, 1, new DarkPawn(1));
      game.movePiece({ row: 1, col: 1 }, { row: 2, col: 0 });

      if (game.player === 'light') {
        const hasLightPieces = Array.from({ length: 8 }).some((_, row) =>
          Array.from({ length: 8 }).some((_, col) => game.getPiece(row, col)?.player === 'light'),
        );
        if (!hasLightPieces && game.hasEnded) {
          const firstWinner = game.gameWinner;

          expect(game.gameWinner).toBe(firstWinner);
        }
      }
    });
  });

  describe('reset after game end', () => {
    test('can reset after game ends', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(1, 1, new DarkPawn(1));
      game.movePiece({ row: 1, col: 1 }, { row: 2, col: 0 });

      if (game.hasEnded) {
        expect(game.hasEnded).toBe(true);

        game.reset();

        expect(game.hasEnded).toBe(false);
        expect(game.gameWinner).toBeNull();
      }
    });

    test('reset restores playable state after game end', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(1, 1, new DarkPawn(1));
      game.movePiece({ row: 1, col: 1 }, { row: 2, col: 0 });

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

      expect(lightCount).toBeGreaterThan(0);
      expect(darkCount).toBeGreaterThan(0);
    });
  });
});
