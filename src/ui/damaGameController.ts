import { Game } from '../game/game.js';
import { OpponentFactory } from '../opponent/opponentFactory.js';
import { GameController, GameUIConfig } from './gameController.js';

export class DamaGameController extends GameController {
  constructor(game: Game, config: GameUIConfig) {
    super(game, config);
    this.initializeOpponents();
  }

  private initializeOpponents(): void {
    const availableOpponents = OpponentFactory.getAvailableOpponents();

    for (const opponentOption of availableOpponents) {
      this.registerOpponent(opponentOption.id, opponentOption.opponent);
    }

    this.populateOpponentSelect(availableOpponents);
  }

  private populateOpponentSelect(availableOpponents: Array<{ id: string; name: string }>): void {
    if (!this.aiOpponentSelect) return;

    this.aiOpponentSelect.innerHTML = '';

    for (const opponentOption of availableOpponents) {
      const option = document.createElement('option');
      option.value = opponentOption.id;
      option.textContent = opponentOption.name;
      this.aiOpponentSelect.appendChild(option);
    }
  }

  protected configureSquare(square: HTMLButtonElement, row: number, col: number): void {
    const isDark = (row + col) % 2 === 1;
    const squareSize = '64px';
    const lightColor = '#ffffff';
    const darkColor = '#000000';

    square.style.border = 'none';
    square.style.padding = '0';
    square.style.width = squareSize;
    square.style.height = squareSize;
    square.style.display = 'flex';
    square.style.alignItems = 'center';
    square.style.position = 'relative';
    square.style.justifyContent = 'center';
    square.style.fontSize = '28px';
    square.style.cursor = 'pointer';
    square.style.transition = 'transform 120ms ease, box-shadow 120ms ease';
    square.style.background = isDark ? darkColor : lightColor;

    if (this.game.isDebugModeEnabled) {
      const coord = document.createElement('span');
      coord.textContent = `${row},${col}`;
      coord.style.position = 'absolute';
      coord.style.fontSize = '10px';
      coord.style.color = '#888';
      coord.style.pointerEvents = 'none';
      coord.style.top = '2px';
      coord.style.right = '2px';
      square.appendChild(coord);
    }
  }

  start(): void {
    this.render();
    this.setHint('Light begins.');
    this.processAIMove();
  }
}
