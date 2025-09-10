/**
 * Type definitions for game-related functionality
 */

import { Card, HoleCards, CommunityCards } from './cards';

export type GameDifficulty = 'foundation' | 'beginner' | 'intermediate' | 'advanced';
export type GameLevel = 'level1' | 'level2' | 'level3';

export interface GameConfig {
  name: string;
  difficulty: GameDifficulty;
  rounds: number;
  timeLimit?: number; // in seconds
  description: string;
  instructions: string[];
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  score: number;
  streak: number;
  bestStreak: number;
  timeRemaining?: number;
  isComplete: boolean;
  isPaused: boolean;
  mistakes: number;
}

export interface GameResult {
  score: number;
  totalRounds: number;
  accuracy: number;
  timeElapsed?: number;
  bestStreak: number;
  mistakes: number;
}

export interface PlayerAnswer {
  answer: any;
  isCorrect: boolean;
  timestamp: number;
  timeToAnswer?: number;
}

export interface GameScenario {
  id: string;
  question?: string;
  communityCards?: CommunityCards;
  holeCards?: HoleCards;
  choices: Choice[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface Choice {
  id: string;
  display?: string;
  text?: string;  // Alternative to display
  value?: any;
  hint?: string;
  cards?: Card[] | string[];
}

export interface HighScore {
  game: string;
  score: number;
  accuracy: number;
  date: string;
  timeElapsed?: number;
}

export interface GameProgress {
  gamesPlayed: Record<string, number>;
  highScores: Record<string, HighScore>;
  achievements: Achievement[];
  totalPlayTime: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface GameOptions {
  name: string;
  rounds: number;
  timeLimit?: number;
  description?: string;
}

export interface IGame {
  config: GameConfig;
  state: GameState;
  
  initialize(): void;
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  
  nextRound(): void;
  submitAnswer(answer: any): boolean;
  
  getResult(): GameResult;
  saveHighScore(): void;
  
  render(container: HTMLElement): void;
  destroy(): void;
}