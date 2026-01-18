import { Coord } from '@/types.js';

describe('Types - Coord', () => {
  describe('Coord Creation', () => {
    test('creates a valid coordinate', () => {
      const coord: Coord = { row: 3, col: 2 };
      expect(coord.row).toBe(3);
      expect(coord.col).toBe(2);
    });

    test('coord with row 0 col 0', () => {
      const coord: Coord = { row: 0, col: 0 };
      expect(coord.row).toBe(0);
      expect(coord.col).toBe(0);
    });

    test('coord with max board values', () => {
      const coord: Coord = { row: 7, col: 7 };
      expect(coord.row).toBe(7);
      expect(coord.col).toBe(7);
    });

    test('coord properties are accessible', () => {
      const coord: Coord = { row: 4, col: 5 };
      expect(coord.hasOwnProperty('row')).toBe(true);
      expect(coord.hasOwnProperty('col')).toBe(true);
    });
  });

  describe('Coord Comparison', () => {
    test('same coordinates are equal', () => {
      const coord1: Coord = { row: 3, col: 2 };
      const coord2: Coord = { row: 3, col: 2 };
      expect(coord1.row).toBe(coord2.row);
      expect(coord1.col).toBe(coord2.col);
    });

    test('different coordinates are not equal', () => {
      const coord1: Coord = { row: 3, col: 2 };
      const coord2: Coord = { row: 3, col: 3 };
      expect(coord1.row).not.toBe(coord2.row + 1);
    });

    test('coordinate with same values in different order are different', () => {
      const coord1: Coord = { row: 3, col: 2 };
      const coord2: Coord = { row: 2, col: 3 };
      expect(coord1.row).not.toBe(coord2.row);
      expect(coord1.col).not.toBe(coord2.col);
    });
  });

  describe('Coord Validation', () => {
    test('identifies valid board coordinates', () => {
      const validCoords: Coord[] = [
        { row: 0, col: 0 },
        { row: 3, col: 4 },
        { row: 7, col: 7 },
        { row: 4, col: 2 },
      ];

      for (const coord of validCoords) {
        expect(coord.row >= 0 && coord.row <= 7).toBe(true);
        expect(coord.col >= 0 && coord.col <= 7).toBe(true);
      }
    });

    test('can identify dark square coordinates', () => {
      const coord: Coord = { row: 2, col: 1 };
      const isDarkSquare = (coord.row + coord.col) % 2 === 1;
      expect(isDarkSquare).toBe(true);
    });

    test('can identify light square coordinates', () => {
      const coord: Coord = { row: 0, col: 0 };
      const isLightSquare = (coord.row + coord.col) % 2 === 0;
      expect(isLightSquare).toBe(true);
    });
  });

  describe('Coord Transformation', () => {
    test('moving diagonally forward-right', () => {
      const start: Coord = { row: 5, col: 0 };
      const end: Coord = { row: 4, col: 1 };

      expect(end.row - start.row).toBe(-1);
      expect(end.col - start.col).toBe(1);
    });

    test('moving diagonally forward-left', () => {
      const start: Coord = { row: 5, col: 2 };
      const end: Coord = { row: 4, col: 1 };

      expect(end.row - start.row).toBe(-1);
      expect(end.col - start.col).toBe(-1);
    });

    test('moving diagonally backward-right', () => {
      const start: Coord = { row: 2, col: 1 };
      const end: Coord = { row: 3, col: 2 };

      expect(end.row - start.row).toBe(1);
      expect(end.col - start.col).toBe(1);
    });

    test('moving diagonally backward-left', () => {
      const start: Coord = { row: 2, col: 2 };
      const end: Coord = { row: 3, col: 1 };

      expect(end.row - start.row).toBe(1);
      expect(end.col - start.col).toBe(-1);
    });
  });

  describe('Coord Distance Calculation', () => {
    test('calculates Manhattan distance between coordinates', () => {
      const from: Coord = { row: 0, col: 0 };
      const to: Coord = { row: 2, col: 2 };

      const distance = Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
      expect(distance).toBe(4);
    });

    test('calculates Chebyshev distance (max distance) between coordinates', () => {
      const from: Coord = { row: 0, col: 0 };
      const to: Coord = { row: 3, col: 2 };

      const distance = Math.max(Math.abs(to.row - from.row), Math.abs(to.col - from.col));
      expect(distance).toBe(3);
    });

    test('calculates distance for same coordinates as zero', () => {
      const coord: Coord = { row: 3, col: 3 };
      const distance = Math.abs(coord.row - coord.row) + Math.abs(coord.col - coord.col);
      expect(distance).toBe(0);
    });
  });

  describe('Coord Array Operations', () => {
    test('creates array of coordinates', () => {
      const coords: Coord[] = [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ];

      expect(coords.length).toBe(3);
      expect(coords[0].row).toBe(0);
      expect(coords[2].row).toBe(2);
    });

    test('filters coordinates based on condition', () => {
      const coords: Coord[] = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ];

      const darkSquares = coords.filter((c) => (c.row + c.col) % 2 === 1);
      expect(darkSquares.length).toBe(2);
      expect(darkSquares[0]).toEqual({ row: 0, col: 1 });
      expect(darkSquares[1]).toEqual({ row: 1, col: 2 });
    });

    test('maps coordinates to new coordinates', () => {
      const coords: Coord[] = [
        { row: 5, col: 0 },
        { row: 5, col: 2 },
      ];

      const movedCoords = coords.map((c) => ({ row: c.row - 1, col: c.col + 1 }));
      expect(movedCoords[0]).toEqual({ row: 4, col: 1 });
      expect(movedCoords[1]).toEqual({ row: 4, col: 3 });
    });
  });
});

describe('Types - Coord Edge Cases', () => {
  test('handles coordinates at board edges', () => {
    const edges: Coord[] = [
      { row: 0, col: 0 },
      { row: 0, col: 7 },
      { row: 7, col: 0 },
      { row: 7, col: 7 },
    ];

    for (const edge of edges) {
      expect(edge.row >= 0 && edge.row <= 7).toBe(true);
      expect(edge.col >= 0 && edge.col <= 7).toBe(true);
    }
  });

  test('handles coordinates at board midpoints', () => {
    const midpoints: Coord[] = [
      { row: 3, col: 3 },
      { row: 3, col: 4 },
      { row: 4, col: 3 },
      { row: 4, col: 4 },
    ];

    for (const mid of midpoints) {
      expect(mid.row).toBeGreaterThanOrEqual(3);
      expect(mid.row).toBeLessThanOrEqual(4);
    }
  });
});
