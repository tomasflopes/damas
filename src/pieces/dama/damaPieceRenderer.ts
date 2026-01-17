import { Piece, Player } from '../piece.js';
import { PieceRenderer } from '../pieceRenderer.js';
import { PieceType } from '../pieceType.js';
import { DarkKing } from './darkKing.js';
import { DarkPawn } from './darkPawn.js';
import { LightKing } from './lightKing.js';
import { LightPawn } from './lightPawn.js';

export class DamaPieceRenderer implements PieceRenderer {
  constructor(private readonly pieceSize: number) {}

  create(player: Player, isKing: boolean = false): Piece {
    if (player === 'light')
      return isKing ? new LightKing(this.pieceSize) : new LightPawn(this.pieceSize);

    return isKing ? new DarkKing(this.pieceSize) : new DarkPawn(this.pieceSize);
  }

  createFromPiece(piece: Piece): Piece {
    return this.create(piece.player, piece.type === PieceType.KING);
  }
}
