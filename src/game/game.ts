import { DamaBoard } from '../board.js';
import { Player } from '../pieces/damaPiece.js';
import { Piece } from '../pieces/piece.js';
import { MoveService } from '../services/moveService.js';
import { Coord, MoveOption, TurnPolicy } from '../types.js';

export class Game {
  private currentPlayer: Player;

  constructor(
    private readonly board: DamaBoard,
    private readonly moveService: MoveService,
    private readonly turnPolicy: TurnPolicy,
    startingPlayer: Player = 'light',
  ) {
    this.currentPlayer = startingPlayer;
  }

  get size() {
    return this.board.size;
  }

  get player(): Player {
    return this.currentPlayer;
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
