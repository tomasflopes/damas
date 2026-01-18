import { Game } from '../game/game.js';
import { Coord } from '../types.js';
import { Opponent } from './opponent.js';

export class RandomMovesOpponent implements Opponent {
  name(): string {
    return 'Random Moves';
  }

  makeMove(game: Game): { from: Coord; to: Coord } | null {
    const availableMoves: Array<{ from: Coord; to: Coord }> = [];

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const from = { row, col };
        const piece = game.getPiece(row, col);

        if (!piece || piece.player !== game.player) continue;

        const moves = game.getValidMoves(from);
        for (const move of moves) {
          availableMoves.push({ from, to: move.to });
        }
      }
    }

    if (availableMoves.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }
}
