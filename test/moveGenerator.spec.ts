import { DamaBoard } from '../src/board/damaBoard.js';
import { DamaMoveGenerator } from '../src/generators/damaMoveGenerator.js';
import { DarkPawn } from '../src/pieces/dama/darkPawn.js';
import { LightKing } from '../src/pieces/dama/lightKing.js';
import { LightPawn } from '../src/pieces/dama/lightPawn.js';
import { MockPieceRenderer } from '../src/utils/mockPieceRenderer.js';

const mockPieceRenderer = new MockPieceRenderer();

describe('CheckersMoveGenerator', () => {
  test('generates pawn forward moves for light pieces', () => {
    const board = new DamaBoard(mockPieceRenderer);
    board.clearBoard();
    board.setPiece(5, 4, new LightPawn());

    const generator = new DamaMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 5, col: 4 });

    expect(moves.length).toBe(2);
    expect(moves.some((m) => m.to.row === 4 && m.to.col === 3)).toBe(true);
    expect(moves.some((m) => m.to.row === 4 && m.to.col === 5)).toBe(true);
  });

  test('generates pawn forward moves for dark pieces', () => {
    const board = new DamaBoard(mockPieceRenderer);
    board.clearBoard();
    board.setPiece(2, 1, new DarkPawn());

    const generator = new DamaMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 2, col: 1 });

    expect(moves.length).toBe(2);
    expect(moves.some((m) => m.to.row === 3 && m.to.col === 0)).toBe(true);
  });

  test('generates king moves in all diagonals', () => {
    const board = new DamaBoard(mockPieceRenderer);
    board.clearBoard();
    const king = new LightKing();
    board.setPiece(5, 4, king);

    const generator = new DamaMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 5, col: 4 });

    expect(moves.length).toBe(11);
  });

  test('detects captures', () => {
    const board = new DamaBoard(mockPieceRenderer);
    board.clearBoard();
    board.setPiece(5, 2, new LightPawn());
    board.setPiece(4, 3, new DarkPawn());

    const generator = new DamaMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 5, col: 2 });

    const captureMove = moves.find((m) => m.captured);
    expect(captureMove).toBeDefined();
    expect(captureMove?.to.row).toBe(3);
    expect(captureMove?.to.col).toBe(4);
  });

  test('returns empty moves for non-existent piece', () => {
    const board = new DamaBoard(mockPieceRenderer);
    board.clearBoard();

    const generator = new DamaMoveGenerator(board);
    const moves = generator.getValidMoves({ row: 3, col: 3 });

    expect(moves.length).toBe(0);
  });
});
