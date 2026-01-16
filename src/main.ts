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
    game.movePiece(selected, targetMove.to);
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
    game.movePiece(selected, targetMove.to);
    lastMovedTo = targetMove.to;
    selected = null;
    validTargets = [];
    render();
    return;
  }

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
