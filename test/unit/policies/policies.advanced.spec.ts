import { DarkKing } from '@/pieces/dama/darkKing.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightKing } from '@/pieces/dama/lightKing.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { AlternatingTurnPolicy } from '@/policies/turn/alternatingTurnPolicy.js';
import { FreeTurnPolicy } from '@/policies/turn/freeTurnPolicy.js';

describe('Turn Policy - FreeTurnPolicy', () => {
  describe('Basic Functionality', () => {
    test('creates free turn policy instance', () => {
      const policy = new FreeTurnPolicy();
      expect(policy).toBeDefined();
    });

    test('allows any player to move any piece', () => {
      const policy = new FreeTurnPolicy();

      expect(policy.canMove()).toBe(true);
    });

    test('allows dark player to move any piece', () => {
      const policy = new FreeTurnPolicy();

      expect(policy.canMove()).toBe(true);
    });

    test('next player stays the same with FreeTurnPolicy', () => {
      const policy = new FreeTurnPolicy();

      const nextAfterLight = policy.next('light');
      expect(nextAfterLight).toBe('light');

      const nextAfterDark = policy.next('dark');
      expect(nextAfterDark).toBe('dark');
    });
  });

  describe('King Pieces', () => {
    test('allows moving light king', () => {
      const policy = new FreeTurnPolicy();

      expect(policy.canMove()).toBe(true);
    });

    test('allows moving dark king', () => {
      const policy = new FreeTurnPolicy();

      expect(policy.canMove()).toBe(true);
    });
  });

  describe('Cyclical Turns', () => {
    test('turns do not cycle with FreeTurnPolicy', () => {
      const policy = new FreeTurnPolicy();
      let currentPlayer: 'light' | 'dark' = 'light';

      const sequence = [];
      for (let i = 0; i < 6; i++) {
        sequence.push(currentPlayer);
        currentPlayer = policy.next(currentPlayer);
      }

      expect(sequence).toEqual(['light', 'light', 'light', 'light', 'light', 'light']);
    });
  });
});
describe('Turn Policy - AlternatingTurnPolicy', () => {
  describe('Basic Functionality', () => {
    test('creates alternating turn policy instance', () => {
      const policy = new AlternatingTurnPolicy();
      expect(policy).toBeDefined();
    });

    test('prevents current player from moving opponent pieces', () => {
      const policy = new AlternatingTurnPolicy();
      const lightPawn = new LightPawn();
      const darkPawn = new DarkPawn();

      expect(policy.canMove(lightPawn, 'light')).toBe(true);
      expect(policy.canMove(darkPawn, 'light')).toBe(false);

      expect(policy.canMove(darkPawn, 'dark')).toBe(true);
      expect(policy.canMove(lightPawn, 'dark')).toBe(false);
    });

    test('next player alternates correctly', () => {
      const policy = new AlternatingTurnPolicy();

      expect(policy.next('light')).toBe('dark');
      expect(policy.next('dark')).toBe('light');
    });
  });

  describe('Piece Ownership Enforcement', () => {
    test('light player cannot move dark pawn', () => {
      const policy = new AlternatingTurnPolicy();
      const darkPawn = new DarkPawn();

      expect(policy.canMove(darkPawn, 'light')).toBe(false);
    });

    test('dark player cannot move light pawn', () => {
      const policy = new AlternatingTurnPolicy();
      const lightPawn = new LightPawn();

      expect(policy.canMove(lightPawn, 'dark')).toBe(false);
    });

    test('light player cannot move dark king', () => {
      const policy = new AlternatingTurnPolicy();
      const darkKing = new DarkKing();

      expect(policy.canMove(darkKing, 'light')).toBe(false);
    });

    test('dark player cannot move light king', () => {
      const policy = new AlternatingTurnPolicy();
      const lightKing = new LightKing();

      expect(policy.canMove(lightKing, 'dark')).toBe(false);
    });
  });

  describe('King Pieces', () => {
    test('light player can move light king', () => {
      const policy = new AlternatingTurnPolicy();
      const king = new LightKing();

      expect(policy.canMove(king, 'light')).toBe(true);
    });

    test('dark player can move dark king', () => {
      const policy = new AlternatingTurnPolicy();
      const king = new DarkKing();

      expect(policy.canMove(king, 'dark')).toBe(true);
    });
  });

  describe('Turn Sequence Validation', () => {
    test('turn sequence alternates strictly', () => {
      const policy = new AlternatingTurnPolicy();
      let currentPlayer: 'light' | 'dark' = 'light';

      const sequence = [];
      for (let i = 0; i < 6; i++) {
        sequence.push(currentPlayer);
        currentPlayer = policy.next(currentPlayer);
      }

      expect(sequence).toEqual(['light', 'dark', 'light', 'dark', 'light', 'dark']);
    });

    test('cannot have two consecutive same player turns', () => {
      const policy = new AlternatingTurnPolicy();
      const nextPlayer = policy.next('light');

      expect(nextPlayer).not.toBe('light');
      expect(policy.next('dark')).not.toBe('dark');
    });
  });
});

describe('Policy Comparison', () => {
  test('FreeTurnPolicy allows moves without restriction', () => {
    const freePolicy = new FreeTurnPolicy();

    expect(freePolicy.canMove()).toBe(true);
  });

  test('both policies have different next behavior', () => {
    const freePolicy = new FreeTurnPolicy();
    const altPolicy = new AlternatingTurnPolicy();

    expect(freePolicy.next('light')).toBe('light');

    expect(altPolicy.next('light')).toBe('dark');
  });
});

describe('Turn Policy Edge Cases', () => {
  describe('Multiple Promotions', () => {
    test('promoted pawn respects turn policy', () => {
      const policy = new AlternatingTurnPolicy();
      const pawn = new LightPawn();

      expect(policy.canMove(pawn, 'light')).toBe(true);
      pawn.promote();
      expect(policy.canMove(pawn, 'light')).toBe(true);
      expect(policy.canMove(pawn, 'dark')).toBe(false);
    });
  });

  describe('Boundary Cases', () => {
    test('handles alternation at piece boundaries', () => {
      const policy = new AlternatingTurnPolicy();
      const pieces = [new LightPawn(), new LightKing(), new DarkPawn(), new DarkKing()];

      for (const piece of [pieces[0], pieces[1]]) {
        expect(policy.canMove(piece, 'light')).toBe(true);
      }

      for (const piece of [pieces[2], pieces[3]]) {
        expect(policy.canMove(piece, 'light')).toBe(false);
      }
    });
  });
});
