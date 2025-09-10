/**
 * Random number generation utilities with seeded random support
 */
/**
 * Mulberry32 seeded random number generator
 * Provides deterministic random numbers when given the same seed
 */
export declare function mulberry32(seed: number): () => number;
/**
 * Set the random seed for deterministic shuffling
 * @param seed - Seed value (use null for Math.random)
 */
export declare function setSeed(seed: number | null): void;
/**
 * Get the current seed
 */
export declare function getSeed(): number | null;
/**
 * Get a random number using either seeded or Math.random
 * @returns Random number between 0 and 1
 */
export declare function getRandom(): number;
/**
 * Get random integer between min and max (inclusive)
 */
export declare function getRandomInt(min: number, max: number): number;
/**
 * Get hourly seed based on UTC time
 * Ensures all players get the same puzzles within the same hour
 */
export declare function getHourlySeed(offset?: number): number;
/**
 * Get daily seed based on UTC date
 * Ensures all players get the same puzzles on the same day
 */
export declare function getDailySeed(offset?: number): number;
/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * Uses the current random state (seeded or not)
 */
export declare function shuffleArray<T>(array: T[]): T[];
/**
 * Pick a random element from an array
 */
export declare function pickRandom<T>(array: T[]): T | undefined;
/**
 * Pick multiple random elements from an array (without replacement)
 */
export declare function pickMultipleRandom<T>(array: T[], count: number): T[];
/**
 * Create a random number generator with a specific seed
 * This doesn't affect the global random state
 */
export declare function createSeededRandom(seed: number): {
    random: () => number;
    randomInt: (min: number, max: number) => number;
    shuffle: <T>(array: T[]) => T[];
    pick: <T>(array: T[]) => T | undefined;
};
/**
 * Reset random state to use Math.random
 */
export declare function resetRandom(): void;
//# sourceMappingURL=random.d.ts.map