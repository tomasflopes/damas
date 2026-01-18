import { Game } from '../game/game.js';
import { Coord } from '../types.js';
import { Opponent } from './opponent.js';

export class GreedyOpponent implements Opponent {
  name(): string {
    return 'Greedy';
  }

  makeMove(game: Game): { from: Coord; to: Coord } | null {
    const availableMoves: Array<{ from: Coord; to: Coord }> = [];
    const captureMoves: Array<{ from: Coord; to: Coord }> = [];

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const from = { row, col };
        const piece = game.getPiece(row, col);

        if (!piece || piece.player !== game.player) continue;

        const moves = game.getValidMoves(from);
        for (const move of moves) {
          const moveData = { from, to: move.to };
          availableMoves.push(moveData);

          if (move.captured) captureMoves.push(moveData);
        }
      }
    }

    const movesToChooseFrom = captureMoves.length > 0 ? captureMoves : availableMoves;

    if (movesToChooseFrom.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * movesToChooseFrom.length);
    return movesToChooseFrom[randomIndex];
  }
}
