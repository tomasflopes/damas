import { DarkKing } from '@/pieces/dama/darkKing';
import { DarkPawn } from '@/pieces/dama/darkPawn';
import { LightPawn } from '@/pieces/dama/lightPawn';
import { PieceType } from '@/pieces/pieceType';

describe('Piece', () => {
  test('creates a piece with player type', () => {
    const piece = new LightPawn();
    expect(piece.player).toBe('light');
    expect(piece.type).toBe(PieceType.PAWN);
  });

  test('creates a king piece', () => {
    const piece = new DarkKing();
    expect(piece.player).toBe('dark');
    expect(piece.type).toBe(PieceType.KING);
  });

  test('promotes a regular piece to king', () => {
    const piece = new LightPawn();
    expect(piece.type).toBe(PieceType.PAWN);
    piece.promote();
    expect(piece.type).toBe(PieceType.KING);
  });

  test('promotion idempotent - promoting twice still a king', () => {
    const piece = new DarkPawn();
    piece.promote();
    piece.promote();
    expect(piece.type).toBe(PieceType.KING);
  });
});
