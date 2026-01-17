import { Game } from '../game/game.js';
import { GameController, GameUIConfig } from './gameController.js';

export class DamaGameController extends GameController {
  constructor(game: Game, config: GameUIConfig) {
    super(game, config);
  }

  protected configureSquare(square: HTMLButtonElement, row: number, col: number): void {
    const isDark = (row + col) % 2 === 1;
    square.classList.toggle('dark', isDark);
    square.classList.toggle('light', !isDark);

    if (this.game.isDebugModeEnabled) {
      square.innerHTML = `<span class="coord">${row},${col}</span>`;
    }
  }

  start(): void {
    this.render();
    this.setHint('Light begins.');
  }
}
