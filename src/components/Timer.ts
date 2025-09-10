/**
 * Reusable timer component for games
 */

import type { TimerOptions } from '../types/ui.js';

export class Timer {
  private duration: number;
  private remaining: number;
  private startTime: number = 0;
  private intervalId: number | null = null;
  private isPaused: boolean = false;
  private pausedElapsedTime: number = 0;
  private pauseStartTime: number | null = null;
  private element: HTMLElement | null = null;
  private options: TimerOptions;

  constructor(options: TimerOptions) {
    this.options = {
      format: 'seconds',
      showWarning: true,
      warningThreshold: 10,
      allowPause: false,
      ...options
    };
    
    this.duration = options.duration;
    this.remaining = options.duration;
  }

  /**
   * Attach timer to a DOM element for display
   */
  attachTo(element: HTMLElement | string): void {
    this.element = typeof element === 'string' 
      ? document.getElementById(element) 
      : element;
      
    if (this.element && this.options.allowPause) {
      this.element.style.cursor = 'pointer';
      this.element.title = 'Click to pause/unpause';
      this.element.addEventListener('click', () => this.toggle());
    }
    
    this.updateDisplay();
  }

  /**
   * Start the timer
   */
  start(): void {
    if (this.intervalId) return;
    
    this.startTime = Date.now();
    this.intervalId = window.setInterval(() => this.tick(), 100);
    this.updateDisplay();
  }

  /**
   * Stop the timer
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Pause the timer
   */
  pause(): void {
    if (!this.isPaused && this.intervalId) {
      this.isPaused = true;
      this.pauseStartTime = Date.now();
      this.stop();
      
      if (this.element) {
        this.element.classList.add('paused');
      }
      
      this.updateDisplay();
    }
  }

  /**
   * Resume the timer
   */
  resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      
      if (this.pauseStartTime) {
        this.pausedElapsedTime += Date.now() - this.pauseStartTime;
        this.pauseStartTime = null;
      }
      
      if (this.element) {
        this.element.classList.remove('paused');
      }
      
      this.start();
    }
  }

  /**
   * Toggle between pause and resume
   */
  toggle(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Reset the timer
   */
  reset(): void {
    this.stop();
    this.remaining = this.duration;
    this.isPaused = false;
    this.pausedElapsedTime = 0;
    this.pauseStartTime = null;
    this.startTime = 0;
    
    if (this.element) {
      this.element.classList.remove('paused', 'warning', 'expired');
    }
    
    this.updateDisplay();
  }

  /**
   * Get remaining time in seconds
   */
  getRemaining(): number {
    return Math.max(0, this.remaining);
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsed(): number {
    if (!this.startTime) return 0;
    
    const now = this.isPaused && this.pauseStartTime ? this.pauseStartTime : Date.now();
    // Return elapsed time with decimal precision for smoother countdown
    return (now - this.startTime - this.pausedElapsedTime) / 1000;
  }

  /**
   * Check if timer has expired
   */
  isExpired(): boolean {
    return this.remaining <= 0;
  }

  /**
   * Internal tick function
   */
  private tick(): void {
    const elapsed = this.getElapsed();
    this.remaining = Math.max(0, this.duration - elapsed);
    
    if (this.options.onTick) {
      this.options.onTick(this.remaining);
    }
    
    this.updateDisplay();
    
    if (this.remaining <= 0) {
      this.stop();
      if (this.element) {
        this.element.classList.add('expired');
      }
      if (this.options.onComplete) {
        this.options.onComplete();
      }
    }
  }

  /**
   * Update the display element
   */
  private updateDisplay(): void {
    if (!this.element) return;
    
    const displayText = this.formatTime(this.remaining);
    const pauseIndicator = this.isPaused ? ' ⏸' : '';
    
    this.element.textContent = displayText + pauseIndicator;
    
    // Add warning class if threshold reached
    if (this.options.showWarning && 
        this.remaining <= this.options.warningThreshold! && 
        this.remaining > 0) {
      this.element.classList.add('warning');
    } else {
      this.element.classList.remove('warning');
    }
  }

  /**
   * Format time for display
   */
  private formatTime(seconds: number): string {
    if (this.options.format === 'mm:ss') {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
      return seconds.toFixed(1) + 's';
    }
  }

  /**
   * Destroy the timer
   */
  destroy(): void {
    this.stop();
    if (this.element) {
      this.element.classList.remove('paused', 'warning', 'expired');
      if (this.options.allowPause) {
        this.element.style.cursor = '';
        this.element.title = '';
      }
    }
  }
  
  /**
   * Set the remaining time (for restoring state)
   */
  setTimeRemaining(seconds: number): void {
    this.remaining = seconds;
    this.duration = seconds;
    this.updateDisplay();
  }
}

/**
 * Inject timer styles into document
 */
export function injectTimerStyles(): void {
  if (document.getElementById('timer-default-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'timer-default-styles';
  style.textContent = getTimerStyles();
  document.head.appendChild(style);
}

/**
 * Default timer styles
 */
export function getTimerStyles(): string {
  return `
    .timer-display {
      font-size: 22px;
      font-weight: 700;
      color: #333;
      min-width: 70px;
      display: inline-block;
      text-align: center;
      background: #f0f0f0;
      padding: 5px 10px;
      border-radius: 20px;
      transition: background 0.3s, color 0.3s;
    }
    
    .timer-display.warning {
      background: #FFEBEE;
      color: #D32F2F;
      animation: pulse 1s infinite;
    }
    
    .timer-display.expired {
      background: #D32F2F;
      color: white;
    }
    
    .timer-display.paused {
      background: #FFE0B2;
      color: #E65100;
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  `;
}