import { GreedyOpponent } from './greedyOpponent.js';
import { MinimaxOpponent } from './minimaxOpponent.js';
import { Opponent } from './opponent.js';
import { RandomMovesOpponent } from './randomMovesOpponent.js';

export interface OpponentOption {
  id: string;
  name: string;
  opponent: Opponent;
}

export class OpponentFactory {
  static getAvailableOpponents(): OpponentOption[] {
    return [
      {
        id: 'random',
        name: this.getOpponentNameById('random')!,
        opponent: this.createOpponentInstance('random'),
      },
      {
        id: 'greedy',
        name: this.getOpponentNameById('greedy')!,
        opponent: this.createOpponentInstance('greedy'),
      },
      {
        id: 'minimax',
        name: this.getOpponentNameById('minimax')!,
        opponent: this.createOpponentInstance('minimax'),
      },
    ];
  }

  static getOpponentById(id: string): Opponent | undefined {
    const lowerCaseId = id.toLowerCase();
    if (lowerCaseId !== 'random' && lowerCaseId !== 'greedy' && lowerCaseId !== 'minimax')
      return undefined;

    return this.createOpponentInstance(lowerCaseId);
  }

  static getOpponentNameById(id: string): string | undefined {
    const lowerCaseId = id.toLowerCase();
    if (lowerCaseId === 'random') return new RandomMovesOpponent().name();
    if (lowerCaseId === 'greedy') return new GreedyOpponent().name();
    if (lowerCaseId === 'minimax') return new MinimaxOpponent().name();

    return undefined;
  }

  private static createOpponentInstance(id: string): Opponent {
    if (id === 'random') return new RandomMovesOpponent();
    if (id === 'greedy') return new GreedyOpponent();
    if (id === 'minimax') return new MinimaxOpponent();

    throw new Error(`Unknown opponent id: ${id}`);
  }
}
