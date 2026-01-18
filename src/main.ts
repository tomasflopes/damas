import { createGame } from './game/gameFactory.js';
import { DamaGameController } from './ui/damaGameController.js';

const game = createGame();

const controller = new DamaGameController(game, {
  boardElementId: 'board',
  turnLabelId: 'turn',
  hintLabelId: 'hint',
  muteButtonId: 'mute',
  debugButtonId: 'debug',
  gameModeSelectId: 'game-mode',
  aiOpponentSelectId: 'ai-opponent',
  applyModeButtonId: 'apply-mode',
});

controller.start();
