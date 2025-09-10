/**
 * Game State Manager
 * Handles game state logic separately from BaseGame
 */

import type { GameState, GameConfig } from '../types/games.js';

export class GameStateManager {
  private state: GameState;
  private readonly config: GameConfig;
  
  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.createInitialState();
  }
  
  private createInitialState(): GameState {
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
  
  getState(): GameState {
    return { ...this.state };
  }
  
  setState(updates: Partial<GameState>): void {
    this.state = { ...this.state, ...updates };
  }
  
  reset(): void {
    this.state = this.createInitialState();
  }
  
  // Round management
  nextRound(): boolean {
    if (this.state.currentRound >= this.state.totalRounds) {
      this.state.isComplete = true;
      return false;
    }
    this.state.currentRound++;
    return true;
  }
  
  // Score management
  incrementScore(): void {
    this.state.score++;
    this.state.streak++;
    this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
  }
  
  recordMistake(): void {
    this.state.mistakes++;
    this.state.streak = 0;
  }
  
  // Pause management
  pause(): void {
    this.state.isPaused = true;
  }
  
  resume(): void {
    this.state.isPaused = false;
  }
  
  // Game completion
  complete(): void {
    this.state.isComplete = true;
  }
  
  isComplete(): boolean {
    return this.state.isComplete;
  }
  
  isPaused(): boolean {
    return this.state.isPaused;
  }
  
  // Serialization for router
  serialize(): GameState {
    return { ...this.state };
  }
  
  deserialize(state: GameState): void {
    this.state = { ...state };
  }
}