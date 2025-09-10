/**
 * Refactored Base Game Class
 * Uses composition instead of inheritance for better modularity
 * Reduced from 423 lines to ~200 lines
 */
import type { IGame, GameConfig, GameState, GameResult, GameScenario } from '../types/games.js';
import type { GameModule, GameState as RouterGameState } from '../types/router.js';
import { GameStateManager } from '../lib/game-state-manager.js';
import { GameResultsManager } from '../lib/game-results-manager.js';
import { GameUIManager } from '../lib/game-ui-manager.js';
export declare abstract class BaseGame implements IGame, GameModule {
    config: GameConfig;
    protected stateManager: GameStateManager;
    protected resultsManager: GameResultsManager;
    protected uiManager: GameUIManager;
    protected currentScenario: GameScenario | null;
    protected scenarios: GameScenario[];
    protected container: HTMLElement | null;
    constructor(config: GameConfig);
    get state(): GameState;
    initialize(): void;
    start(): void;
    pause(): void;
    resume(): void;
    reset(): void;
    nextRound(): void;
    submitAnswer(answer: any): boolean;
    protected endGame(): void;
    getResult(): GameResult;
    saveHighScore(): void;
    mount(container: HTMLElement, state?: RouterGameState): void;
    unmount(): void;
    render(container: HTMLElement): void;
    destroy(): void;
    serialize(): RouterGameState;
    deserialize(state: RouterGameState): void;
    protected handleTimeUp(): void;
    protected abstract generateScenarios(): GameScenario[];
    protected abstract renderScenario(): void;
    protected abstract renderGame(): void;
    protected abstract checkAnswer(answer: any, correctAnswer: any): boolean;
    protected abstract handleAnswerFeedback(isCorrect: boolean, answer: any): void;
    protected shouldUseSeed(): boolean;
    protected getSeed(): number;
}
//# sourceMappingURL=BaseGame.d.ts.map