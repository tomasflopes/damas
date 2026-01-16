import { DamaBoard } from '../board.js';
import { DefaultMoveGenerator } from '../generators/moveGenerator.js';
import { Piece } from '../piece.js';

describe('CheckersMoveGenerator', () => {
  test('generates pawn forward moves for light pieces', () => {
    const board = new DamaBoard();
    board.clearBoard();
    board.setPiece(5, 4, new Piece('light'));

    const generator = new DefaultMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 5, col: 4 });

    expect(moves.length).toBe(2);
    expect(moves.some((m) => m.to.row === 4 && m.to.col === 3)).toBe(true);
    expect(moves.some((m) => m.to.row === 4 && m.to.col === 5)).toBe(true);
  });

  test('generates pawn forward moves for dark pieces', () => {
    const board = new DamaBoard();
    board.clearBoard();
    board.setPiece(2, 1, new Piece('dark'));

    const generator = new DefaultMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 2, col: 1 });

    expect(moves.length).toBe(2);
    expect(moves.some((m) => m.to.row === 3 && m.to.col === 0)).toBe(true);
  });

  test('generates king moves in all diagonals', () => {
    const board = new DamaBoard();
    board.clearBoard();
    const king = new Piece('light', true);
    board.setPiece(5, 4, king);

    const generator = new DefaultMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 5, col: 4 });

    expect(moves.length).toBe(11);
  });

  test('detects captures', () => {
    const board = new DamaBoard();
    board.clearBoard();
    board.setPiece(5, 2, new Piece('light'));
    board.setPiece(4, 3, new Piece('dark'));

    const generator = new DefaultMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 5, col: 2 });

    const captureMove = moves.find((m) => m.captured);
    expect(captureMove).toBeDefined();
    expect(captureMove?.to.row).toBe(3);
    expect(captureMove?.to.col).toBe(4);
  });

  test('returns empty moves for non-existent piece', () => {
    const board = new DamaBoard();
    board.clearBoard();

    const generator = new DefaultMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 3, col: 3 });

    expect(moves.length).toBe(0);
  });
});
