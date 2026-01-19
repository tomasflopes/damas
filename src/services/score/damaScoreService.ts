import type { Game } from '../../game/game.js';
import type { Player } from '../../pieces/piece.js';
import type { ScoreBreakdown, ScoreService } from './scoreService.js';

export class DamaScoreService implements ScoreService {
  constructor(
    private readonly pawnAdvanceWeight: number = 0.1,
    private readonly kingValue: number = 3,
    private readonly pawnValue: number = 1,
  ) {}

  evaluate(game: Game, player: Player): number {
    if (game.hasEnded) return this.evaluateTerminal(game, player);

    const { light, dark } = this.breakdown(game);
    const self = player === 'light' ? light : dark;
    const opp = player === 'light' ? dark : light;
    return self - opp;
  }

  breakdown(game: Game): ScoreBreakdown {
    let light = 0;
    let dark = 0;

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const piece = game.getPiece(row, col);
        if (!piece) continue;

        const base = piece.type === 'king' ? this.kingValue : this.pawnValue;
        const advanceBonus = this.pawnAdvanceBonus(piece.player, piece.type, row);
        const value = base + advanceBonus;

        if (piece.player === 'light') light += value;
        else dark += value;
      }
    }

    return {
      light,
      dark,
      deltaFor: (perspective: Player) => (perspective === 'light' ? light - dark : dark - light),
    };
  }

  private evaluateTerminal(game: Game, player: Player): number {
    const opponent: Player = player === 'light' ? 'dark' : 'light';

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const piece = game.getPiece(row, col);
        if (piece && piece.player === opponent) return Number.NEGATIVE_INFINITY;
      }
    }

    return Number.POSITIVE_INFINITY;
  }

  private pawnAdvanceBonus(owner: Player, type: string, row: number): number {
    if (type !== 'pawn') return 0;

    return owner === 'light' ? (7 - row) * this.pawnAdvanceWeight : row * this.pawnAdvanceWeight;
  }
}
