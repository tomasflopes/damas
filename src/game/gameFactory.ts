import { DamaBoard } from '../board.js';
import { DamaMoveGenerator } from '../generators/damaMoveGenerator.js';
import { Player } from '../pieces/damaPiece.js';
import { DamaPromotionPolicy } from '../policies/promotion/damaPromotionPolicy.js';
import { AlternatingTurnPolicy } from '../policies/turn/alternatingTurnPolicy.js';
import { MoveService } from '../services/moveService.js';
import { MoveGenerator, PromotionPolicy, TurnPolicy } from '../types.js';
import { Game } from './game.js';

export function createGame(options?: {
  board?: DamaBoard;
  moveGenerator?: MoveGenerator;
  promotionPolicy?: PromotionPolicy;
  turnPolicy?: TurnPolicy;
  startingPlayer?: Player;
}): Game {
  const board = options?.board ?? new DamaBoard();

  const generator = options?.moveGenerator ?? new DamaMoveGenerator(board);
  const promotion = options?.promotionPolicy ?? new DamaPromotionPolicy();
  const moveService = new MoveService(board, generator, promotion);

  const turnPolicy = options?.turnPolicy ?? new AlternatingTurnPolicy();
  const startingPlayer = options?.startingPlayer ?? 'light';

  return new Game(board, moveService, turnPolicy, startingPlayer);
}
