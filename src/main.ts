import { createGame } from './game/gameFactory.js';
import { PieceType } from './pieces/pieceType.js';
import { Coord } from './types.js';

const game = createGame();
let selected: Coord | null = null;
let validTargets: Array<{ to: Coord; captured?: Coord }> = [];
let lastMovedTo: Coord | null = null;

const boardEl = document.querySelector<HTMLDivElement>('#board');
const turnLabel = document.querySelector<HTMLSpanElement>('#turn');
const hintLabel = document.querySelector<HTMLSpanElement>('#hint');
const muteButton = document.querySelector<HTMLButtonElement>('#mute');
const debugButton = document.querySelector<HTMLButtonElement>('#debug');

function updateMuteButton() {
  if (!muteButton) return;
  const muted = game.audio.isMuted();
  muteButton.textContent = muted ? 'Sound Off' : 'Mute';
  muteButton.setAttribute('aria-pressed', String(muted));
}

function toggleDebugMode() {
  if (!debugButton) return;
  const isDebug = game.isDebugModeEnabled;
  debugButton.setAttribute('aria-pressed', String(isDebug));
  debugButton.textContent = isDebug ? 'Debug On' : 'Debug Off';
  render();
}

if (muteButton) {
  muteButton.addEventListener('click', () => {
    game.audio.toggleMute();
    updateMuteButton();
  });

  updateMuteButton();
}

if (debugButton) {
  debugButton.addEventListener('click', () => {
    game.toggleDebugMode();
    toggleDebugMode();
  });
  toggleDebugMode();
}

function render() {
  if (!boardEl) return;
  boardEl.innerHTML = '';
  boardEl.style.setProperty('--size', game.size.toString());

  for (let row = 0; row < game.size; row++) {
    for (let col = 0; col < game.size; col++) {
      const square = document.createElement('button');
      square.className = 'square';
      square.dataset.row = String(row);
      square.dataset.col = String(col);

      const isDark = (row + col) % 2 === 1;
      square.classList.toggle('dark', isDark);
      square.classList.toggle('light', !isDark);

      if (game.isDebugModeEnabled) {
        square.innerHTML = `<span class="coord">${row},${col}</span>`;
      }

      const piece = game.getPiece(row, col);

      if (piece) {
        const token = document.createElement('div');
        token.className = 'piece-token';
        token.dataset.row = String(row);
        token.dataset.col = String(col);

        const colorClass = piece.player === 'light' ? 'piece-light' : 'piece-dark';
        token.classList.add(colorClass);

        if (piece.type === PieceType.KING) token.classList.add('king');

        if (lastMovedTo && lastMovedTo.row === row && lastMovedTo.col === col) {
          token.classList.add('just-moved');
        }

        token.draggable = piece.player === game.player;
        token.addEventListener('dragstart', handleDragStart);
        token.addEventListener('dragend', handleDragEnd);
        square.appendChild(token);
      }

      if (selected && selected.row === row && selected.col === col) {
        square.classList.add('selected');
      }

      const isMoveTarget = validTargets.some((m) => m.to.row === row && m.to.col === col);

      if (isMoveTarget) square.classList.add('target');

      square.addEventListener('click', handleSquareClick);
      square.addEventListener('dragover', handleDragOver);
      square.addEventListener('drop', handleDrop);
      boardEl.appendChild(square);
    }
  }

  if (turnLabel) turnLabel.textContent = game.player === 'light' ? 'Light' : 'Dark';

  applyHighlights();
}

function handleSquareClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLButtonElement;
  const row = Number(target.dataset.row);
  const col = Number(target.dataset.col);

  const piece = game.getPiece(row, col);

  const targetMove = validTargets.find((m) => m.to.row === row && m.to.col === col);

  if (selected && targetMove) {
    const movingPiece = game.getPiece(selected.row, selected.col);
    const wasKing = movingPiece?.type === PieceType.KING;

    game.movePiece(selected, targetMove.to);

    if (targetMove.captured) game.audio.playCapture();
    else game.audio.playMove();

    const movedPiece = game.getPiece(targetMove.to.row, targetMove.to.col);
    if (!wasKing && movedPiece?.type === PieceType.KING) game.audio.playPromotion();
    lastMovedTo = targetMove.to;
    selected = null;
    validTargets = [];

    render();
    return;
  }

  if (piece && piece.player === game.player) {
    selected = { row, col };
    validTargets = game.getValidMoves({ row, col });

    setHint(validTargets.length ? 'Choose a highlighted square.' : 'No moves for this piece.');
  } else {
    selected = null;
    validTargets = [];

    game.audio.playIllegal();
    setHint('Select your own piece.');
  }

  render();
}

function handleDragStart(event: DragEvent) {
  const target = event.currentTarget as HTMLElement;
  const row = Number(target.dataset.row);
  const col = Number(target.dataset.col);

  const piece = game.getPiece(row, col);

  if (!piece || piece.player !== game.player) {
    game.audio.playIllegal();
    event.preventDefault();
    return;
  }

  selected = { row, col };
  validTargets = game.getValidMoves({ row, col });

  event.dataTransfer?.setData('text/plain', `${row},${col}`);
  event.dataTransfer?.setDragImage(target, target.clientWidth / 2, target.clientHeight / 2);
  target.classList.add('dragging');

  setHint(validTargets.length ? 'Drag to a highlighted square.' : 'No moves for this piece.');
  applyHighlights();
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  const target = event.currentTarget as HTMLButtonElement;
  const row = Number(target.dataset.row);
  const col = Number(target.dataset.col);

  if (!selected) return;

  const targetMove = validTargets.find((m) => m.to.row === row && m.to.col === col);

  if (targetMove) {
    const movingPiece = game.getPiece(selected.row, selected.col);
    const wasKing = movingPiece?.type === PieceType.KING;

    game.movePiece(selected, targetMove.to);

    if (targetMove.captured) game.audio.playCapture();
    else game.audio.playMove();

    const movedPiece = game.getPiece(targetMove.to.row, targetMove.to.col);
    if (!wasKing && movedPiece?.type === PieceType.KING) game.audio.playPromotion();
    lastMovedTo = targetMove.to;
    selected = null;
    validTargets = [];
    render();
    return;
  }

  game.audio.playIllegal();
  setHint('Invalid drop. Try a highlighted square.');
  render();
}

function handleDragEnd(event: DragEvent) {
  const target = event.currentTarget as HTMLElement;
  target.classList.remove('dragging');

  if (selected) {
    selected = null;
    validTargets = [];
    applyHighlights();
  }
}

function applyHighlights() {
  if (!boardEl) return;

  const squares = boardEl.querySelectorAll<HTMLButtonElement>('.square');

  squares.forEach((sq) => {
    const row = Number(sq.dataset.row);
    const col = Number(sq.dataset.col);
    const isSelected = selected && selected.row === row && selected.col === col;
    const isTarget = validTargets.some((m) => m.to.row === row && m.to.col === col);

    sq.classList.toggle('selected', !!isSelected);
    sq.classList.toggle('target', isTarget);
  });
}

function setHint(text: string) {
  if (hintLabel) hintLabel.textContent = text;
}

render();
setHint('Light begins.');
