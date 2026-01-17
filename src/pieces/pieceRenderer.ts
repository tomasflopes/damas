import { Piece, Player } from './piece.js';

export interface PieceRenderer {
  create(player: Player, isKing?: boolean): Piece;
  createFromPiece(piece: Piece): Piece;
}
