import { PieceType } from './pieceType';

export type Player = 'light' | 'dark';

export interface Piece {
  readonly player: Player;
  readonly type: PieceType;

  promote(): void;
}
