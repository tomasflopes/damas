import { Game } from '../game/game.js';
import { createGame } from '../game/gameFactory.js';
import { Coord, MoveOption } from '../types.js';
import { Opponent } from './opponent.js';

export class MinimaxOpponent implements Opponent {
  private readonly kingValue: number = 3;
  private readonly pawnValue: number = 1;

  constructor(private readonly maxDepth: number = 5) {
    this.maxDepth = maxDepth;
  }

  name(): string {
    return 'Minimax';
  }

  makeMove(game: Game): { from: Coord; to: Coord } | null {
    const availableMoves: Array<{ from: Coord; to: Coord; move: MoveOption }> = [];
    const maximizingPlayer = game.player;

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const from = { row, col };
        const piece = game.getPiece(row, col);

        if (!piece || piece.player !== game.player) continue;

        const moves = game.getValidMoves(from);

        for (const move of moves) availableMoves.push({ from, to: move.to, move });
      }
    }

    if (availableMoves.length === 0) return null;

    let bestMove = availableMoves[0];
    let bestValue = -Infinity;

    for (const moveOption of availableMoves) {
      const gameCopy = this.copyGame(game);
      gameCopy.movePiece(moveOption.from, moveOption.to);

      const value = this.minimax(
        gameCopy,
        this.maxDepth - 1,
        -Infinity,
        Infinity,
        false,
        maximizingPlayer,
      );

      if (value > bestValue) {
        bestValue = value;
        bestMove = moveOption;
      }
    }

    return { from: bestMove.from, to: bestMove.to };
  }

  private minimax(
    game: Game,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    maximizingPlayer: string,
  ): number {
    if (depth === 0 || game.hasEnded) return this.evaluate(game, maximizingPlayer);

    return isMaximizing
      ? this.maximizingNode(game, depth, alpha, beta, maximizingPlayer)
      : this.minimizingNode(game, depth, alpha, beta, maximizingPlayer);
  }

  private maximizingNode(
    game: Game,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: string,
  ): number {
    let maxEval = -Infinity;

    for (const { from, move } of this.getAllMoves(game)) {
      const gameCopy = this.copyGame(game);
      gameCopy.movePiece(from, move.to);

      const eval_ = this.minimax(gameCopy, depth - 1, alpha, beta, false, maximizingPlayer);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }

    return maxEval === -Infinity ? this.evaluate(game, maximizingPlayer) : maxEval;
  }

  private minimizingNode(
    game: Game,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: string,
  ): number {
    let minEval = Infinity;

    for (const { from, move } of this.getAllMoves(game)) {
      const gameCopy = this.copyGame(game);
      gameCopy.movePiece(from, move.to);

      const eval_ = this.minimax(gameCopy, depth - 1, alpha, beta, true, maximizingPlayer);
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);

      if (beta <= alpha) break;
    }

    return minEval === Infinity ? this.evaluate(game, maximizingPlayer) : minEval;
  }

  private getAllMoves(game: Game): Array<{ from: Coord; move: MoveOption }> {
    const moves: Array<{ from: Coord; move: MoveOption }> = [];

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const from = { row, col };
        const piece = game.getPiece(row, col);

        if (!piece || piece.player !== game.player) continue;

        const validMoves = game.getValidMoves(from);

        for (const move of validMoves) moves.push({ from, move });
      }
    }

    return moves;
  }

  private evaluate(game: Game, maximizingPlayer: string): number {
    if (game.hasEnded) return this.evaluateTerminalState(game, maximizingPlayer);

    return this.evaluatePosition(game, maximizingPlayer);
  }

  private evaluateTerminalState(game: Game, maximizingPlayer: string): number {
    const opponent = maximizingPlayer === 'light' ? 'dark' : 'light';

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        if (game.getPiece(row, col)?.player === opponent) return -Infinity;
      }
    }

    return Infinity;
  }

  private evaluatePosition(game: Game, maximizingPlayer: string): number {
    let score = 0;

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const piece = game.getPiece(row, col);
        if (!piece) continue;

        const isOwnPiece = piece.player === maximizingPlayer;
        score += this.evaluatePiece(piece, row, isOwnPiece);
      }
    }

    return score;
  }

  private evaluatePiece(piece: any, row: number, isOwnPiece: boolean): number {
    const pieceValue = piece.type === 'king' ? this.kingValue : this.pawnValue;
    const sign = isOwnPiece ? 1 : -1;
    let score = sign * pieceValue;

    if (piece.type === 'pawn') {
      const promotionBonus = this.getPromotionBonus(piece.player, row, isOwnPiece);
      score += promotionBonus;
    }

    return score;
  }

  private getPromotionBonus(player: string, row: number, isOwn: boolean): number {
    const sign = isOwn ? 1 : -1;
    const bonus = player === 'light' ? (7 - row) * 0.1 : row * 0.1;
    return sign * bonus;
  }

  private copyGame(game: Game): Game {
    const currentPlayer = (game as any).currentPlayer;

    const copy = createGame({ startingPlayer: currentPlayer });
    copy.clearBoard();

    for (let row = 0; row < game.size; row++) {
      for (let col = 0; col < game.size; col++) {
        const piece = game.getPiece(row, col);
        if (piece) {
          copy.setPiece(row, col, piece);
        }
      }
    }

    (copy as any).currentPlayer = currentPlayer;

    return copy;
  }
}
