import { Board } from '../board/board.js';
import { Opponent } from '../opponent/opponent.js';
import { Piece, Player } from '../pieces/piece.js';
import { AudioService } from '../services/audio/audioService.js';
import { MoveService } from '../services/move/moveService.js';
import { Coord, MoveOption, TurnPolicy } from '../types.js';

export class Game {
  private currentPlayer: Player;
  private isDebugMode = false;
  private gameEnded = false;
  private winner: Player | null = null;
  private aiOpponents: Map<Player, Opponent | null> = new Map();

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

  get hasEnded(): boolean {
    return this.gameEnded;
  }

  get gameWinner(): Player | null {
    return this.winner;
  }

  toggleDebugMode(): boolean {
    this.isDebugMode = !this.isDebugMode;
    return this.isDebugMode;
  }

  setAIOpponent(player: Player, opponent: Opponent | null): void {
    if (opponent === null) {
      this.aiOpponents.delete(player);
    } else {
      this.aiOpponents.set(player, opponent);
    }
  }

  getAIOpponent(player: Player): Opponent | null | undefined {
    return this.aiOpponents.get(player);
  }

  isCurrentPlayerAI(): boolean {
    return this.aiOpponents.has(this.currentPlayer);
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

  resetBoard() {
    this.board.clearBoard();
    this.board.setupPieces();
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
    this.checkGameEnd();
    return true;
  }

  private checkGameEnd(): void {
    if (this.gameEnded) return;
    if (this.currentPlayerHasValidMoves()) return;

    this.endGameWithCurrentPlayerAsLoser();
  }

  private currentPlayerHasValidMoves(): boolean {
    for (let row = 0; row < this.board.size; row++) {
      for (let col = 0; col < this.board.size; col++) {
        const piece = this.board.getPiece(row, col);

        if (piece && piece.player === this.currentPlayer) {
          const moves = this.getValidMoves({ row, col });
          if (moves.length > 0) return true;
        }
      }
    }

    return false;
  }

  private endGameWithCurrentPlayerAsLoser(): void {
    this.gameEnded = true;
    this.winner = this.currentPlayer === 'light' ? 'dark' : 'light';
  }

  reset(): void {
    this.resetBoard();

    this.currentPlayer = 'light';
    this.gameEnded = false;
    this.winner = null;
  }
}
