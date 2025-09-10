/**
 * Game State Manager
 * Handles game state logic separately from BaseGame
 */
import type { GameState, GameConfig } from '../types/games.js';
export declare class GameStateManager {
    private state;
    private readonly config;
    constructor(config: GameConfig);
    private createInitialState;
    getState(): GameState;
    setState(updates: Partial<GameState>): void;
    reset(): void;
    nextRound(): boolean;
    incrementScore(): void;
    recordMistake(): void;
    pause(): void;
    resume(): void;
    complete(): void;
    isComplete(): boolean;
    isPaused(): boolean;
    serialize(): GameState;
    deserialize(state: GameState): void;
}
//# sourceMappingURL=game-state-manager.d.ts.map