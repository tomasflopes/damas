import { createGame } from '@/game/gameFactory.js';
import { DarkPawn } from '@/pieces/dama/darkPawn.js';
import { LightKing } from '@/pieces/dama/lightKing.js';
import { LightPawn } from '@/pieces/dama/lightPawn.js';
import { PieceType } from '@/pieces/pieceType.js';
import { FreeTurnPolicy } from '@/policies/turn/freeTurnPolicy.js';

const createTestGame = () => createGame({ turnPolicy: new FreeTurnPolicy() });

describe('Game - Promotion', () => {
  test('light piece promotes to king when reaching row 0', () => {
    const game = createTestGame();
    game.clearBoard();
    game.setPiece(1, 0, new LightPawn());

    const result = game.movePiece({ row: 1, col: 0 }, { row: 0, col: 1 });
    expect(result).toBe(true);

    const piece = game.getPiece(0, 1);
    expect(piece?.type).toBe(PieceType.KING);
    expect(piece?.player).toBe('light');
  });

  test('dark piece promotes to king when reaching row 7', () => {
    const game = createTestGame();
    game.clearBoard();
    game.setPiece(6, 1, new DarkPawn());

    const result = game.movePiece({ row: 6, col: 1 }, { row: 7, col: 0 });
    expect(result).toBe(true);

    const piece = game.getPiece(7, 0);
    expect(piece?.type).toBe(PieceType.KING);
    expect(piece?.player).toBe('dark');
  });

  test('king can move backwards', () => {
    const game = createTestGame();
    game.clearBoard();
    const king = new LightKing();
    game.setPiece(3, 2, king);

    const resultForward = game.movePiece({ row: 3, col: 2 }, { row: 2, col: 3 });
    expect(resultForward).toBe(true);

    const resultBackward = game.movePiece({ row: 2, col: 3 }, { row: 3, col: 2 });
    expect(resultBackward).toBe(true);
    expect(game.getPiece(3, 2)?.type).toBe(PieceType.KING);
  });
});
