import { Game } from '../game/game.js';
import { PieceType } from '../pieces/pieceType.js';
import { Coord } from '../types.js';

export interface GameUIConfig {
  boardElementId: string;
  turnLabelId: string;
  hintLabelId: string;
  muteButtonId: string;
  debugButtonId: string;
}

export abstract class GameController {
  protected selected: Coord | null = null;
  protected validTargets: Array<{ to: Coord; captured?: Coord }> = [];
  protected lastMovedTo: Coord | null = null;

  protected boardEl: HTMLDivElement | null;
  protected turnLabel: HTMLSpanElement | null;
  protected hintLabel: HTMLSpanElement | null;
  protected muteButton: HTMLButtonElement | null;
  protected debugButton: HTMLButtonElement | null;

  constructor(
    protected game: Game,
    config: GameUIConfig,
  ) {
    this.boardEl = document.querySelector<HTMLDivElement>(`#${config.boardElementId}`);
    this.turnLabel = document.querySelector<HTMLSpanElement>(`#${config.turnLabelId}`);
    this.hintLabel = document.querySelector<HTMLSpanElement>(`#${config.hintLabelId}`);
    this.muteButton = document.querySelector<HTMLButtonElement>(`#${config.muteButtonId}`);
    this.debugButton = document.querySelector<HTMLButtonElement>(`#${config.debugButtonId}`);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
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
    this.applyHighlights();
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
      this.turnLabel.textContent = this.game.player === 'light' ? 'Light' : 'Dark';
    }
  }

  protected handleSquareClick(event: MouseEvent): void {
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

  protected executeMove(from: Coord, move: { to: Coord; captured?: Coord }): void {
    const movingPiece = this.game.getPiece(from.row, from.col);
    const wasKing = movingPiece?.type === PieceType.KING;

    this.game.movePiece(from, move.to);

    if (move.captured) {
      this.game.audio.playCapture();
    } else {
      this.game.audio.playMove();
    }

    const movedPiece = this.game.getPiece(move.to.row, move.to.col);
    if (!wasKing && movedPiece?.type === PieceType.KING) {
      this.game.audio.playPromotion();
    }

    this.lastMovedTo = move.to;
    this.selected = null;
    this.validTargets = [];

    this.render();
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
