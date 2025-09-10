/**
 * Refactored Base Game Class
 * Uses composition instead of inheritance for better modularity
 * Reduced from 423 lines to ~200 lines
 */

import type { IGame, GameConfig, GameState, GameResult, GameScenario } from '../types/games.js';
import type { GameModule, GameState as RouterGameState } from '../types/router.js';
import { GameStateManager } from '../lib/game-state-manager.js';
import { GameResultsManager } from '../lib/game-results-manager.js';
import { GameUIManager } from '../lib/game-ui-manager.js';
import { getHourlySeed, setSeed, resetRandom } from '../lib/random.js';

export abstract class BaseGameRefactored implements IGame, GameModule {
  protected config: GameConfig;
  protected stateManager: GameStateManager;
  protected resultsManager: GameResultsManager;
  protected uiManager: GameUIManager;
  
  protected currentScenario: GameScenario | null = null;
  protected scenarios: GameScenario[] = [];
  protected container: HTMLElement | null = null;
  
  constructor(config: GameConfig) {
    this.config = config;
    this.stateManager = new GameStateManager(config);
    this.resultsManager = new GameResultsManager(config.name);
    this.uiManager = new GameUIManager(config);
  }
  
  // Simplified public interface
  get state(): GameState {
    return this.stateManager.getState();
  }
  
  initialize(): void {
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
  
  start(): void {
    if (this.state.currentRound === 0) {
      this.initialize();
    }
    
    this.stateManager.resume();
    this.uiManager.startTimer();
    this.nextRound();
  }
  
  pause(): void {
    this.stateManager.pause();
    this.uiManager.pauseTimer();
  }
  
  resume(): void {
    this.stateManager.resume();
    this.uiManager.resumeTimer();
  }
  
  reset(): void {
    this.stateManager.reset();
    this.resultsManager.reset();
    this.uiManager.resetTimer();
    this.currentScenario = null;
    this.scenarios = [];
    this.initialize();
  }
  
  nextRound(): void {
    if (!this.stateManager.nextRound()) {
      this.endGame();
      return;
    }
    
    const state = this.state;
    this.currentScenario = this.scenarios[state.currentRound - 1];
    
    this.uiManager.updateScore(state.score, state.totalRounds, state.streak);
    this.renderScenario();
  }
  
  submitAnswer(answer: any): boolean {
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
    } else {
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
  
  protected endGame(): void {
    this.stateManager.complete();
    this.uiManager.stopTimer();
    
    const state = this.state;
    const result = this.resultsManager.calculateResult(state);
    
    // Save high score if applicable
    this.resultsManager.saveIfHighScore(state);
    this.resultsManager.recordGamePlayed();
    
    // Show results
    this.uiManager.showResults(
      result,
      () => {
        this.reset();
        this.start();
      },
      () => {
        window.location.href = '/';
      }
    );
  }
  
  getResult(): GameResult {
    return this.resultsManager.calculateResult(this.state);
  }
  
  saveHighScore(): void {
    this.resultsManager.saveIfHighScore(this.state);
  }
  
  // GameModule interface implementation
  mount(container: HTMLElement, state?: RouterGameState): void {
    this.container = container;
    this.render(container);
    
    // Restore state if available and game not complete
    if (state && state.gameState && !state.gameState.isComplete) {
      this.deserialize(state);
    }
  }
  
  unmount(): void {
    this.destroy();
  }
  
  render(container: HTMLElement): void {
    // Reset state for a fresh game
    this.stateManager.reset();
    this.resultsManager.reset();
    this.scenarios = [];
    this.currentScenario = null;
    
    // Setup UI
    this.uiManager.setupUI(
      container, 
      this.state,
      () => this.handleTimeUp()
    );
    
    this.renderGame();
  }
  
  destroy(): void {
    this.uiManager.cleanup();
    this.container = null;
  }
  
  serialize(): RouterGameState {
    return {
      gameState: this.stateManager.serialize(),
      currentRound: this.state.currentRound,
      score: this.state.score,
      streak: this.state.streak,
      bestStreak: this.state.bestStreak,
      answers: this.resultsManager.getAnswers(),
      scenarios: this.scenarios,
      currentScenario: this.currentScenario,
      ...this.resultsManager.serialize()
    };
  }
  
  deserialize(state: RouterGameState): void {
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
    this.uiManager.updateScore(
      currentState.score,
      currentState.totalRounds,
      currentState.streak
    );
    
    if (currentState.timeRemaining) {
      this.uiManager.setTimerRemaining(currentState.timeRemaining);
    }
    
    // Re-render current scenario
    if (this.currentScenario) {
      this.renderScenario();
    }
  }
  
  protected handleTimeUp(): void {
    this.endGame();
  }
  
  // Abstract methods that must be implemented by subclasses
  protected abstract generateScenarios(): GameScenario[];
  protected abstract renderScenario(): void;
  protected abstract renderGame(): void;
  protected abstract checkAnswer(answer: any, correctAnswer: any): boolean;
  protected abstract handleAnswerFeedback(isCorrect: boolean, answer: any): void;
  
  // Optional methods
  protected shouldUseSeed(): boolean {
    return false;
  }
  
  protected getSeed(): number {
    return getHourlySeed();
  }
}