import { Piece } from './piece';
import { PieceType } from './pieceType';

export type Player = 'light' | 'dark';

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
