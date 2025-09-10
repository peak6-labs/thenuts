/**
 * Hand vs Hand - Compare two poker hands
 */
import { BaseGame } from '../BaseGame.js';
import type { GameScenario, GameConfig } from '../../types/games';
interface HandVsHandScenario extends GameScenario {
    hand1: string[];
    hand2: string[];
    winner: 'hand1' | 'hand2' | 'tie';
}
export declare class HandVsHand extends BaseGame {
    protected containerId: string;
    protected scenarios: HandVsHandScenario[];
    protected currentScenario: GameScenario | null;
    constructor(config?: Partial<GameConfig>);
    protected generateScenarios(): GameScenario[];
    protected renderScenario(): void;
    protected handleAnswer(answerId: string): void;
    private showFeedback;
    protected renderGame(): void;
    private addStyles;
    protected checkAnswer(userAnswer: any, correctAnswer: any): boolean;
    protected handleAnswerFeedback(isCorrect: boolean, answer: any): void;
    getInstructions(): string;
}
export declare function getHandVsHandStyles(): string;
export {};
//# sourceMappingURL=HandVsHand.d.ts.map