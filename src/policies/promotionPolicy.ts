import { Piece } from '../piece.js';
import { PromotionPolicy } from '../types.js';

export class DefaultPromotionPolicy implements PromotionPolicy {
  shouldPromote(piece: Piece, destinationRow: number, boardSize: number): boolean {
    if (piece.isKing) return false;
    if (piece.player === 'light') return destinationRow === 0;

    return destinationRow === boardSize - 1;
  }
}
