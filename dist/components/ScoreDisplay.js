/**
 * Score display component for games
 */
export class ScoreDisplay {
    constructor(options) {
        this.options = {
            showStreak: false,
            showAccuracy: false,
            ...options
        };
        this.element = this.createElement();
        this.update(); // Initialize the display
    }
    createElement() {
        const container = document.createElement('div');
        container.className = `score-display ${this.options.className || ''}`;
        return container;
    }
    update(updates) {
        if (updates) {
            this.options = { ...this.options, ...updates };
        }
        const parts = [
            `<span class="score-current">${this.options.current}</span>`,
            '/',
            `<span class="score-total">${this.options.total}</span>`
        ];
        if (this.options.showStreak && this.options.streak !== undefined) {
            parts.push(`<span class="score-streak">Streak: ${this.options.streak}</span>`);
        }
        if (this.options.showAccuracy && this.options.accuracy !== undefined) {
            const accuracyPercent = Math.round(this.options.accuracy * 100);
            parts.push(`<span class="score-accuracy">${accuracyPercent}%</span>`);
        }
        if (this.element) {
            this.element.innerHTML = parts.join(' ');
        }
    }
    incrementScore() {
        this.options.current++;
        if (this.options.streak !== undefined) {
            this.options.streak++;
        }
        this.updateAccuracy();
        this.update();
    }
    resetStreak() {
        if (this.options.streak !== undefined) {
            this.options.streak = 0;
            this.update();
        }
    }
    updateAccuracy() {
        if (this.options.showAccuracy && this.options.total > 0) {
            this.options.accuracy = this.options.current / this.options.total;
        }
    }
    attachTo(parent) {
        const parentEl = typeof parent === 'string'
            ? document.getElementById(parent)
            : parent;
        if (parentEl) {
            parentEl.appendChild(this.element);
        }
        else if (typeof parent === 'object' && parent) {
            // If parent is an HTMLElement but not in DOM yet
            parent.appendChild(this.element);
        }
    }
    getElement() {
        return this.element;
    }
    reset() {
        this.options.current = 0;
        this.options.streak = 0;
        this.options.accuracy = 0;
        this.update();
    }
    destroy() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
/**
 * Inject score display styles into document
 */
export function injectScoreDisplayStyles() {
    if (document.getElementById('score-display-default-styles'))
        return;
    const style = document.createElement('style');
    style.id = 'score-display-default-styles';
    style.textContent = getScoreDisplayStyles();
    document.head.appendChild(style);
}
/**
 * Default score display styles
 */
export function getScoreDisplayStyles() {
    return `
    .score-display {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #f8f8f8;
      padding: 8px 15px;
      border-radius: 20px;
    }
    
    .score-current {
      color: #C73E9A;
      font-size: 1.1em;
    }
    
    .score-total {
      color: #666;
    }
    
    .score-streak {
      margin-left: 10px;
      padding-left: 10px;
      border-left: 2px solid #ddd;
      color: #7D1346;
    }
    
    .score-accuracy {
      margin-left: 10px;
      padding-left: 10px;
      border-left: 2px solid #ddd;
      color: #666;
    }
  `;
}
//# sourceMappingURL=ScoreDisplay.js.map