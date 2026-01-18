import { Piece, Player } from '../piece.js';
import { PieceType } from '../pieceType.js';

export class LightKing implements Piece {
  constructor(private readonly pieceSquareRatio: number = 0) {}

  readonly player: Player = 'light';
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
      'radial-gradient(circle at 30% 30%, #fff6d5 0 35%, #f2c94c 60%, #d29b2d 100%)';
    // Double border crown effect: outer gold ring + inner darker ring
    token.style.boxShadow =
      'inset 0 0 0 2px #ffd700, inset 0 0 0 4px #8b6914, inset 0 4px 8px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.28)';
  }
}
