/**
 * Game UI Manager
 * Handles UI setup, styles injection, and component lifecycle
 */
import { Timer } from '../components/Timer.js';
import { ScoreDisplay } from '../components/ScoreDisplay.js';
import type { GameConfig, GameState, GameResult } from '../types/games.js';
export interface UIComponents {
    timer: Timer | null;
    scoreDisplay: ScoreDisplay | null;
    container: HTMLElement | null;
    gameArea: HTMLElement | null;
}
export declare class GameUIManager {
    private components;
    private config;
    constructor(config: GameConfig);
    setupUI(container: HTMLElement, state: GameState, onTimeUp: () => void): UIComponents;
    updateScore(score: number, total: number, streak: number): void;
    incrementScore(): void;
    resetStreak(): void;
    startTimer(): void;
    pauseTimer(): void;
    resumeTimer(): void;
    resetTimer(): void;
    stopTimer(): void;
    getTimerRemaining(): number;
    setTimerRemaining(time: number): void;
    showResults(result: GameResult, onPlayAgain: () => void, onMainMenu: () => void): void;
    getGameArea(): HTMLElement | null;
    cleanup(): void;
    getComponents(): UIComponents;
}
//# sourceMappingURL=game-ui-manager.d.ts.map