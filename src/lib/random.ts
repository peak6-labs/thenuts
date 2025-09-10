/**
 * Random number generation utilities with seeded random support
 */

interface RandomState {
  seed: number | null;
  generator: (() => number) | null;
}

let randomState: RandomState = {
  seed: null,
  generator: null
};

/**
 * Mulberry32 seeded random number generator
 * Provides deterministic random numbers when given the same seed
 */
export function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Set the random seed for deterministic shuffling
 * @param seed - Seed value (use null for Math.random)
 */
export function setSeed(seed: number | null): void {
  if (seed === null || seed === undefined) {
    randomState.seed = null;
    randomState.generator = null;
  } else {
    randomState.seed = seed;
    randomState.generator = mulberry32(seed);
  }
}

/**
 * Get the current seed
 */
export function getSeed(): number | null {
  return randomState.seed;
}

/**
 * Get a random number using either seeded or Math.random
 * @returns Random number between 0 and 1
 */
export function getRandom(): number {
  return randomState.generator ? randomState.generator() : Math.random();
}

/**
 * Get random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(getRandom() * (max - min + 1)) + min;
}

/**
 * Get hourly seed based on UTC time
 * Ensures all players get the same puzzles within the same hour
 */
export function getHourlySeed(offset: number = 0): number {
  const now = new Date();
  const utcHour = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours()
  );
  return utcHour + offset;
}

/**
 * Get daily seed based on UTC date
 * Ensures all players get the same puzzles on the same day
 */
export function getDailySeed(offset: number = 0): number {
  const now = new Date();
  const utcDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return utcDay + offset;
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * Uses the current random state (seeded or not)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(getRandom() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Pick a random element from an array
 */
export function pickRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(getRandom() * array.length)];
}

/**
 * Pick multiple random elements from an array (without replacement)
 */
export function pickMultipleRandom<T>(array: T[], count: number): T[] {
  if (count >= array.length) return [...array];
  
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

/**
 * Create a random number generator with a specific seed
 * This doesn't affect the global random state
 */
export function createSeededRandom(seed: number): {
  random: () => number;
  randomInt: (min: number, max: number) => number;
  shuffle: <T>(array: T[]) => T[];
  pick: <T>(array: T[]) => T | undefined;
} {
  const generator = mulberry32(seed);
  
  return {
    random: generator,
    randomInt: (min: number, max: number) => {
      return Math.floor(generator() * (max - min + 1)) + min;
    },
    shuffle: <T>(array: T[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(generator() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    },
    pick: <T>(array: T[]) => {
      if (array.length === 0) return undefined;
      return array[Math.floor(generator() * array.length)];
    }
  };
}

/**
 * Reset random state to use Math.random
 */
export function resetRandom(): void {
  setSeed(null);
}