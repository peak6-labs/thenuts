/**
 * Local storage utilities for game data persistence
 */
import type { HighScore, GameProgress } from '../types/games.js';
/**
 * Storage keys for different data types
 */
export declare const StorageKeys: {
    readonly HIGH_SCORES: "poker-training-high-scores";
    readonly GAME_PROGRESS: "poker-training-game-progress";
    readonly SETTINGS: "poker-training-settings";
    readonly ACHIEVEMENTS: "poker-training-achievements";
    readonly COMPLETED_LEVELS: "poker-training-completed-levels";
    readonly DAILY_CHALLENGES: "poker-training-daily-challenges";
};
/**
 * Check if localStorage is available
 */
export declare function isStorageAvailable(): boolean;
/**
 * Get item from localStorage with type safety
 */
export declare function getStorageItem<T>(key: string, defaultValue: T): T;
/**
 * Set item in localStorage
 */
export declare function setStorageItem<T>(key: string, value: T): boolean;
/**
 * Remove item from localStorage
 */
export declare function removeStorageItem(key: string): boolean;
/**
 * Clear all game data from localStorage
 */
export declare function clearAllGameData(): boolean;
/**
 * Get high scores for all games
 */
export declare function getHighScores(): Record<string, HighScore>;
/**
 * Get high score for a specific game
 */
export declare function getHighScore(gameName: string): HighScore | null;
/**
 * Save high score for a game
 */
export declare function saveHighScore(gameName: string, score: HighScore): boolean;
/**
 * Check if a score is a new high score
 */
export declare function isNewHighScore(gameName: string, score: number): boolean;
/**
 * Get game progress
 */
export declare function getGameProgress(): GameProgress;
/**
 * Update game progress
 */
export declare function updateGameProgress(updates: Partial<GameProgress>): boolean;
/**
 * Increment games played counter
 */
export declare function incrementGamesPlayed(gameName: string): void;
/**
 * Get completed levels
 */
export declare function getCompletedLevels(): Set<string>;
/**
 * Mark level as completed
 */
export declare function markLevelCompleted(levelId: string): boolean;
/**
 * Check if level is completed
 */
export declare function isLevelCompleted(levelId: string): boolean;
/**
 * Get game settings
 */
export declare function getSettings(): Record<string, any>;
/**
 * Update settings
 */
export declare function updateSettings(settings: Record<string, any>): boolean;
/**
 * Get a specific setting value
 */
export declare function getSetting<T>(key: string, defaultValue: T): T;
/**
 * Set a specific setting value
 */
export declare function setSetting(key: string, value: any): boolean;
/**
 * Export all game data as JSON
 */
export declare function exportGameData(): string;
/**
 * Import game data from JSON
 */
export declare function importGameData(jsonData: string): boolean;
//# sourceMappingURL=storage.d.ts.map