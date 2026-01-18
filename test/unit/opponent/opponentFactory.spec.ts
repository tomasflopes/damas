import { GreedyOpponent } from '@/opponent/greedyOpponent.js';
import { OpponentFactory } from '@/opponent/opponentFactory.js';
import { RandomMovesOpponent } from '@/opponent/randomMovesOpponent.js';

describe('OpponentFactory', () => {
  describe('getAvailableOpponents', () => {
    test('returns an array of opponent options', () => {
      const opponents = OpponentFactory.getAvailableOpponents();

      expect(Array.isArray(opponents)).toBe(true);
      expect(opponents.length).toBeGreaterThan(0);
    });

    test('each opponent option has required properties', () => {
      const opponents = OpponentFactory.getAvailableOpponents();

      opponents.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('name');
        expect(option).toHaveProperty('opponent');

        expect(typeof option.id).toBe('string');
        expect(typeof option.name).toBe('string');
        expect(option.opponent).not.toBeNull();
        expect(typeof option.opponent).toBe('object');
      });
    });

    test('returns consistent results on multiple calls', () => {
      const opponents1 = OpponentFactory.getAvailableOpponents();
      const opponents2 = OpponentFactory.getAvailableOpponents();

      expect(opponents1.length).toBe(opponents2.length);
      opponents1.forEach((opt1, index) => {
        expect(opt1.id).toBe(opponents2[index].id);
        expect(opt1.name).toBe(opponents2[index].name);
      });
    });

    test('includes RandomMovesOpponent', () => {
      const opponents = OpponentFactory.getAvailableOpponents();
      const randomMovesOpponent = opponents.find((opt) => opt.id === 'random');

      expect(randomMovesOpponent).toBeDefined();
      expect(randomMovesOpponent?.name).toBe('Random Moves');
    });

    test('includes GreedyOpponent', () => {
      const opponents = OpponentFactory.getAvailableOpponents();
      const greedyOpponent = opponents.find((opt) => opt.id === 'greedy');

      expect(greedyOpponent).toBeDefined();
      expect(greedyOpponent?.name).toBe('Greedy (Captures First)');
    });

    test('returns new opponent instances on each call', () => {
      const opponents1 = OpponentFactory.getAvailableOpponents();
      const opponents2 = OpponentFactory.getAvailableOpponents();

      if (opponents1.length > 0 && opponents2.length > 0) {
        expect(opponents1[0].id).toBe(opponents2[0].id);
        expect(opponents1[0].name).toBe(opponents2[0].name);
        expect(opponents1[0].opponent).not.toBe(opponents2[0].opponent);
      }
    });
  });

  describe('getOpponentById', () => {
    test('returns opponent for valid id', () => {
      const opponent = OpponentFactory.getOpponentById('random');

      expect(opponent).toBeDefined();
      expect(opponent instanceof RandomMovesOpponent).toBe(true);
    });

    test('returns greedy opponent for valid id', () => {
      const opponent = OpponentFactory.getOpponentById('greedy');

      expect(opponent).toBeDefined();
      expect(opponent instanceof GreedyOpponent).toBe(true);
    });

    test('returns undefined for invalid id', () => {
      const opponent = OpponentFactory.getOpponentById('non-existent');

      expect(opponent).toBeUndefined();
    });

    test('returned opponent has correct interface', () => {
      const opponent = OpponentFactory.getOpponentById('random');

      expect(opponent).toBeDefined();
      if (opponent) {
        expect(typeof opponent.name).toBe('function');
        expect(typeof opponent.makeMove).toBe('function');

        expect(typeof opponent.name()).toBe('string');
      }
    });

    test('returns different instances on multiple calls', () => {
      const opponent1 = OpponentFactory.getOpponentById('random');
      const opponent2 = OpponentFactory.getOpponentById('random');

      expect(opponent1).toBeDefined();
      expect(opponent2).toBeDefined();
      expect(opponent1).not.toBe(opponent2);
    });

    test('case-insensitive id matching', () => {
      const opponent1 = OpponentFactory.getOpponentById('random');
      const opponent2 = OpponentFactory.getOpponentById('RANDOM');
      const opponent3 = OpponentFactory.getOpponentById('RaNdOm');

      expect(opponent1).toBeDefined();
      expect(opponent2).toBeDefined();
      expect(opponent3).toBeDefined();
    });
  });

  describe('getOpponentNameById', () => {
    test('returns name for valid id', () => {
      const name = OpponentFactory.getOpponentNameById('random');

      expect(name).toBe('Random Moves');
    });

    test('returns undefined for invalid id', () => {
      const name = OpponentFactory.getOpponentNameById('non-existent');

      expect(name).toBeUndefined();
    });

    test('name matches opponent instance name', () => {
      const opponent = OpponentFactory.getOpponentById('random');
      const name = OpponentFactory.getOpponentNameById('random');

      expect(name).toBe(opponent?.name());
    });

    test('returns string name not object', () => {
      const name = OpponentFactory.getOpponentNameById('random');

      expect(typeof name).toBe('string');
      expect(name).not.toBeNull();
    });
  });

  describe('Factory Consistency', () => {
    test('all available opponents are retrievable by id', () => {
      const allOpponents = OpponentFactory.getAvailableOpponents();

      allOpponents.forEach((option) => {
        const opponent = OpponentFactory.getOpponentById(option.id);
        expect(opponent).toBeDefined();
      });
    });

    test('all available opponent names match getOpponentNameById', () => {
      const allOpponents = OpponentFactory.getAvailableOpponents();

      allOpponents.forEach((option) => {
        const name = OpponentFactory.getOpponentNameById(option.id);
        expect(name).toBe(option.name);
      });
    });

    test('ids are unique across available opponents', () => {
      const allOpponents = OpponentFactory.getAvailableOpponents();
      const ids = allOpponents.map((opt) => opt.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    test('names are consistent across available opponents', () => {
      const allOpponents = OpponentFactory.getAvailableOpponents();

      allOpponents.forEach((option) => {
        const opponentName = option.opponent.name();
        expect(opponentName).toBe(option.name);
      });
    });
  });

  describe('Extensibility', () => {
    test('can create new opponent instances through factory', () => {
      const opponent = OpponentFactory.getOpponentById('random');

      expect(opponent).toBeDefined();
      expect(opponent?.name()).toBe('Random Moves');
    });

    test('factory pattern allows for future opponent additions', () => {
      const allOpponents = OpponentFactory.getAvailableOpponents();

      expect(allOpponents.length).toBeGreaterThanOrEqual(1);
    });
  });
});
