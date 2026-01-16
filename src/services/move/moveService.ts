import { Coord, MoveOption, MoveResult } from '../../types.js';

export interface MoveService {
  getValidMoves(from: Coord): MoveOption[];
  move(from: Coord, to: Coord): MoveResult;
}
