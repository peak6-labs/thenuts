/**
 * Reusable timer component for games
 */
import type { TimerOptions } from '../types/ui.js';
export declare class Timer {
    private duration;
    private remaining;
    private startTime;
    private intervalId;
    private isPaused;
    private pausedElapsedTime;
    private pauseStartTime;
    private element;
    private options;
    constructor(options: TimerOptions);
    /**
     * Attach timer to a DOM element for display
     */
    attachTo(element: HTMLElement | string): void;
    /**
     * Start the timer
     */
    start(): void;
    /**
     * Stop the timer
     */
    stop(): void;
    /**
     * Pause the timer
     */
    pause(): void;
    /**
     * Resume the timer
     */
    resume(): void;
    /**
     * Toggle between pause and resume
     */
    toggle(): void;
    /**
     * Reset the timer
     */
    reset(): void;
    /**
     * Get remaining time in seconds
     */
    getRemaining(): number;
    /**
     * Get elapsed time in seconds
     */
    getElapsed(): number;
    /**
     * Check if timer has expired
     */
    isExpired(): boolean;
    /**
     * Internal tick function
     */
    private tick;
    /**
     * Update the display element
     */
    private updateDisplay;
    /**
     * Format time for display
     */
    private formatTime;
    /**
     * Destroy the timer
     */
    destroy(): void;
    /**
     * Set the remaining time (for restoring state)
     */
    setTimeRemaining(seconds: number): void;
}
/**
 * Inject timer styles into document
 */
export declare function injectTimerStyles(): void;
/**
 * Default timer styles
 */
export declare function getTimerStyles(): string;
//# sourceMappingURL=Timer.d.ts.map