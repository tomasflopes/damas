import { DarkKing } from '@/pieces/dama/darkKing.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightKing } from '@/pieces/dama/lightKing.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { PieceType } from '@/pieces/pieceType.js';

describe('Piece Types - Pawns', () => {
  describe('LightPawn', () => {
    test('creates a light pawn with correct properties', () => {
      const piece = new LightPawn();
      expect(piece.player).toBe('light');
      expect(piece.type).toBe(PieceType.PAWN);
    });

    test('light pawn can be promoted to king', () => {
      const piece = new LightPawn();
      expect(piece.type).toBe(PieceType.PAWN);
      piece.promote();
      expect(piece.type).toBe(PieceType.KING);
    });

    test('light pawn promoted status is idempotent', () => {
      const piece = new LightPawn();
      piece.promote();
      const firstType = piece.type;
      piece.promote();
      expect(piece.type).toBe(firstType);
    });

    test('light pawn accepts optional id', () => {
      const piece = new LightPawn(42);
      expect(piece.player).toBe('light');
    });
  });

  describe('DarkPawn', () => {
    test('creates a dark pawn with correct properties', () => {
      const piece = new DarkPawn();
      expect(piece.player).toBe('dark');
      expect(piece.type).toBe(PieceType.PAWN);
    });

    test('dark pawn can be promoted to king', () => {
      const piece = new DarkPawn();
      piece.promote();
      expect(piece.type).toBe(PieceType.KING);
    });

    test('dark pawn accepts optional id', () => {
      const piece = new DarkPawn(123);
      expect(piece.player).toBe('dark');
    });
  });
});

describe('Piece Types - Kings', () => {
  describe('LightKing', () => {
    test('creates a light king with correct properties', () => {
      const piece = new LightKing();
      expect(piece.player).toBe('light');
      expect(piece.type).toBe(PieceType.KING);
    });

    test('light king starts as king type', () => {
      const piece = new LightKing();
      expect(piece.type).toBe(PieceType.KING);
    });

    test('light king promotion has no effect', () => {
      const piece = new LightKing();
      const typeBefore = piece.type;
      piece.promote();
      expect(piece.type).toBe(typeBefore);
    });

    test('light king accepts optional id', () => {
      const piece = new LightKing(99);
      expect(piece.player).toBe('light');
      expect(piece.type).toBe(PieceType.KING);
    });
  });

  describe('DarkKing', () => {
    test('creates a dark king with correct properties', () => {
      const piece = new DarkKing();
      expect(piece.player).toBe('dark');
      expect(piece.type).toBe(PieceType.KING);
    });

    test('dark king starts as king type', () => {
      const piece = new DarkKing();
      expect(piece.type).toBe(PieceType.KING);
    });

    test('dark king promotion has no effect', () => {
      const piece = new DarkKing();
      const typeBefore = piece.type;
      piece.promote();
      expect(piece.type).toBe(typeBefore);
    });

    test('dark king accepts optional id', () => {
      const piece = new DarkKing(55);
      expect(piece.player).toBe('dark');
    });
  });
});

describe('Piece Comparison', () => {
  test('light and dark pawns are different players', () => {
    const lightPawn = new LightPawn();
    const darkPawn = new DarkPawn();
    expect(lightPawn.player).not.toBe(darkPawn.player);
  });

  test('pawn and king types are different', () => {
    const pawn = new LightPawn();
    const king = new LightKing();
    expect(pawn.type).not.toBe(king.type);
  });

  test('promoted pawn becomes king type', () => {
    const pawn = new LightPawn();
    const king = new LightKing();
    pawn.promote();
    expect(pawn.type).toBe(king.type);
  });

  test('promoted pawn and king have same player', () => {
    const pawn = new LightPawn();
    const king = new LightKing();
    pawn.promote();
    expect(pawn.player).toBe(king.player);
  });
});

describe('Piece Type Enum', () => {
  test('PieceType enum has PAWN value', () => {
    expect(PieceType.PAWN).toBeDefined();
  });

  test('PieceType enum has KING value', () => {
    expect(PieceType.KING).toBeDefined();
  });

  test('PAWN and KING are different values', () => {
    expect(PieceType.PAWN).not.toBe(PieceType.KING);
  });
});
