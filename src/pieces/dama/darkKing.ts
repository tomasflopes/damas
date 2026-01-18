import { Piece, Player } from '../piece.js';
import { PieceType } from '../pieceType.js';

export class DarkKing implements Piece {
  constructor(private readonly pieceSquareRatio: number = 0) {}

  readonly player: Player = 'dark';
  type: PieceType = PieceType.KING;

  promote() {
    this.type = PieceType.KING;
  }

  render(token: HTMLElement): void {
    token.style.width = `${this.pieceSquareRatio}%`;
    token.style.height = `${this.pieceSquareRatio}%`;
    token.style.borderRadius = '50%';
    token.style.cursor = 'pointer';
    token.style.transition = 'transform 140ms ease, box-shadow 140ms ease';
    token.style.background =
      'radial-gradient(circle at 30% 30%, #d6e2ff 0 35%, #5887ff 60%, #27499c 100%)';
    token.style.boxShadow =
      'inset 0 0 0 2px #ffd700, inset 0 0 0 4px #1a2a5f, inset 0 4px 8px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.28)';
  }
}
