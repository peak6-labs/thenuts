/**
 * Local storage utilities for game data persistence
 */
const STORAGE_PREFIX = 'poker-training-';
/**
 * Storage keys for different data types
 */
export const StorageKeys = {
    HIGH_SCORES: `${STORAGE_PREFIX}high-scores`,
    GAME_PROGRESS: `${STORAGE_PREFIX}game-progress`,
    SETTINGS: `${STORAGE_PREFIX}settings`,
    ACHIEVEMENTS: `${STORAGE_PREFIX}achievements`,
    COMPLETED_LEVELS: `${STORAGE_PREFIX}completed-levels`,
    DAILY_CHALLENGES: `${STORAGE_PREFIX}daily-challenges`
};
/**
 * Check if localStorage is available
 */
export function isStorageAvailable() {
    try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Get item from localStorage with type safety
 */
export function getStorageItem(key, defaultValue) {
    if (!isStorageAvailable())
        return defaultValue;
    try {
        const item = localStorage.getItem(key);
        if (item === null)
            return defaultValue;
        return JSON.parse(item);
    }
    catch (error) {
        console.error(`Error reading from localStorage:`, error);
        return defaultValue;
    }
}
/**
 * Set item in localStorage
 */
export function setStorageItem(key, value) {
    if (!isStorageAvailable())
        return false;
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    catch (error) {
        console.error(`Error writing to localStorage:`, error);
        return false;
    }
}
/**
 * Remove item from localStorage
 */
export function removeStorageItem(key) {
    if (!isStorageAvailable())
        return false;
    try {
        localStorage.removeItem(key);
        return true;
    }
    catch (error) {
        console.error(`Error removing from localStorage:`, error);
        return false;
    }
}
/**
 * Clear all game data from localStorage
 */
export function clearAllGameData() {
    if (!isStorageAvailable())
        return false;
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        return true;
    }
    catch (error) {
        console.error(`Error clearing localStorage:`, error);
        return false;
    }
}
/**
 * Get high scores for all games
 */
export function getHighScores() {
    return getStorageItem(StorageKeys.HIGH_SCORES, {});
}
/**
 * Get high score for a specific game
 */
export function getHighScore(gameName) {
    const scores = getHighScores();
    return scores[gameName] || null;
}
/**
 * Save high score for a game
 */
export function saveHighScore(gameName, score) {
    const scores = getHighScores();
    scores[gameName] = score;
    return setStorageItem(StorageKeys.HIGH_SCORES, scores);
}
/**
 * Check if a score is a new high score
 */
export function isNewHighScore(gameName, score) {
    const currentHigh = getHighScore(gameName);
    return !currentHigh || score > currentHigh.score;
}
/**
 * Get game progress
 */
export function getGameProgress() {
    return getStorageItem(StorageKeys.GAME_PROGRESS, {
        gamesPlayed: {},
        highScores: {},
        achievements: [],
        totalPlayTime: 0
    });
}
/**
 * Update game progress
 */
export function updateGameProgress(updates) {
    const progress = getGameProgress();
    const updated = { ...progress, ...updates };
    return setStorageItem(StorageKeys.GAME_PROGRESS, updated);
}
/**
 * Increment games played counter
 */
export function incrementGamesPlayed(gameName) {
    const progress = getGameProgress();
    progress.gamesPlayed[gameName] = (progress.gamesPlayed[gameName] || 0) + 1;
    setStorageItem(StorageKeys.GAME_PROGRESS, progress);
}
/**
 * Get completed levels
 */
export function getCompletedLevels() {
    const levels = getStorageItem(StorageKeys.COMPLETED_LEVELS, []);
    return new Set(levels);
}
/**
 * Mark level as completed
 */
export function markLevelCompleted(levelId) {
    const completed = getCompletedLevels();
    completed.add(levelId);
    return setStorageItem(StorageKeys.COMPLETED_LEVELS, Array.from(completed));
}
/**
 * Check if level is completed
 */
export function isLevelCompleted(levelId) {
    const completed = getCompletedLevels();
    return completed.has(levelId);
}
/**
 * Get game settings
 */
export function getSettings() {
    return getStorageItem(StorageKeys.SETTINGS, {
        soundEnabled: true,
        musicEnabled: true,
        timerWarnings: true,
        autoAdvance: true,
        difficulty: 'normal'
    });
}
/**
 * Update settings
 */
export function updateSettings(settings) {
    const current = getSettings();
    const updated = { ...current, ...settings };
    return setStorageItem(StorageKeys.SETTINGS, updated);
}
/**
 * Get a specific setting value
 */
export function getSetting(key, defaultValue) {
    const settings = getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
}
/**
 * Set a specific setting value
 */
export function setSetting(key, value) {
    const settings = getSettings();
    settings[key] = value;
    return setStorageItem(StorageKeys.SETTINGS, settings);
}
/**
 * Export all game data as JSON
 */
export function exportGameData() {
    const data = {
        highScores: getHighScores(),
        progress: getGameProgress(),
        completedLevels: Array.from(getCompletedLevels()),
        settings: getSettings(),
        exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
}
/**
 * Import game data from JSON
 */
export function importGameData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        if (data.highScores) {
            setStorageItem(StorageKeys.HIGH_SCORES, data.highScores);
        }
        if (data.progress) {
            setStorageItem(StorageKeys.GAME_PROGRESS, data.progress);
        }
        if (data.completedLevels) {
            setStorageItem(StorageKeys.COMPLETED_LEVELS, data.completedLevels);
        }
        if (data.settings) {
            setStorageItem(StorageKeys.SETTINGS, data.settings);
        }
        return true;
    }
    catch (error) {
        console.error('Error importing game data:', error);
        return false;
    }
}
//# sourceMappingURL=storage.js.map