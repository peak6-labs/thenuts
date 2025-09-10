/**
 * Game Results Manager
 * Handles scoring, results, and high scores
 */

import type { GameResult, GameState } from '../types/games.js';
import { saveHighScore, isNewHighScore, incrementGamesPlayed } from './storage.js';

export class GameResultsManager {
  private answers: Array<{
    answer: any;
    isCorrect: boolean;
    timestamp: number;
    timeToAnswer?: number;
  }> = [];
  
  private startTime: number = 0;
  private gameName: string;
  
  constructor(gameName: string) {
    this.gameName = gameName;
  }
  
  startTracking(): void {
    this.startTime = Date.now();
    this.answers = [];
  }
  
  recordAnswer(answer: any, isCorrect: boolean, timeToAnswer?: number): void {
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
  
  calculateResult(state: GameState): GameResult {
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
  
  saveIfHighScore(state: GameState): boolean {
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
  
  recordGamePlayed(): void {
    incrementGamesPlayed(this.gameName);
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  
  getAccuracyPercent(result: GameResult): number {
    return Math.round(result.accuracy * 100);
  }
  
  reset(): void {
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
  
  deserialize(data: { answers: any[], startTime: number }) {
    this.answers = data.answers || [];
    this.startTime = data.startTime || 0;
  }
}