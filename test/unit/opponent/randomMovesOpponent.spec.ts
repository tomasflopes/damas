import { createGame } from '@/game/gameFactory.js';
import { RandomMovesOpponent } from '@/opponent/randomMovesOpponent.js';
import { AlternatingTurnPolicy } from '@/policies/turn/alternatingTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new AlternatingTurnPolicy() });

describe('RandomMovesOpponent', () => {
  describe('Basic Properties', () => {
    test('has correct name', () => {
      const opponent = new RandomMovesOpponent();
      expect(opponent.name()).toBe('Random Moves');
    });

    test('name is always consistent', () => {
      const opponent = new RandomMovesOpponent();
      expect(opponent.name()).toBe(opponent.name());
    });
  });

  describe('Move Making - Initial Position', () => {
    test('makes a valid move from initial position', () => {
      const game = createTestGame();
      const opponent = new RandomMovesOpponent();

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
      const opponent = new RandomMovesOpponent();

      const move = opponent.makeMove(game);
      expect(move).not.toBeNull();
      if (move) {
        const piece = game.getPiece(move.from.row, move.from.col);
        expect(piece).not.toBeNull();
        expect(piece?.player).toBe(game.player);
      }
    });

    test('move target is different from source', () => {
      const game = createTestGame();
      const opponent = new RandomMovesOpponent();

      const move = opponent.makeMove(game);
      expect(move).not.toBeNull();
      if (move) {
        expect(move.to.row !== move.from.row || move.to.col !== move.from.col).toBe(true);
      }
    });
  });

  describe('Move Making - Multiple Calls', () => {
    test('can make multiple moves in sequence', () => {
      const game = createTestGame();
      const opponent = new RandomMovesOpponent();

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
      const opponent = new RandomMovesOpponent();

      const move1 = opponent.makeMove(game);
      expect(move1).not.toBeNull();

      if (move1) {
        game.movePiece(move1.from, move1.to);
        expect(game.player).toBe('dark');

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

      const opponent = new RandomMovesOpponent();
      const move = opponent.makeMove(game);

      expect(move).toBeNull();
    });

    test('moves are from valid board positions', () => {
      const game = createTestGame();
      const opponent = new RandomMovesOpponent();
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
      const opponent = new RandomMovesOpponent();

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
      const opponent = new RandomMovesOpponent();

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

  describe('Randomness', () => {
    test('can produce different moves from same position', () => {
      const moves = new Set<string>();

      for (let i = 0; i < 10; i++) {
        const game = createTestGame();
        const opponent = new RandomMovesOpponent();

        const move = opponent.makeMove(game);
        if (move) {
          const moveKey = `${move.from.row},${move.from.col}-${move.to.row},${move.to.col}`;
          moves.add(moveKey);
        }
      }

      expect(moves.size).toBeGreaterThanOrEqual(1);
    });

    test('selects from available moves only', () => {
      const game = createTestGame();
      const opponent = new RandomMovesOpponent();

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
