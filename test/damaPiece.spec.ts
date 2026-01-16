import { DamaPiece } from '../src/pieces/damaPiece';
import { PieceType } from '../src/pieces/pieceType';

describe('Piece', () => {
  test('creates a piece with player type', () => {
    const piece = new DamaPiece('light');
    expect(piece.player).toBe('light');
    expect(piece.type).toBe(PieceType.PAWN);
  });

  test('creates a king piece', () => {
    const piece = new DamaPiece('dark', true);
    expect(piece.player).toBe('dark');
    expect(piece.type).toBe(PieceType.KING);
  });

  test('promotes a regular piece to king', () => {
    const piece = new DamaPiece('light');
    expect(piece.type).toBe(PieceType.PAWN);
    piece.promote();
    expect(piece.type).toBe(PieceType.KING);
  });

  test('promotion idempotent - promoting twice still a king', () => {
    const piece = new DamaPiece('dark');
    piece.promote();
    piece.promote();
    expect(piece.type).toBe(PieceType.KING);
  });
});
