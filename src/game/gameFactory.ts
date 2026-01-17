import { Board } from '../board/board.js';
import { DamaBoard } from '../board/damaBoard.js';
import { DamaMoveGenerator } from '../generators/damaMoveGenerator.js';
import { DamaPieceRenderer } from '../pieces/dama/damaPieceRenderer.js';
import { Player } from '../pieces/piece.js';
import { PieceRenderer } from '../pieces/pieceRenderer.js';
import { DamaPromotionPolicy } from '../policies/promotion/damaPromotionPolicy.js';
import { AlternatingTurnPolicy } from '../policies/turn/alternatingTurnPolicy.js';
import { AudioService } from '../services/audio/audioService.js';
import { DamaAudioService } from '../services/audio/damaAudioService.js';
import { DamaMoveService } from '../services/move/damaMoveService.js';
import { MoveGenerator, PromotionPolicy, TurnPolicy } from '../types.js';
import { Game } from './game.js';

export function createGame(options?: {
  board?: Board;
  moveGenerator?: MoveGenerator;
  promotionPolicy?: PromotionPolicy;
  turnPolicy?: TurnPolicy;
  startingPlayer?: Player;
  audioService?: AudioService;
  pieceRenderer?: PieceRenderer;
}): Game {
  const pieceRenderer = options?.pieceRenderer ?? new DamaPieceRenderer(75);
  const board = options?.board ?? new DamaBoard(pieceRenderer);

  const generator = options?.moveGenerator ?? new DamaMoveGenerator(board);
  const promotion = options?.promotionPolicy ?? new DamaPromotionPolicy();
  const moveService = new DamaMoveService(board, generator, promotion, pieceRenderer);
  const audioService = options?.audioService ?? new DamaAudioService();

  const turnPolicy = options?.turnPolicy ?? new AlternatingTurnPolicy();
  const startingPlayer = options?.startingPlayer ?? 'light';

  return new Game(board, moveService, turnPolicy, startingPlayer, audioService);
}
