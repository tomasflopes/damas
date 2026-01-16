import { Piece } from "../piece.js";

describe("Piece", () => {
  test("creates a piece with player type", () => {
    const piece = new Piece("light");
    expect(piece.player).toBe("light");
    expect(piece.isKing).toBe(false);
  });

  test("creates a king piece", () => {
    const piece = new Piece("dark", true);
    expect(piece.player).toBe("dark");
    expect(piece.isKing).toBe(true);
  });

  test("promotes a regular piece to king", () => {
    const piece = new Piece("light");
    expect(piece.isKing).toBe(false);
    piece.promote();
    expect(piece.isKing).toBe(true);
  });

  test("promotion idempotent - promoting twice still a king", () => {
    const piece = new Piece("dark");
    piece.promote();
    piece.promote();
    expect(piece.isKing).toBe(true);
  });
});
