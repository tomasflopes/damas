import { createGame } from "../game/gameFactory.js";
import { FreeTurnPolicy } from "../policies/turn/freeTurnPolicy.js";

const createTestGame = () => createGame({ turnPolicy: new FreeTurnPolicy() });

describe("Game - Capture", () => {
  test("light piece can capture dark piece", () => {
    const game = createTestGame();
    game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });

    const game2 = createTestGame();
    game2.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
    game2.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });

    const result = game2.movePiece({ row: 4, col: 3 }, { row: 2, col: 1 });
    expect(result).toBe(true);
    expect(game2.getPiece(2, 1)?.player).toBe("light");
    expect(game2.getPiece(3, 2)).toBeNull();
    expect(game2.getPiece(4, 3)).toBeNull();
  });

  test("dark piece can capture light piece", () => {
    const game = createTestGame();
    game.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
    game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    game.movePiece({ row: 3, col: 0 }, { row: 4, col: 1 });

    const game2 = createTestGame();
    game2.movePiece({ row: 2, col: 3 }, { row: 3, col: 2 });
    game2.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });

    const result = game2.movePiece({ row: 3, col: 2 }, { row: 5, col: 0 });
    expect(result).toBe(true);
    expect(game2.getPiece(5, 0)?.player).toBe("dark");
    expect(game2.getPiece(4, 1)).toBeNull();
  });

  test("cannot capture own piece", () => {
    const game = createTestGame();
    game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    game.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
    game.movePiece({ row: 4, col: 3 }, { row: 3, col: 2 });

    const result = game.movePiece({ row: 4, col: 1 }, { row: 2, col: 3 });
    expect(result).toBe(false);
  });

  test("cannot capture if landing square is occupied", () => {
    const game = createTestGame();
    game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    game.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });
    game.movePiece({ row: 5, col: 2 }, { row: 2, col: 3 });

    const validMoves = game.getValidMoves({ row: 4, col: 1 });
    const captureMove = validMoves.find((m) => m.captured);
    expect(captureMove).toBeUndefined();
  });
});
