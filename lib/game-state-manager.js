/**
 * Game State Manager
 * Handles game state logic separately from BaseGame
 */
export class GameStateManager {
    constructor(config) {
        this.config = config;
        this.state = this.createInitialState();
    }
    createInitialState() {
        return {
            currentRound: 0,
            totalRounds: this.config.rounds,
            score: 0,
            streak: 0,
            bestStreak: 0,
            timeRemaining: this.config.timeLimit,
            isComplete: false,
            isPaused: false,
            mistakes: 0
        };
    }
    getState() {
        return { ...this.state };
    }
    setState(updates) {
        this.state = { ...this.state, ...updates };
    }
    reset() {
        this.state = this.createInitialState();
    }
    // Round management
    nextRound() {
        if (this.state.currentRound >= this.state.totalRounds) {
            this.state.isComplete = true;
            return false;
        }
        this.state.currentRound++;
        return true;
    }
    // Score management
    incrementScore() {
        this.state.score++;
        this.state.streak++;
        this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
    }
    recordMistake() {
        this.state.mistakes++;
        this.state.streak = 0;
    }
    // Pause management
    pause() {
        this.state.isPaused = true;
    }
    resume() {
        this.state.isPaused = false;
    }
    // Game completion
    complete() {
        this.state.isComplete = true;
    }
    isComplete() {
        return this.state.isComplete;
    }
    isPaused() {
        return this.state.isPaused;
    }
    // Serialization for router
    serialize() {
        return { ...this.state };
    }
    deserialize(state) {
        this.state = { ...state };
    }
}
//# sourceMappingURL=game-state-manager.js.map