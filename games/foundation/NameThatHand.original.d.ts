/**
 * Name That Hand - Foundation level game
 * Players identify poker hands from 5 cards
 */
import { BaseGame } from '../BaseGame.js';
import type { GameScenario } from '../../types/games.js';
export declare class NameThatHand extends BaseGame {
    private targetHandTypes;
    constructor();
    protected generateScenarios(): GameScenario[];
    private generateChoices;
    protected renderScenario(): void;
    protected renderGame(): void;
    protected checkAnswer(answer: any, correctAnswer: any): boolean;
    protected handleAnswerFeedback(isCorrect: boolean, answer: any): void;
    private addStyles;
}
//# sourceMappingURL=NameThatHand.original.d.ts.map