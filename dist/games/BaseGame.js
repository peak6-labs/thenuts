/**
 * Base class for all poker training games
 */
import { Timer } from '../components/Timer.js';
import { ScoreDisplay } from '../components/ScoreDisplay.js';
import { Modal, injectModalStyles } from '../components/Modal.js';
import { saveHighScore, isNewHighScore, incrementGamesPlayed } from '../lib/storage.js';
import { getHourlySeed, setSeed, resetRandom } from '../lib/random.js';
import { injectDefaultStyles as injectCardStyles } from '../lib/cards.js';
import { injectGameStyles } from '../lib/theme.js';
export class BaseGame {
    constructor(config) {
        this.container = null;
        this.timer = null;
        this.scoreDisplay = null;
        this.currentScenario = null;
        this.scenarios = [];
        this.answers = [];
        this.startTime = 0;
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
        this.startTime = Date.now();
    }
    start() {
        if (this.state.currentRound === 0) {
            this.initialize();
        }
        this.state.isPaused = false;
        if (this.timer) {
            this.timer.start();
        }
        this.nextRound();
    }
    pause() {
        this.state.isPaused = true;
        if (this.timer) {
            this.timer.pause();
        }
    }
    resume() {
        this.state.isPaused = false;
        if (this.timer) {
            this.timer.resume();
        }
    }
    reset() {
        this.state = this.createInitialState();
        this.answers = [];
        this.currentScenario = null;
        this.scenarios = [];
        if (this.timer) {
            this.timer.reset();
        }
        if (this.scoreDisplay) {
            this.scoreDisplay.reset();
        }
        this.initialize();
    }
    nextRound() {
        if (this.state.currentRound >= this.state.totalRounds) {
            this.endGame();
            return;
        }
        this.state.currentRound++;
        this.currentScenario = this.scenarios[this.state.currentRound - 1];
        if (this.scoreDisplay) {
            this.scoreDisplay.update({
                current: this.state.score,
                total: this.state.totalRounds,
                streak: this.state.streak
            });
        }
        this.renderScenario();
    }
    submitAnswer(answer) {
        if (!this.currentScenario || this.state.isPaused || this.state.isComplete) {
            return false;
        }
        const isCorrect = this.checkAnswer(answer, this.currentScenario.correctAnswer);
        this.answers.push({
            answer,
            isCorrect,
            timestamp: Date.now(),
            timeToAnswer: this.timer ? this.config.timeLimit - this.timer.getRemaining() : undefined
        });
        if (isCorrect) {
            this.state.score++;
            this.state.streak++;
            this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
            if (this.scoreDisplay) {
                this.scoreDisplay.incrementScore();
            }
        }
        else {
            this.state.streak = 0;
            this.state.mistakes++;
            if (this.scoreDisplay) {
                this.scoreDisplay.resetStreak();
            }
        }
        this.handleAnswerFeedback(isCorrect, answer);
        // Auto-advance after a delay
        setTimeout(() => {
            if (!this.state.isPaused && !this.state.isComplete) {
                this.nextRound();
            }
        }, isCorrect ? 500 : 2000);
        return isCorrect;
    }
    endGame() {
        this.state.isComplete = true;
        if (this.timer) {
            this.timer.stop();
        }
        const result = this.getResult();
        // Save high score
        if (isNewHighScore(this.config.name, result.score)) {
            this.saveHighScore();
        }
        // Update games played counter
        incrementGamesPlayed(this.config.name);
        // Show results
        this.showResults(result);
    }
    getResult() {
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        return {
            score: this.state.score,
            totalRounds: this.state.totalRounds,
            accuracy: this.state.totalRounds > 0 ? this.state.score / this.state.totalRounds : 0,
            timeElapsed,
            bestStreak: this.state.bestStreak,
            mistakes: this.state.mistakes
        };
    }
    saveHighScore() {
        const result = this.getResult();
        saveHighScore(this.config.name, {
            game: this.config.name,
            score: result.score,
            accuracy: result.accuracy,
            date: new Date().toISOString(),
            timeElapsed: result.timeElapsed
        });
    }
    render(container) {
        // Reset state for a fresh game
        this.state = this.createInitialState();
        this.scenarios = [];
        this.answers = [];
        this.currentScenario = null;
        this.container = container;
        this.setupUI();
        this.renderGame();
    }
    destroy() {
        if (this.timer) {
            this.timer.destroy();
            this.timer = null;
        }
        if (this.scoreDisplay) {
            this.scoreDisplay.destroy();
            this.scoreDisplay = null;
        }
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
    }
    // GameModule interface implementation
    mount(container, state) {
        this.render(container);
        // If we have saved state, restore it after rendering
        // But if the game was complete, don't restore - start fresh
        if (state && state.gameState && !state.gameState.isComplete) {
            this.deserialize(state);
        }
    }
    unmount() {
        this.destroy();
    }
    serialize() {
        return {
            gameState: this.state,
            currentRound: this.state.currentRound,
            score: this.state.score,
            streak: this.state.streak,
            bestStreak: this.state.bestStreak,
            answers: this.answers,
            scenarios: this.scenarios,
            currentScenario: this.currentScenario,
            startTime: this.startTime
        };
    }
    deserialize(state) {
        if (state.gameState) {
            this.state = state.gameState;
        }
        if (state.answers) {
            this.answers = state.answers;
        }
        if (state.scenarios) {
            this.scenarios = state.scenarios;
        }
        if (state.currentScenario) {
            this.currentScenario = state.currentScenario;
        }
        if (state.startTime) {
            this.startTime = state.startTime;
        }
        // Update UI to reflect restored state
        if (this.scoreDisplay) {
            this.scoreDisplay.update({
                current: this.state.score,
                total: this.state.totalRounds,
                streak: this.state.streak
            });
        }
        // Restore timer if needed
        if (this.timer && this.state.timeRemaining) {
            this.timer.setTimeRemaining(this.state.timeRemaining);
        }
        // Re-render current scenario
        if (this.currentScenario) {
            this.renderScenario();
        }
    }
    setupUI() {
        if (!this.container)
            return;
        // Inject all necessary styles
        injectCardStyles();
        injectModalStyles();
        injectGameStyles();
        // Clear existing content first
        this.container.innerHTML = '';
        // Clean up existing instances
        if (this.timer) {
            this.timer.destroy();
            this.timer = null;
        }
        if (this.scoreDisplay) {
            this.scoreDisplay.destroy();
            this.scoreDisplay = null;
        }
        // Create header with score and timer
        const header = document.createElement('div');
        header.className = 'game-header';
        // Add score display
        this.scoreDisplay = new ScoreDisplay({
            current: this.state.score,
            total: this.state.totalRounds,
            showStreak: true,
            streak: this.state.streak
        });
        header.appendChild(this.scoreDisplay.getElement());
        // Add timer if time limit is set
        if (this.config.timeLimit) {
            this.timer = new Timer({
                duration: this.config.timeLimit,
                onComplete: () => this.handleTimeUp(),
                allowPause: true
            });
            const timerEl = document.createElement('div');
            timerEl.id = 'game-timer';
            timerEl.className = 'timer-display';
            header.appendChild(timerEl);
            this.timer.attachTo(timerEl);
        }
        this.container.appendChild(header);
        // Create game area
        const gameArea = document.createElement('div');
        gameArea.className = 'game-area';
        gameArea.id = 'game-area';
        this.container.appendChild(gameArea);
    }
    handleTimeUp() {
        this.endGame();
    }
    showResults(result) {
        const accuracyPercent = Math.round(result.accuracy * 100);
        const modal = new Modal({
            title: 'Game Complete!',
            content: `
        <div class="results-content">
          <h3>Score: ${result.score}/${result.totalRounds}</h3>
          <p>Accuracy: ${accuracyPercent}%</p>
          <p>Best Streak: ${result.bestStreak}</p>
          ${result.timeElapsed ? `<p>Time: ${Math.floor(result.timeElapsed / 60)}:${(result.timeElapsed % 60).toString().padStart(2, '0')}</p>` : ''}
        </div>
      `,
            buttons: [
                {
                    text: 'Play Again',
                    onClick: () => {
                        this.reset();
                        this.start();
                    },
                    isPrimary: true
                },
                {
                    text: 'Main Menu',
                    onClick: () => {
                        window.location.href = '/';
                    }
                }
            ]
        });
        modal.open();
    }
    // Optional methods that can be overridden
    shouldUseSeed() {
        return false; // Override if you want deterministic scenarios
    }
    getSeed() {
        return getHourlySeed();
    }
}
//# sourceMappingURL=BaseGame.js.map