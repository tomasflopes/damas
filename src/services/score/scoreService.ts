import type { Game } from '../../game/game.js';
import type { Player } from '../../pieces/piece.js';

export interface ScoreBreakdown {
  light: number;
  dark: number;
  deltaFor(perspective: Player): number;
}

export interface ScoreService {
  /**
   * Returns a signed score from the perspective of `player`.
   * Positive favors `player`, negative favors the opponent.
   * Non-terminal games return finite scores; terminal games may return +/-Infinity.
   */
  evaluate(game: Game, player: Player): number;

  /**
   * Returns an absolute breakdown for UI/visualization (e.g., side bars).
   */
  breakdown(game: Game): ScoreBreakdown;
}
