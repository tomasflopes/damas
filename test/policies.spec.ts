import { DamaPiece } from '../src/pieces/damaPiece.js';
import { DamaPromotionPolicy } from '../src/policies/promotion/damaPromotionPolicy.js';
import { AlternatingTurnPolicy } from '../src/policies/turn/alternatingTurnPolicy.js';
import { FreeTurnPolicy } from '../src/policies/turn/freeTurnPolicy.js';

describe('DefaultPromotionPolicy', () => {
  test('promotes light piece at row 0', () => {
    const policy = new DamaPromotionPolicy();
    const piece = new DamaPiece('light');
    expect(policy.shouldPromote(piece, 0, 8)).toBe(true);
  });

  test('promotes dark piece at row 7', () => {
    const policy = new DamaPromotionPolicy();
    const piece = new DamaPiece('dark');
    expect(policy.shouldPromote(piece, 7, 8)).toBe(true);
  });

  test('does not promote king pieces', () => {
    const policy = new DamaPromotionPolicy();
    const piece = new DamaPiece('light', true);
    expect(policy.shouldPromote(piece, 0, 8)).toBe(false);
  });

  test('does not promote before destination row', () => {
    const policy = new DamaPromotionPolicy();
    const piece = new DamaPiece('light');
    expect(policy.shouldPromote(piece, 5, 8)).toBe(false);
  });
});

describe('AlternatingTurnPolicy', () => {
  test('allows light pieces to move when light is current', () => {
    const policy = new AlternatingTurnPolicy();
    const piece = new DamaPiece('light');
    expect(policy.canMove(piece, 'light')).toBe(true);
  });

  test('prevents light pieces from moving when dark is current', () => {
    const policy = new AlternatingTurnPolicy();
    const piece = new DamaPiece('light');
    expect(policy.canMove(piece, 'dark')).toBe(false);
  });

  test('alternates turn between players', () => {
    const policy = new AlternatingTurnPolicy();
    expect(policy.next('light')).toBe('dark');
    expect(policy.next('dark')).toBe('light');
  });
});

describe('FreeTurnPolicy', () => {
  test('allows any piece to move', () => {
    const policy = new FreeTurnPolicy();
    expect(policy.canMove()).toBe(true);
  });

  test('does not change turn', () => {
    const policy = new FreeTurnPolicy();
    expect(policy.next('light')).toBe('light');
    expect(policy.next('dark')).toBe('dark');
  });
});
