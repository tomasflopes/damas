import { DarkKing } from '../pieces/dama/darkKing.js';
import { DarkPawn } from '../pieces/dama/darkPawn.js';
import { LightKing } from '../pieces/dama/lightKing.js';
import { LightPawn } from '../pieces/dama/lightPawn.js';
import { Piece } from '../pieces/piece.js';
import { PieceRenderer } from '../pieces/pieceRenderer.js';
import { PieceType } from '../pieces/pieceType.js';

export class MockPieceRenderer implements PieceRenderer {
  create(player: 'light' | 'dark', isKing: boolean = false): Piece {
    if (player === 'light') {
      return isKing ? new LightKing(0) : new LightPawn(0);
    }
    return isKing ? new DarkKing(0) : new DarkPawn(0);
  }

  createFromPiece(piece: Piece): Piece {
    return this.create(piece.player, piece.type === PieceType.KING);
  }
}
