import { Opponent } from './opponent.js';
import { RandomMovesOpponent } from './randomMovesOpponent.js';

export interface OpponentOption {
  id: string;
  name: string;
  opponent: Opponent;
}

export class OpponentFactory {
  private static readonly opponents: OpponentOption[] = [
    {
      id: 'random',
      name: 'Random Moves',
      opponent: new RandomMovesOpponent(),
    },
  ];

  static getAvailableOpponents(): OpponentOption[] {
    return this.opponents.map((opt) => ({
      id: opt.id,
      name: opt.name,
      opponent: new RandomMovesOpponent(),
    }));
  }

  static getOpponentById(id: string): Opponent | undefined {
    const option = this.opponents.find((opt) => opt.id.toLowerCase() === id.toLowerCase());
    if (!option) return undefined;

    if (option.id === 'random') {
      return new RandomMovesOpponent();
    }

    return undefined;
  }

  static getOpponentNameById(id: string): string | undefined {
    return this.opponents.find((opt) => opt.id.toLowerCase() === id.toLowerCase())?.name;
  }
}
