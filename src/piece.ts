export type Player = 'light' | 'dark';

export class Piece {
  readonly player: Player;
  isKing: boolean;

  constructor(player: Player, isKing = false) {
    this.player = player;
    this.isKing = isKing;
  }

  promote() {
    this.isKing = true;
  }
}
