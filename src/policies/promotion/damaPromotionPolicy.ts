import { Piece } from '../../pieces/piece.js';
import { PieceType } from '../../pieces/pieceType.js';
import { PromotionPolicy } from '../../types.js';

export class DamaPromotionPolicy implements PromotionPolicy {
  shouldPromote(piece: Piece, destinationRow: number, boardSize: number): boolean {
    if (piece.type === PieceType.KING) return false;
    if (piece.player === 'light') return destinationRow === 0;

    return destinationRow === boardSize - 1;
  }
}
