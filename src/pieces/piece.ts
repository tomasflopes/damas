import { PieceType } from './pieceType.js';

export type Player = 'light' | 'dark';

export interface Piece {
  readonly player: Player;
  readonly type: PieceType;

  promote(): void;
  render(token: HTMLElement): void;
}
