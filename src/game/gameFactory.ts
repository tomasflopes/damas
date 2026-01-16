import { Board } from '../board/board.js';
import { DamaBoard } from '../board/damaBoard.js';
import { DamaMoveGenerator } from '../generators/damaMoveGenerator.js';
import { Player } from '../pieces/piece.js';
import { DamaPromotionPolicy } from '../policies/promotion/damaPromotionPolicy.js';
import { AlternatingTurnPolicy } from '../policies/turn/alternatingTurnPolicy.js';
import { AudioService } from '../services/audio/audioService.js';
import { DamaAudioService } from '../services/audio/damaAudioService.js';
import { DamaMoveService } from '../services/damaMoveService.js';
import { MoveGenerator, PromotionPolicy, TurnPolicy } from '../types.js';
import { Game } from './game.js';

export function createGame(options?: {
  board?: Board;
  moveGenerator?: MoveGenerator;
  promotionPolicy?: PromotionPolicy;
  turnPolicy?: TurnPolicy;
  startingPlayer?: Player;
  audioService?: AudioService;
}): Game {
  const board = options?.board ?? new DamaBoard();

  const generator = options?.moveGenerator ?? new DamaMoveGenerator(board);
  const promotion = options?.promotionPolicy ?? new DamaPromotionPolicy();
  const moveService = new DamaMoveService(board, generator, promotion);
  const audioService = options?.audioService ?? new DamaAudioService();

  const turnPolicy = options?.turnPolicy ?? new AlternatingTurnPolicy();
  const startingPlayer = options?.startingPlayer ?? 'light';

  return new Game(board, moveService, turnPolicy, startingPlayer, audioService);
}
