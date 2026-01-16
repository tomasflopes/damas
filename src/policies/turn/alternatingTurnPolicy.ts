import { Piece, Player } from "../../piece.js";
import { TurnPolicy } from "../../types.js";

export class AlternatingTurnPolicy implements TurnPolicy {
  canMove(piece: Piece, current: Player): boolean {
    return piece.player === current;
  }
  next(current: Player): Player {
    return current === "light" ? "dark" : "light";
  }
}
