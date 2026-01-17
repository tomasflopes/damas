import { Board } from '../board/board.js';
import { Piece, Player } from '../pieces/piece.js';
import { AudioService } from '../services/audio/audioService.js';
import { MoveService } from '../services/move/moveService.js';
import { Coord, MoveOption, TurnPolicy } from '../types.js';

export class Game {
  private currentPlayer: Player;
  private isDebugMode = false;

  constructor(
    private readonly board: Board,
    private readonly moveService: MoveService,
    private readonly turnPolicy: TurnPolicy,
    startingPlayer: Player = 'light',
    private readonly audioService: AudioService,
  ) {
    this.currentPlayer = startingPlayer;
  }

  get size() {
    return this.board.size;
  }

  get player(): Player {
    return this.currentPlayer;
  }

  get audio(): AudioService {
    return this.audioService;
  }

  get isDebugModeEnabled(): boolean {
    return this.isDebugMode;
  }

  toggleDebugMode(): boolean {
    this.isDebugMode = !this.isDebugMode;
    return this.isDebugMode;
  }

  getPiece(row: number, col: number) {
    return this.board.getPiece(row, col);
  }

  setPiece(row: number, col: number, piece: Piece | null) {
    this.board.setPiece(row, col, piece);
  }

  clearBoard() {
    this.board.clearBoard();
  }

  getValidMoves(from: Coord): MoveOption[] {
    const piece = this.board.getPiece(from.row, from.col);
    if (!piece) return [];
    if (!this.turnPolicy.canMove(piece, this.currentPlayer)) return [];
    return this.moveService.getValidMoves(from);
  }

  movePiece(from: Coord, to: Coord): boolean {
    const piece = this.board.getPiece(from.row, from.col);
    if (!piece) return false;
    if (!this.turnPolicy.canMove(piece, this.currentPlayer)) return false;

    const result = this.moveService.move(from, to);
    if (!result.success) return false;

    this.currentPlayer = this.turnPolicy.next(this.currentPlayer);
    return true;
  }
}
