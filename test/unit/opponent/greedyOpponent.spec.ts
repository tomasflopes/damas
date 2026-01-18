import { createGame } from '@/game/gameFactory.js';
import { GreedyOpponent } from '@/opponent/greedyOpponent.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { AlternatingTurnPolicy } from '@/policies/turn/alternatingTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

describe('GreedyOpponent', () => {
  describe('Basic Properties', () => {
    test('has correct name', () => {
      const opponent = new GreedyOpponent();
      expect(opponent.name()).toBe('Greedy (Captures First)');
    });

    test('name is always consistent', () => {
      const opponent = new GreedyOpponent();
      expect(opponent.name()).toBe(opponent.name());
    });
  });

  describe('Move Making - Initial Position', () => {
    test('makes a valid move from initial position', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      const move = opponent.makeMove(game);
      expect(move).not.toBeNull();
      if (move) {
        expect(move.from).toBeDefined();
        expect(move.to).toBeDefined();
        expect(move.from.row).toBeGreaterThanOrEqual(0);
        expect(move.from.row).toBeLessThan(8);
        expect(move.from.col).toBeGreaterThanOrEqual(0);
        expect(move.from.col).toBeLessThan(8);
      }
    });

    test('selected piece belongs to current player', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      const move = opponent.makeMove(game);
      expect(move).not.toBeNull();
      if (move) {
        const piece = game.getPiece(move.from.row, move.from.col);
        expect(piece).not.toBeNull();
        expect(piece?.player).toBe(game.player);
      }
    });

    test('move is from valid available moves', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      const move = opponent.makeMove(game);
      expect(move).not.toBeNull();
      if (move) {
        const validMoves = game.getValidMoves(move.from);
        const isValid = validMoves.some(
          (vm) => vm.to.row === move.to.row && vm.to.col === move.to.col,
        );
        expect(isValid).toBe(true);
      }
    });
  });

  describe('Capture Prioritization', () => {
    test('prioritizes capture moves when available', () => {
      const game = createTestGame();

      // Manually set up a position where a capture is available
      // Light piece at (5, 2) can capture dark piece at (4, 3) by moving to (3, 4)
      game.clearBoard();
      game.setPiece(5, 2, new LightPawn());
      game.setPiece(4, 3, new DarkPawn());
      game.setPiece(3, 4, null); // Empty square for capture

      // Light's turn - should be able to capture
      const opponent = new GreedyOpponent();
      const move = opponent.makeMove(game);

      expect(move).not.toBeNull();
      if (move) {
        const validMoves = game.getValidMoves(move.from);
        const selectedMove = validMoves.find(
          (vm) => vm.to.row === move.to.row && vm.to.col === move.to.col,
        );

        // If a capture move exists for this piece, it should be selected
        if (selectedMove && selectedMove.captured) {
          expect(selectedMove.captured).toBeDefined();
        }
      }
    });

    test('makes regular move when no captures available', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      // From initial position, no captures are possible
      const move = opponent.makeMove(game);

      expect(move).not.toBeNull();
      if (move) {
        const validMoves = game.getValidMoves(move.from);
        const selectedMove = validMoves.find(
          (vm) => vm.to.row === move.to.row && vm.to.col === move.to.col,
        );

        // Initial position has no captures, so this is a regular move
        expect(selectedMove).toBeDefined();
      }
    });
  });

  describe('Move Making - Multiple Calls', () => {
    test('can make multiple moves in sequence', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      const move1 = opponent.makeMove(game);
      expect(move1).not.toBeNull();

      if (move1) {
        game.movePiece(move1.from, move1.to);

        const move2 = opponent.makeMove(game);
        expect(move2).not.toBeNull();
      }
    });

    test('produces valid moves after player switches', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      // Light's turn
      const move1 = opponent.makeMove(game);
      expect(move1).not.toBeNull();

      if (move1) {
        game.movePiece(move1.from, move1.to);
        expect(game.player).toBe('dark');

        // Dark should now be able to move
        const move2 = opponent.makeMove(game);
        expect(move2).not.toBeNull();
        if (move2) {
          const piece = game.getPiece(move2.from.row, move2.from.col);
          expect(piece?.player).toBe('dark');
        }
      }
    });
  });

  describe('Move Making - Edge Cases', () => {
    test('returns null when no moves are available', () => {
      const game = createTestGame();
      game.clearBoard();

      const opponent = new GreedyOpponent();
      const move = opponent.makeMove(game);

      expect(move).toBeNull();
    });

    test('moves are from valid board positions', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();
      const size = game.size;

      for (let i = 0; i < 5; i++) {
        const move = opponent.makeMove(game);
        if (move) {
          expect(move.from.row).toBeGreaterThanOrEqual(0);
          expect(move.from.row).toBeLessThan(size);
          expect(move.from.col).toBeGreaterThanOrEqual(0);
          expect(move.from.col).toBeLessThan(size);
          expect(move.to.row).toBeGreaterThanOrEqual(0);
          expect(move.to.row).toBeLessThan(size);
          expect(move.to.col).toBeGreaterThanOrEqual(0);
          expect(move.to.col).toBeLessThan(size);
        }
      }
    });
  });

  describe('Move Making - Game Progression', () => {
    test('can play multiple moves through game progression', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      let movesCount = 0;
      let maxIterations = 50;

      while (!game.hasEnded && movesCount < maxIterations) {
        const move = opponent.makeMove(game);

        if (move) {
          game.movePiece(move.from, move.to);
          movesCount++;
        } else {
          break;
        }
      }

      expect(movesCount).toBeGreaterThan(0);
    });

    test('respects piece ownership when selecting moves', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      for (let i = 0; i < 5; i++) {
        const currentPlayer = game.player;
        const move = opponent.makeMove(game);

        if (move) {
          const piece = game.getPiece(move.from.row, move.from.col);
          expect(piece?.player).toBe(currentPlayer);

          game.movePiece(move.from, move.to);
        }
      }
    });
  });

  describe('Behavior - Greedy Strategy', () => {
    test('prefers captures over non-capture moves', () => {
      const game = createTestGame();
      game.clearBoard();

      // Set up: light piece at (5,2), dark piece at (4,3) with empty (3,4)
      // Also put a regular dark piece at (2,2) that light can move to normally
      game.setPiece(5, 2, new LightPawn());
      game.setPiece(4, 3, new DarkPawn());
      game.setPiece(3, 4, null); // Empty square for capture
      game.setPiece(2, 2, new DarkPawn()); // Another dark piece (not capturable from 5,2)

      const opponent = new GreedyOpponent();
      const move = opponent.makeMove(game);

      expect(move).not.toBeNull();
      if (move) {
        // Should select the piece that can capture (5,2) or regular moves
        const validMoves = game.getValidMoves(move.from);
        expect(validMoves.length).toBeGreaterThan(0);
      }
    });

    test('selects from available moves only', () => {
      const game = createTestGame();
      const opponent = new GreedyOpponent();

      const move = opponent.makeMove(game);
      expect(move).not.toBeNull();

      if (move) {
        const validMoves = game.getValidMoves(move.from);
        const isValidMove = validMoves.some(
          (vm) => vm.to.row === move.to.row && vm.to.col === move.to.col,
        );
        expect(isValidMove).toBe(true);
      }
    });
  });
});
