/**
 * Base class for all poker training games
 */
import type { IGame, GameConfig, GameState, GameResult, GameScenario } from '../types/games.js';
import type { GameModule, GameState as RouterGameState } from '../types/router.js';
import { Timer } from '../components/Timer.js';
import { ScoreDisplay } from '../components/ScoreDisplay.js';
export declare abstract class BaseGame implements IGame, GameModule {
    config: GameConfig;
    state: GameState;
    protected container: HTMLElement | null;
    protected timer: Timer | null;
    protected scoreDisplay: ScoreDisplay | null;
    protected currentScenario: GameScenario | null;
    protected scenarios: GameScenario[];
    protected answers: any[];
    protected startTime: number;
    constructor(config: GameConfig);
    protected createInitialState(): GameState;
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
    render(container: HTMLElement): void;
    destroy(): void;
    mount(container: HTMLElement, state?: RouterGameState): void;
    unmount(): void;
    serialize(): RouterGameState;
    deserialize(state: RouterGameState): void;
    protected setupUI(): void;
    protected handleTimeUp(): void;
    protected showResults(result: GameResult): void;
    protected abstract generateScenarios(): GameScenario[];
    protected abstract renderScenario(): void;
    protected abstract renderGame(): void;
    protected abstract checkAnswer(answer: any, correctAnswer: any): boolean;
    protected abstract handleAnswerFeedback(isCorrect: boolean, answer: any): void;
    protected shouldUseSeed(): boolean;
    protected getSeed(): number;
}
//# sourceMappingURL=BaseGame.d.ts.map