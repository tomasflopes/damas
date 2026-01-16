import { Piece, Player } from './piece.js';
import { PieceType } from './pieceType.js';

export class DamaPiece implements Piece {
  readonly player: Player;
  type: PieceType;

  constructor(player: Player, isKing = false) {
    this.player = player;
    this.type = isKing ? PieceType.KING : PieceType.PAWN;
  }

  promote() {
    this.type = PieceType.KING;
  }
}
