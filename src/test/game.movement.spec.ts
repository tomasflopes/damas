import { createGame } from "../game/gameFactory.js";
import { FreeTurnPolicy } from "../policies/turn/freeTurnPolicy.js";

const createTestGame = () => createGame({ turnPolicy: new FreeTurnPolicy() });

describe("Game - Movement", () => {
  test("light piece can move diagonally forward-left on dark square", () => {
    const game = createTestGame();
    const result = game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    expect(result).toBe(true);
    expect(game.getPiece(4, 1)?.player).toBe("light");
    expect(game.getPiece(5, 0)).toBeNull();
  });

  test("light piece can move diagonally forward-right on dark square", () => {
    const game = createTestGame();
    const result = game.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
    expect(result).toBe(true);
    expect(game.getPiece(4, 3)?.player).toBe("light");
    expect(game.getPiece(5, 2)).toBeNull();
  });

  test("dark piece can move diagonally forward-left on dark square", () => {
    const game = createTestGame();
    const result = game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
    expect(result).toBe(true);
    expect(game.getPiece(3, 0)?.player).toBe("dark");
    expect(game.getPiece(2, 1)).toBeNull();
  });

  test("dark piece can move diagonally forward-right on dark square", () => {
    const game = createTestGame();
    const result = game.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });
    expect(result).toBe(true);
    expect(game.getPiece(3, 2)?.player).toBe("dark");
    expect(game.getPiece(2, 1)).toBeNull();
  });

  test("piece cannot move backwards (non-king)", () => {
    const game = createTestGame();
    game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    const result = game.movePiece({ row: 4, col: 1 }, { row: 5, col: 0 });
    expect(result).toBe(false);
  });

  test("piece cannot move to light square", () => {
    const game = createTestGame();
    const result = game.movePiece({ row: 5, col: 0 }, { row: 4, col: 0 });
    expect(result).toBe(false);
  });

  test("piece cannot move to occupied square", () => {
    const game = createTestGame();
    game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
    const result = game.movePiece({ row: 4, col: 1 }, { row: 3, col: 0 });
    expect(result).toBe(false);
  });

  test("cannot move from empty square", () => {
    const game = createTestGame();
    const result = game.movePiece({ row: 4, col: 1 }, { row: 3, col: 0 });
    expect(result).toBe(false);
  });

  test("cannot move out of bounds", () => {
    const game = createTestGame();
    const result = game.movePiece({ row: 5, col: 0 }, { row: -1, col: -1 });
    expect(result).toBe(false);
  });
});
