/**
 * Game Results Manager
 * Handles scoring, results, and high scores
 */
import { saveHighScore, isNewHighScore, incrementGamesPlayed } from './storage.js';
export class GameResultsManager {
    constructor(gameName) {
        this.answers = [];
        this.startTime = 0;
        this.gameName = gameName;
    }
    startTracking() {
        this.startTime = Date.now();
        this.answers = [];
    }
    recordAnswer(answer, isCorrect, timeToAnswer) {
        this.answers.push({
            answer,
            isCorrect,
            timestamp: Date.now(),
            timeToAnswer
        });
    }
    getAnswers() {
        return [...this.answers];
    }
    calculateResult(state) {
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        return {
            score: state.score,
            totalRounds: state.totalRounds,
            accuracy: state.totalRounds > 0 ? state.score / state.totalRounds : 0,
            timeElapsed,
            bestStreak: state.bestStreak,
            mistakes: state.mistakes
        };
    }
    saveIfHighScore(state) {
        const result = this.calculateResult(state);
        if (isNewHighScore(this.gameName, result.score)) {
            saveHighScore(this.gameName, {
                game: this.gameName,
                score: result.score,
                accuracy: result.accuracy,
                date: new Date().toISOString(),
                timeElapsed: result.timeElapsed
            });
            return true;
        }
        return false;
    }
    recordGamePlayed() {
        incrementGamesPlayed(this.gameName);
    }
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    getAccuracyPercent(result) {
        return Math.round(result.accuracy * 100);
    }
    reset() {
        this.answers = [];
        this.startTime = 0;
    }
    // Serialization support
    serialize() {
        return {
            answers: this.answers,
            startTime: this.startTime
        };
    }
    deserialize(data) {
        this.answers = data.answers || [];
        this.startTime = data.startTime || 0;
    }
}
//# sourceMappingURL=game-results-manager.js.map