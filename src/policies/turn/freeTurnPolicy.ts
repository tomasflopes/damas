import { Player } from '../../pieces/damaPiece.js';
import { TurnPolicy } from '../../types.js';

export class FreeTurnPolicy implements TurnPolicy {
  canMove(): boolean {
    return true;
  }
  next(current: Player): Player {
    return current;
  }
}
