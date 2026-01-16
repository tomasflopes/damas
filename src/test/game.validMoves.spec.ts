import { createGame } from "../game/gameFactory.js";
import { Piece } from "../piece.js";
import { FreeTurnPolicy } from "../policies/turn/freeTurnPolicy.js";

const createTestGame = () => createGame({ turnPolicy: new FreeTurnPolicy() });

describe("Game - Valid Moves", () => {
  test("getValidMoves returns correct moves for light piece", () => {
    const game = createTestGame();
    const moves = game.getValidMoves({ row: 5, col: 0 });

    expect(moves.length).toBeGreaterThan(0);
    expect(moves.some((m) => m.to.row === 4 && m.to.col === 1)).toBe(true);
  });

  test("getValidMoves returns empty for empty square", () => {
    const game = createTestGame();
    const moves = game.getValidMoves({ row: 4, col: 1 });
    expect(moves.length).toBe(0);
  });

  test("getValidMoves includes capture when available", () => {
    const game = createTestGame();
    game.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
    game.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 });

    const moves = game.getValidMoves({ row: 4, col: 3 });
    const captureMove = moves.find((m) => m.captured);

    expect(captureMove).toBeDefined();
    expect(captureMove?.to.row).toBe(2);
    expect(captureMove?.to.col).toBe(1);
    expect(captureMove?.captured?.row).toBe(3);
    expect(captureMove?.captured?.col).toBe(2);
  });

  test("piece blocked by friendly piece has no moves", () => {
    const game = createTestGame();
    game.movePiece({ row: 5, col: 2 }, { row: 4, col: 1 });

    const moves = game.getValidMoves({ row: 5, col: 0 });
    expect(moves.length).toBe(0);
  });

  test("king has correct valid moves", () => {
    const game = createTestGame();
    game.clearBoard();
    const king = new Piece("dark", true);
    game.setPiece(4, 3, king);

    const moves = game.getValidMoves({ row: 4, col: 3 });
    expect(moves.length).toBe(13);
    expect(moves.some((m) => m.to.row === 3 && m.to.col === 2)).toBe(true);
    expect(moves.some((m) => m.to.row === 5 && m.to.col === 4)).toBe(true);
    expect(moves.some((m) => m.to.row === 1 && m.to.col === 0)).toBe(true);
    expect(moves.some((m) => m.to.row === 7 && m.to.col === 6)).toBe(true);
  });

  test("king capture move is detected", () => {
    const game = createTestGame();
    game.clearBoard();
    const king = new Piece("light", true);
    game.setPiece(4, 3, king);
    game.setPiece(2, 1, new Piece("dark"));

    const moves = game.getValidMoves({ row: 4, col: 3 });
    const captureMove = moves.find((m) => m.captured);
    expect(captureMove).toBeDefined();
    expect(captureMove?.to.row).toBe(1);
    expect(captureMove?.to.col).toBe(0);
    expect(captureMove?.captured?.row).toBe(2);
    expect(captureMove?.captured?.col).toBe(1);
  });

  test("king should not be able to jump over multiple pieces", () => {
    const game = createTestGame();
    game.clearBoard();
    const king = new Piece("dark", true);
    game.setPiece(4, 3, king);
    game.setPiece(3, 2, new Piece("light"));
    game.setPiece(2, 1, new Piece("light"));

    const moves = game.getValidMoves({ row: 4, col: 3 });
    const invalidCaptureMove = moves.find(
      (m) => m.captured && m.to.row === 1 && m.to.col === 0
    );
    expect(invalidCaptureMove).toBeUndefined();
  });
});
