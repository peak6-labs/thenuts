/**
 * Refactored Base Game Class
 * Uses composition instead of inheritance for better modularity
 * Reduced from 423 lines to ~200 lines
 */
import { GameStateManager } from '../lib/game-state-manager.js';
import { GameResultsManager } from '../lib/game-results-manager.js';
import { GameUIManager } from '../lib/game-ui-manager.js';
import { getHourlySeed, setSeed, resetRandom } from '../lib/random.js';
export class BaseGame {
    constructor(config) {
        this.currentScenario = null;
        this.scenarios = [];
        this.container = null;
        this.config = config;
        this.stateManager = new GameStateManager(config);
        this.resultsManager = new GameResultsManager(config.name);
        this.uiManager = new GameUIManager(config);
    }
    // Simplified public interface
    get state() {
        return this.stateManager.getState();
    }
    initialize() {
        // Set up seeded random if needed
        if (this.shouldUseSeed()) {
            const seed = this.getSeed();
            setSeed(seed);
        }
        // Generate all scenarios upfront
        this.scenarios = this.generateScenarios();
        // Reset random state
        resetRandom();
        // Start tracking results
        this.resultsManager.startTracking();
    }
    start() {
        if (this.state.currentRound === 0) {
            this.initialize();
        }
        this.stateManager.resume();
        this.uiManager.startTimer();
        this.nextRound();
    }
    pause() {
        this.stateManager.pause();
        this.uiManager.pauseTimer();
    }
    resume() {
        this.stateManager.resume();
        this.uiManager.resumeTimer();
    }
    reset() {
        this.stateManager.reset();
        this.resultsManager.reset();
        this.uiManager.resetTimer();
        this.currentScenario = null;
        this.scenarios = [];
        this.initialize();
    }
    nextRound() {
        if (!this.stateManager.nextRound()) {
            this.endGame();
            return;
        }
        const state = this.state;
        this.currentScenario = this.scenarios[state.currentRound - 1];
        this.uiManager.updateScore(state.score, state.totalRounds, state.streak);
        this.renderScenario();
    }
    submitAnswer(answer) {
        if (!this.currentScenario || this.state.isPaused || this.state.isComplete) {
            return false;
        }
        const isCorrect = this.checkAnswer(answer, this.currentScenario.correctAnswer);
        const timeToAnswer = this.config.timeLimit ?
            this.config.timeLimit - this.uiManager.getTimerRemaining() : undefined;
        // Record answer
        this.resultsManager.recordAnswer(answer, isCorrect, timeToAnswer);
        // Update state
        if (isCorrect) {
            this.stateManager.incrementScore();
            this.uiManager.incrementScore();
        }
        else {
            this.stateManager.recordMistake();
            this.uiManager.resetStreak();
        }
        // Handle feedback
        this.handleAnswerFeedback(isCorrect, answer);
        // Auto-advance
        setTimeout(() => {
            if (!this.state.isPaused && !this.state.isComplete) {
                this.nextRound();
            }
        }, isCorrect ? 500 : 2000);
        return isCorrect;
    }
    endGame() {
        this.stateManager.complete();
        this.uiManager.stopTimer();
        const state = this.state;
        const result = this.resultsManager.calculateResult(state);
        // Save high score if applicable
        this.resultsManager.saveIfHighScore(state);
        this.resultsManager.recordGamePlayed();
        // Show results
        this.uiManager.showResults(result, () => {
            this.reset();
            this.start();
        }, () => {
            window.location.href = '/';
        });
    }
    getResult() {
        return this.resultsManager.calculateResult(this.state);
    }
    saveHighScore() {
        this.resultsManager.saveIfHighScore(this.state);
    }
    // GameModule interface implementation
    mount(container, state) {
        this.container = container;
        this.render(container);
        // Restore state if available and game not complete
        if (state && state.gameState && !state.gameState.isComplete) {
            this.deserialize(state);
        }
    }
    unmount() {
        this.destroy();
    }
    render(container) {
        // Reset state for a fresh game
        this.stateManager.reset();
        this.resultsManager.reset();
        this.scenarios = [];
        this.currentScenario = null;
        // Setup UI
        this.uiManager.setupUI(container, this.state, () => this.handleTimeUp());
        this.renderGame();
    }
    destroy() {
        this.uiManager.cleanup();
        this.container = null;
    }
    serialize() {
        return {
            gameState: this.stateManager.serialize(),
            currentRound: this.state.currentRound,
            score: this.state.score,
            streak: this.state.streak,
            bestStreak: this.state.bestStreak,
            scenarios: this.scenarios,
            currentScenario: this.currentScenario,
            ...this.resultsManager.serialize()
        };
    }
    deserialize(state) {
        if (state.gameState) {
            this.stateManager.deserialize(state.gameState);
        }
        if (state.answers || state.startTime) {
            this.resultsManager.deserialize({
                answers: state.answers || [],
                startTime: state.startTime || 0
            });
        }
        if (state.scenarios) {
            this.scenarios = state.scenarios;
        }
        if (state.currentScenario) {
            this.currentScenario = state.currentScenario;
        }
        // Update UI to reflect restored state
        const currentState = this.state;
        this.uiManager.updateScore(currentState.score, currentState.totalRounds, currentState.streak);
        if (currentState.timeRemaining) {
            this.uiManager.setTimerRemaining(currentState.timeRemaining);
        }
        // Re-render current scenario
        if (this.currentScenario) {
            this.renderScenario();
        }
    }
    handleTimeUp() {
        this.endGame();
    }
    // Optional methods
    shouldUseSeed() {
        return false;
    }
    getSeed() {
        return getHourlySeed();
    }
}
//# sourceMappingURL=BaseGame.js.map