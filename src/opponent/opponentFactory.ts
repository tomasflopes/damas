import { GreedyOpponent } from './greedyOpponent.js';
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
    ];
  }

  static getOpponentById(id: string): Opponent | undefined {
    const lowerCaseId = id.toLowerCase();
    if (lowerCaseId !== 'random' && lowerCaseId !== 'greedy') return undefined;

    return this.createOpponentInstance(lowerCaseId);
  }

  static getOpponentNameById(id: string): string | undefined {
    const lowerCaseId = id.toLowerCase();
    if (lowerCaseId === 'random') return new RandomMovesOpponent().name();
    if (lowerCaseId === 'greedy') return new GreedyOpponent().name();

    return undefined;
  }

  private static createOpponentInstance(id: string): Opponent {
    if (id === 'random') return new RandomMovesOpponent();
    if (id === 'greedy') return new GreedyOpponent();

    throw new Error(`Unknown opponent id: ${id}`);
  }
}
