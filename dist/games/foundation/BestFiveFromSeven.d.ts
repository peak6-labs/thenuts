/**
 * Best Five from Seven - Select the best 5-card hand from 7 cards
 */
import { BaseGame } from '../BaseGame.js';
import type { GameScenario, GameConfig } from '../../types/games';
interface BestFiveScenario extends GameScenario {
    allCards: string[];
    bestHand: string[];
    handName: string;
    possibleHands: string[][];
}
export declare class BestFiveFromSeven extends BaseGame {
    protected containerId: string;
    protected scenarios: BestFiveScenario[];
    protected currentScenario: GameScenario | null;
    private selectedCards;
    constructor(config?: Partial<GameConfig>);
    protected generateScenarios(): GameScenario[];
    protected renderScenario(): void;
    private toggleCard;
    private clearSelection;
    private updateSelection;
    private submitSelection;
    protected handleAnswer(answerId: string): void;
    private showFeedback;
    protected renderGame(): void;
    protected checkAnswer(_userAnswer: string, _correctAnswer: string): boolean;
    protected handleAnswerFeedback(_isCorrect: boolean): void;
    getInstructions(): string;
}
export declare function getBestFiveStyles(): string;
export {};
//# sourceMappingURL=BestFiveFromSeven.d.ts.map