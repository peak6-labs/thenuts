/**
 * Score display component for games
 */
import type { ScoreDisplayOptions } from '../types/ui.js';
export declare class ScoreDisplay {
    private element;
    private options;
    constructor(options: ScoreDisplayOptions);
    private createElement;
    update(updates?: Partial<ScoreDisplayOptions>): void;
    incrementScore(): void;
    resetStreak(): void;
    private updateAccuracy;
    attachTo(parent: HTMLElement | string): void;
    getElement(): HTMLElement;
    reset(): void;
    destroy(): void;
}
/**
 * Inject score display styles into document
 */
export declare function injectScoreDisplayStyles(): void;
/**
 * Default score display styles
 */
export declare function getScoreDisplayStyles(): string;
//# sourceMappingURL=ScoreDisplay.d.ts.map