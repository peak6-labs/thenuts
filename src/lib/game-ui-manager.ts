/**
 * Game UI Manager
 * Handles UI setup, styles injection, and component lifecycle
 */

import { Timer } from '../components/Timer.js';
import { ScoreDisplay } from '../components/ScoreDisplay.js';
import { Modal, injectModalStyles } from '../components/Modal.js';
import { injectDefaultStyles as injectCardStyles } from './cards.js';
import { injectGameStyles } from './theme.js';
import type { GameConfig, GameState, GameResult } from '../types/games.js';

export interface UIComponents {
  timer: Timer | null;
  scoreDisplay: ScoreDisplay | null;
  container: HTMLElement | null;
  gameArea: HTMLElement | null;
}

export class GameUIManager {
  private components: UIComponents = {
    timer: null,
    scoreDisplay: null,
    container: null,
    gameArea: null
  };
  
  private config: GameConfig;
  
  constructor(config: GameConfig) {
    this.config = config;
  }
  
  setupUI(container: HTMLElement, state: GameState, onTimeUp: () => void): UIComponents {
    // Inject all necessary styles
    injectCardStyles();
    injectModalStyles();
    injectGameStyles();
    
    // Clear existing content
    container.innerHTML = '';
    
    // Clean up existing instances
    this.cleanup();
    
    // Store container reference
    this.components.container = container;
    
    // Create header with score and timer
    const header = document.createElement('div');
    header.className = 'game-header';
    
    // Add score display
    this.components.scoreDisplay = new ScoreDisplay({
      current: state.score,
      total: state.totalRounds,
      showStreak: true,
      streak: state.streak
    });
    header.appendChild(this.components.scoreDisplay.getElement());
    
    // Add timer if time limit is set
    if (this.config.timeLimit) {
      this.components.timer = new Timer({
        duration: this.config.timeLimit,
        onComplete: onTimeUp,
        allowPause: true
      });
      
      const timerEl = document.createElement('div');
      timerEl.id = 'game-timer';
      timerEl.className = 'timer-display';
      header.appendChild(timerEl);
      
      this.components.timer.attachTo(timerEl);
    }
    
    container.appendChild(header);
    
    // Create game area
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area';
    gameArea.id = 'game-area';
    container.appendChild(gameArea);
    this.components.gameArea = gameArea;
    
    return this.components;
  }
  
  updateScore(score: number, total: number, streak: number): void {
    if (this.components.scoreDisplay) {
      this.components.scoreDisplay.update({
        current: score,
        total,
        streak
      });
    }
  }
  
  incrementScore(): void {
    if (this.components.scoreDisplay) {
      this.components.scoreDisplay.incrementScore();
    }
  }
  
  resetStreak(): void {
    if (this.components.scoreDisplay) {
      this.components.scoreDisplay.resetStreak();
    }
  }
  
  startTimer(): void {
    if (this.components.timer) {
      this.components.timer.start();
    }
  }
  
  pauseTimer(): void {
    if (this.components.timer) {
      this.components.timer.pause();
    }
  }
  
  resumeTimer(): void {
    if (this.components.timer) {
      this.components.timer.resume();
    }
  }
  
  resetTimer(): void {
    if (this.components.timer) {
      this.components.timer.reset();
    }
  }
  
  stopTimer(): void {
    if (this.components.timer) {
      this.components.timer.stop();
    }
  }
  
  getTimerRemaining(): number {
    return this.components.timer ? this.components.timer.getRemaining() : 0;
  }
  
  setTimerRemaining(time: number): void {
    if (this.components.timer) {
      this.components.timer.setTimeRemaining(time);
    }
  }
  
  showResults(result: GameResult, onPlayAgain: () => void, onMainMenu: () => void): void {
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
          onClick: onPlayAgain,
          isPrimary: true
        },
        {
          text: 'Main Menu',
          onClick: onMainMenu
        }
      ]
    });
    
    modal.open();
  }
  
  getGameArea(): HTMLElement | null {
    return this.components.gameArea;
  }
  
  cleanup(): void {
    if (this.components.timer) {
      this.components.timer.destroy();
      this.components.timer = null;
    }
    
    if (this.components.scoreDisplay) {
      this.components.scoreDisplay.destroy();
      this.components.scoreDisplay = null;
    }
    
    if (this.components.container) {
      this.components.container.innerHTML = '';
      this.components.container = null;
    }
    
    this.components.gameArea = null;
  }
  
  getComponents(): UIComponents {
    return this.components;
  }
}