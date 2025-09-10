/**
 * Game Results Manager
 * Handles scoring, results, and high scores
 */
import type { GameResult, GameState } from '../types/games.js';
export declare class GameResultsManager {
    private answers;
    private startTime;
    private gameName;
    constructor(gameName: string);
    startTracking(): void;
    recordAnswer(answer: any, isCorrect: boolean, timeToAnswer?: number): void;
    getAnswers(): {
        answer: any;
        isCorrect: boolean;
        timestamp: number;
        timeToAnswer?: number;
    }[];
    calculateResult(state: GameState): GameResult;
    saveIfHighScore(state: GameState): boolean;
    recordGamePlayed(): void;
    formatTime(seconds: number): string;
    getAccuracyPercent(result: GameResult): number;
    reset(): void;
    serialize(): {
        answers: {
            answer: any;
            isCorrect: boolean;
            timestamp: number;
            timeToAnswer?: number;
        }[];
        startTime: number;
    };
    deserialize(data: {
        answers: any[];
        startTime: number;
    }): void;
}
//# sourceMappingURL=game-results-manager.d.ts.map