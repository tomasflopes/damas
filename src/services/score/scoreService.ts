import type { Game } from '../../game/game.js';
import type { Player } from '../../pieces/piece.js';

export interface ScoreBreakdown {
  light: number;
  dark: number;
  deltaFor(perspective: Player): number;
}

export interface ScoreService {
  evaluate(game: Game, player: Player): number;
  breakdown(game: Game): ScoreBreakdown;
}
