import { Board } from '../board.js';
import { Piece } from '../piece.js';
import { Coord, MoveGenerator, MoveOption } from '../types.js';

export class DefaultMoveGenerator implements MoveGenerator {
  constructor(private readonly board: Board) {}

  getValidMoves(from: Coord): MoveOption[] {
    const piece = this.board.getPiece(from.row, from.col);
    if (!piece) return [];

    return piece.isKing ? this.generateKingMoves(from, piece) : this.generatePawnMoves(from, piece);
  }

  private generatePawnMoves(from: Coord, piece: Piece): MoveOption[] {
    const deltas: Array<[number, number]> = [];
    if (piece.player === 'light') deltas.push([-1, -1], [-1, 1]);
    if (piece.player === 'dark') deltas.push([1, -1], [1, 1]);

    const moves: MoveOption[] = [];
    for (const [dr, dc] of deltas) {
      const nr = from.row + dr;
      const nc = from.col + dc;
      if (!this.isValidSquare(nr, nc)) continue;

      const occupant = this.board.getPiece(nr, nc);

      if (!occupant) {
        moves.push({ to: { row: nr, col: nc } });
      } else if (occupant.player !== piece.player) {
        const jumpR = nr + dr;
        const jumpC = nc + dc;
        if (this.isValidSquare(jumpR, jumpC) && !this.board.getPiece(jumpR, jumpC))
          moves.push({
            to: { row: jumpR, col: jumpC },
            captured: { row: nr, col: nc },
          });
      }
    }

    return moves;
  }

  private generateKingMoves(from: Coord, piece: Piece): MoveOption[] {
    const kingDirs: Array<[number, number]> = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    const moves: MoveOption[] = [];

    for (const [dr, dc] of kingDirs) {
      let r = from.row + dr;
      let c = from.col + dc;
      let captured: Coord | undefined;

      while (this.isValidSquare(r, c)) {
        const occupant = this.board.getPiece(r, c);
        if (!occupant) {
          moves.push({ to: { row: r, col: c }, captured });
        } else {
          if (occupant.player === piece.player) break;
          if (captured) break; // already captured one piece
          captured = { row: r, col: c };
        }
        r += dr;
        c += dc;
      }
    }

    return moves;
  }

  private isValidSquare(row: number, col: number): boolean {
    return this.board.inBounds(row, col) && this.board.isDarkSquare(row, col);
  }
}
