/**
 * The Nuts - Advanced level game
 * Players identify the best possible hand for any board
 */
import { BaseGame } from '../BaseGame.js';
import type { GameScenario } from '../../types/games.js';
type GameLevel = 'level1' | 'level2' | 'level3';
export declare class TheNuts extends BaseGame {
    private currentLevel;
    constructor(level?: GameLevel);
    protected shouldUseSeed(): boolean;
    protected getSeed(): number;
    protected generateScenarios(): GameScenario[];
    private generateLevelScenario;
    private generateLevel1Scenario;
    private generateLevel2Scenario;
    private generateLevel3Scenario;
    private findTheNuts;
    private generateDecoyHand;
    private estimateHandStrength;
    protected renderScenario(): void;
    protected renderGame(): void;
    protected checkAnswer(answer: any, correctAnswer: any): boolean;
    protected handleAnswerFeedback(isCorrect: boolean, _answer: any): void;
    private handleLevelFailure;
    protected endGame(): void;
    private addStyles;
}
export {};
//# sourceMappingURL=TheNuts.d.ts.map