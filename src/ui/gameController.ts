import { Game } from '../game/game.js';
import { Opponent } from '../opponent/opponent.js';
import { PieceType } from '../pieces/pieceType.js';
import { DamaScoreService } from '../services/score/damaScoreService.js';
import type { ScoreService } from '../services/score/scoreService.js';
import { Coord, MoveOption } from '../types.js';

export interface GameUIConfig {
  boardElementId: string;
  turnLabelId: string;
  hintLabelId: string;
  muteButtonId: string;
  debugButtonId: string;
  gameModeSelectId?: string;
  aiOpponentSelectId?: string;
  applyModeButtonId?: string;
  scoreLightBarId?: string;
  scoreDarkBarId?: string;
}

export abstract class GameController {
  protected selected: Coord | null = null;
  protected validTargets: MoveOption[] = [];
  protected lastMovedTo: Coord | null = null;

  protected boardEl: HTMLDivElement | null;
  protected turnLabel: HTMLSpanElement | null;
  protected hintLabel: HTMLSpanElement | null;
  protected muteButton: HTMLButtonElement | null;
  protected debugButton: HTMLButtonElement | null;
  protected gameModeSelect: HTMLSelectElement | null;
  protected aiOpponentSelect: HTMLSelectElement | null;
  protected applyModeButton: HTMLButtonElement | null;
  protected modalEl: HTMLDivElement | null;
  protected modalMessage: HTMLHeadingElement | null;
  protected resetButton: HTMLButtonElement | null;
  protected scoreLightBar: HTMLDivElement | null;
  protected scoreDarkBar: HTMLDivElement | null;
  protected toggleMovesLogButton: HTMLButtonElement | null;
  protected movesLogEl: HTMLElement | null;
  protected movesListEl: HTMLUListElement | null;

  protected readonly scoreService: ScoreService;
  private moveCount: number = 0;

  private readonly aiMoveDelay: number = 500;

  protected aiOpponents: Map<string, Opponent> = new Map();

  constructor(
    protected game: Game,
    config: GameUIConfig,
  ) {
    this.scoreService = new DamaScoreService();

    this.boardEl = document.querySelector<HTMLDivElement>(`#${config.boardElementId}`);
    this.turnLabel = document.querySelector<HTMLSpanElement>(`#${config.turnLabelId}`);
    this.hintLabel = document.querySelector<HTMLSpanElement>(`#${config.hintLabelId}`);
    this.muteButton = document.querySelector<HTMLButtonElement>(`#${config.muteButtonId}`);
    this.debugButton = document.querySelector<HTMLButtonElement>(`#${config.debugButtonId}`);
    this.gameModeSelect = config.gameModeSelectId
      ? document.querySelector<HTMLSelectElement>(`#${config.gameModeSelectId}`)
      : null;
    this.aiOpponentSelect = config.aiOpponentSelectId
      ? document.querySelector<HTMLSelectElement>(`#${config.aiOpponentSelectId}`)
      : null;
    this.applyModeButton = config.applyModeButtonId
      ? document.querySelector<HTMLButtonElement>(`#${config.applyModeButtonId}`)
      : null;
    this.modalEl = document.querySelector<HTMLDivElement>('#game-end-modal');
    this.modalMessage = document.querySelector<HTMLHeadingElement>('#modal-message');
    this.resetButton = document.querySelector<HTMLButtonElement>('#reset-button');
    this.scoreLightBar = config.scoreLightBarId
      ? document.querySelector<HTMLDivElement>(`#${config.scoreLightBarId}`)
      : null;
    this.scoreDarkBar = config.scoreDarkBarId
      ? document.querySelector<HTMLDivElement>(`#${config.scoreDarkBarId}`)
      : null;
    this.toggleMovesLogButton = document.querySelector<HTMLButtonElement>('#toggle-moves-log');
    this.movesLogEl = document.querySelector<HTMLElement>('#moves-log');
    this.movesListEl = document.querySelector<HTMLUListElement>('#moves-list');

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (this.toggleMovesLogButton)
      this.toggleMovesLogButton.addEventListener('click', () => {
        this.toggleMovesLog();
      });

    if (this.muteButton) {
      this.muteButton.addEventListener('click', () => {
        this.game.audio.toggleMute();
        this.updateMuteButton();
      });
      this.updateMuteButton();
    }

    if (this.debugButton) {
      this.debugButton.addEventListener('click', () => {
        this.game.toggleDebugMode();
        this.toggleDebugMode();
      });
      this.toggleDebugMode();
    }

    if (this.gameModeSelect) {
      this.gameModeSelect.addEventListener('change', () => {
        this.toggleGameModeVisibility();
      });
      this.toggleGameModeVisibility();
    }

    if (this.applyModeButton)
      this.applyModeButton.addEventListener('click', () => {
        this.applyGameMode();
      });

    if (this.resetButton)
      this.resetButton.addEventListener('click', () => {
        this.resetGame();
      });
  }

  protected toggleGameModeVisibility(): void {
    const isAIMode = this.gameModeSelect?.value === 'ai';
    if (this.aiOpponentSelect) {
      this.aiOpponentSelect.disabled = !isAIMode;
    }
  }

  protected registerOpponent(id: string, opponent: Opponent): void {
    this.aiOpponents.set(id, opponent);
  }

  protected applyGameMode(): void {
    const mode = this.gameModeSelect?.value;

    this.game.setAIOpponent('dark', null);
    this.game.setAIOpponent('light', null);

    if (mode === 'ai') {
      const selectedAI = this.aiOpponentSelect?.value || 'random';
      const aiOpponent = this.aiOpponents.get(selectedAI);
      if (aiOpponent) {
        this.game.setAIOpponent('dark', aiOpponent);
      }
    }

    this.resetGame();
  }

  protected updateMuteButton(): void {
    if (!this.muteButton) return;
    const muted = this.game.audio.isMuted();
    this.muteButton.textContent = muted ? 'Sound Off' : 'Mute';
    this.muteButton.setAttribute('aria-pressed', String(muted));
  }

  protected toggleDebugMode(): void {
    if (!this.debugButton) return;
    const isDebug = this.game.isDebugModeEnabled;
    this.debugButton.setAttribute('aria-pressed', String(isDebug));
    this.debugButton.textContent = isDebug ? 'Debug On' : 'Debug Off';
    this.render();
  }

  protected toggleMovesLog(): void {
    if (!this.movesLogEl || !this.toggleMovesLogButton) return;
    this.movesLogEl.classList.toggle('hidden');
    const isVisible = !this.movesLogEl.classList.contains('hidden');
    this.toggleMovesLogButton.setAttribute('aria-pressed', String(isVisible));
  }

  protected addMoveToLog(from: Coord, to: Coord, player: 'light' | 'dark'): void {
    if (!this.movesListEl) return;

    this.moveCount++;
    const moveText = `${this.moveCount}. ${this.coordToString(from)} → ${this.coordToString(to)}`;

    const li = document.createElement('li');
    li.textContent = moveText;
    li.classList.add(player === 'light' ? 'light-move' : 'dark-move');

    this.movesListEl.appendChild(li);

    if (this.movesListEl.parentElement) {
      this.movesListEl.parentElement.scrollTop = this.movesListEl.parentElement.scrollHeight;
    }
  }

  private coordToString(coord: Coord): string {
    const col = String.fromCharCode(65 + coord.col);
    const row = this.game.size - coord.row;
    return `${col}${row}`;
  }

  protected render(): void {
    if (!this.boardEl) return;
    this.boardEl.innerHTML = '';
    this.boardEl.style.setProperty('--size', this.game.size.toString());

    for (let row = 0; row < this.game.size; row++) {
      for (let col = 0; col < this.game.size; col++) {
        const square = document.createElement('button');
        square.className = 'square';
        square.dataset.row = String(row);
        square.dataset.col = String(col);

        this.configureSquare(square, row, col);
        this.addPieceToSquare(square, row, col);
        this.addSquareHighlights(square, row, col);

        square.addEventListener('click', (e) => this.handleSquareClick(e));
        square.addEventListener('dragover', (e) => this.handleDragOver(e));
        square.addEventListener('drop', (e) => this.handleDrop(e));

        this.boardEl!.appendChild(square);
      }
    }

    this.updateTurnLabel();
    this.updateScorePanel();
    this.applyHighlights();
  }

  protected updateScorePanel(): void {
    const hasScoreElements = this.scoreLightBar || this.scoreDarkBar;

    if (!hasScoreElements) return;

    const { light, dark } = this.scoreService.breakdown(this.game);
    const total = Math.max(light + dark, 1);
    const lightFlex = light / total;
    const darkFlex = dark / total;

    if (this.scoreLightBar) this.scoreLightBar.style.flex = `${lightFlex}`;
    if (this.scoreDarkBar) this.scoreDarkBar.style.flex = `${darkFlex}`;
  }

  protected abstract configureSquare(square: HTMLButtonElement, row: number, col: number): void;

  protected addPieceToSquare(square: HTMLButtonElement, row: number, col: number): void {
    const piece = this.game.getPiece(row, col);

    if (piece) {
      const token = document.createElement('div');
      token.className = 'piece-token';
      token.dataset.row = String(row);
      token.dataset.col = String(col);

      piece.render(token);

      if (this.lastMovedTo && this.lastMovedTo.row === row && this.lastMovedTo.col === col) {
        token.classList.add('just-moved');
      }

      token.draggable = piece.player === this.game.player;
      token.addEventListener('dragstart', (e) => this.handleDragStart(e));
      token.addEventListener('dragend', (e) => this.handleDragEnd(e));
      square.appendChild(token);
    }
  }

  protected addSquareHighlights(square: HTMLButtonElement, row: number, col: number): void {
    if (this.selected && this.selected.row === row && this.selected.col === col) {
      square.classList.add('selected');
    }

    const isMoveTarget = this.validTargets.some((m) => m.to.row === row && m.to.col === col);
    if (isMoveTarget) square.classList.add('target');
  }

  protected updateTurnLabel(): void {
    if (this.turnLabel) {
      if (this.game.hasEnded) {
        if (this.game.isGameDraw) {
          this.turnLabel.textContent = 'Draw!';
          this.showGameEndModal('Draw!');
        } else {
          const winner = this.game.gameWinner === 'light' ? 'Light' : 'Dark';
          this.turnLabel.textContent = `${winner} Wins!`;
          this.showGameEndModal(winner);
        }
      } else {
        this.turnLabel.textContent = this.game.player === 'light' ? 'Light' : 'Dark';
      }
    }
  }

  protected showGameEndModal(winner: string): void {
    if (this.modalEl && this.modalMessage) {
      if (winner === 'Draw!') {
        this.modalMessage.textContent = "🤝 It's a Draw! 🤝";
      } else {
        this.modalMessage.textContent = `🎉 ${winner} Wins! 🎉`;
      }
      this.modalEl.classList.remove('hidden');
    }
  }

  protected hideGameEndModal(): void {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  protected resetGame(): void {
    this.hideGameEndModal();
    this.selected = null;
    this.validTargets = [];
    this.lastMovedTo = null;
    this.moveCount = 0;
    if (this.movesListEl) {
      this.movesListEl.innerHTML = '';
    }
    this.game.reset();
    this.render();
    this.setHint('Light begins.');
  }

  protected handleSquareClick(event: MouseEvent): void {
    if (this.game.hasEnded) {
      this.setHint('Game over. Refresh to play again.');
      return;
    }

    if (this.game.isCurrentPlayerAI()) {
      this.setHint('AI is thinking...');
      return;
    }

    const target = event.currentTarget as HTMLButtonElement;
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);

    const piece = this.game.getPiece(row, col);
    const targetMove = this.validTargets.find((m) => m.to.row === row && m.to.col === col);

    if (this.selected && targetMove) {
      this.executeMove(this.selected, targetMove);
      return;
    }

    if (piece && piece.player === this.game.player) {
      this.selected = { row, col };
      this.validTargets = this.game.getValidMoves({ row, col });
      this.setHint(
        this.validTargets.length ? 'Choose a highlighted square.' : 'No moves for this piece.',
      );
    } else {
      this.selected = null;
      this.validTargets = [];
      this.game.audio.playIllegal();
      this.setHint('Select your own piece.');
    }

    this.render();
  }

  protected handleDragStart(event: DragEvent): void {
    if (this.game.hasEnded) {
      event.preventDefault();
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);

    const piece = this.game.getPiece(row, col);

    if (!piece || piece.player !== this.game.player) {
      this.game.audio.playIllegal();
      event.preventDefault();
      return;
    }

    this.selected = { row, col };
    this.validTargets = this.game.getValidMoves({ row, col });

    event.dataTransfer?.setData('text/plain', `${row},${col}`);
    event.dataTransfer?.setDragImage(target, target.clientWidth / 2, target.clientHeight / 2);
    target.classList.add('dragging');

    this.setHint(
      this.validTargets.length ? 'Drag to a highlighted square.' : 'No moves for this piece.',
    );
    this.applyHighlights();
  }

  protected handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  protected handleDrop(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLButtonElement;
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);

    if (!this.selected) return;

    const targetMove = this.validTargets.find((m) => m.to.row === row && m.to.col === col);

    if (targetMove) {
      this.executeMove(this.selected, targetMove);
      return;
    }

    this.game.audio.playIllegal();
    this.setHint('Invalid drop. Try a highlighted square.');
    this.render();
  }

  protected handleDragEnd(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('dragging');

    if (this.selected) {
      this.selected = null;
      this.validTargets = [];
      this.applyHighlights();
    }
  }

  protected executeMove(from: Coord, move: MoveOption): void {
    const movingPiece = this.game.getPiece(from.row, from.col);
    const wasKing = movingPiece?.type === PieceType.KING;
    const currentPlayer = this.game.player;

    if (move.captured) {
      const captures = Array.isArray(move.captured) ? move.captured : [move.captured];
      let delay = 0;

      this.game.movePiece(from, move.to);

      for (let i = 0; i < captures.length; i++) {
        const captureCoord = captures[i];

        this.game.audio.playCapture();
        this.renderCapture(captureCoord);
      }

      setTimeout(() => {
        const movedPiece = this.game.getPiece(move.to.row, move.to.col);
        if (!wasKing && movedPiece?.type === PieceType.KING) {
          this.game.audio.playPromotion();
        }

        this.addMoveToLog(from, move.to, currentPlayer);
        this.lastMovedTo = move.to;
        this.selected = null;
        this.validTargets = [];

        this.render();
        this.processAIMove();
      }, delay);
    } else {
      this.game.movePiece(from, move.to);
      this.game.audio.playMove();

      const movedPiece = this.game.getPiece(move.to.row, move.to.col);
      if (!wasKing && movedPiece?.type === PieceType.KING) {
        this.game.audio.playPromotion();
      }

      this.addMoveToLog(from, move.to, currentPlayer);
      this.lastMovedTo = move.to;
      this.selected = null;
      this.validTargets = [];

      this.render();
      this.processAIMove();
    }
  }

  protected renderCapture(coord: Coord): void {
    const square = this.boardEl?.querySelector<HTMLDivElement>(
      `[data-row="${coord.row}"][data-col="${coord.col}"]`,
    );
    if (square) {
      const piece = square.querySelector<HTMLDivElement>('.piece');
      if (piece) {
        piece.classList.add('captured');
        piece.remove();
      }
    }
  }

  protected processAIMove(): void {
    if (this.game.hasEnded) return;
    if (!this.game.isCurrentPlayerAI()) return;

    setTimeout(() => {
      if (this.game.hasEnded) return;

      const aiOpponent = this.game.getAIOpponent(this.game.player);
      if (!aiOpponent) return;

      const move = aiOpponent.makeMove(this.game);
      if (move) {
        this.executeMove(move.from, { to: move.to });
      }
    }, this.aiMoveDelay);
  }

  protected applyHighlights(): void {
    if (!this.boardEl) return;

    const squares = this.boardEl.querySelectorAll<HTMLButtonElement>('.square');

    squares.forEach((sq) => {
      const row = Number(sq.dataset.row);
      const col = Number(sq.dataset.col);
      const isSelected = this.selected && this.selected.row === row && this.selected.col === col;
      const isTarget = this.validTargets.some((m) => m.to.row === row && m.to.col === col);

      sq.classList.toggle('selected', !!isSelected);
      sq.classList.toggle('target', isTarget);
    });
  }

  protected setHint(text: string): void {
    if (this.hintLabel) this.hintLabel.textContent = text;
  }

  abstract start(): void;
}
