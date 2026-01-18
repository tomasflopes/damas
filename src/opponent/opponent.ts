import { Game } from '../game/game.js';
import { Coord } from '../types.js';

export interface Opponent {
  name(): string;
  makeMove(game: Game): { from: Coord; to: Coord } | null;
}
