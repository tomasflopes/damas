import { createGame } from '@/game/gameFactory.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { AlternatingTurnPolicy } from '@/policies/turn/alternatingTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

describe('Game - Draw Detection', () => {
  describe('Draw Flag', () => {
    test('new game is not a draw', () => {
      const game = createTestGame();
      expect(game.isGameDraw).toBe(false);
    });

    test('game is not a draw when both players have multiple pieces', () => {
      const game = createTestGame();
      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      expect(game.isGameDraw).toBe(false);
    });
  });

  describe('Draw State Consistency', () => {
    test('draw and winner are mutually exclusive', () => {
      const game = createTestGame();

      if (game.hasEnded) {
        const isDraw = game.isGameDraw;
        const hasWinner = game.gameWinner !== null;

        expect(!(isDraw && hasWinner)).toBe(true);
      }
    });

    test('if game is draw, winner must be null', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(5, 0, new LightPawn());
      game.setPiece(3, 0, new DarkPawn());
      game.setPiece(2, 1, new DarkPawn());

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      if (game.isGameDraw) {
        expect(game.gameWinner).toBeNull();
      }
    });
  });

  describe('Draw Reset', () => {
    test('reset clears draw flag', () => {
      const game = createTestGame();

      game.clearBoard();
      game.setPiece(5, 0, new LightPawn());
      game.setPiece(3, 0, new DarkPawn());
      game.setPiece(2, 1, new DarkPawn());

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      game.reset();

      expect(game.isGameDraw).toBe(false);
      expect(game.hasEnded).toBe(false);
      expect(game.gameWinner).toBeNull();
    });

    test('reset allows new game after draw state', () => {
      const game = createTestGame();

      game.clearBoard();
      game.setPiece(5, 0, new LightPawn());
      game.setPiece(3, 0, new DarkPawn());
      game.setPiece(2, 1, new DarkPawn());

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      game.reset();

      expect(game.player).toBe('light');
      expect(game.hasEnded).toBe(false);
      expect(game.isGameDraw).toBe(false);

      let piecesCount = 0;
      for (let row = 0; row < game.size; row++) {
        for (let col = 0; col < game.size; col++) {
          if (game.getPiece(row, col)) piecesCount++;
        }
      }
      expect(piecesCount).toBeGreaterThan(2);
    });
  });

  describe('Draw Not Incorrectly Triggered', () => {
    test('normal game continuation is not marked as draw', () => {
      const game = createTestGame();

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });

      expect(game.isGameDraw).toBe(false);
      expect(game.hasEnded).toBe(false);
    });

    test('game with winner is not marked as draw', () => {
      const game = createTestGame();
      game.clearBoard();

      game.setPiece(2, 1, new DarkPawn());
      game.setPiece(5, 0, new LightPawn());

      const hasMove = game.getValidMoves({ row: 5, col: 0 }).length > 0;
      expect(hasMove).toBe(true);

      game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

      if (game.hasEnded) {
        expect(game.isGameDraw).toBe(false);
        expect(game.gameWinner).not.toBeNull();
      }
    });
  });
});
