/**
 * Shared theme and styles for Poker Power branding
 */

export const THEME = {
  colors: {
    primary: '#7D1346',
    primaryDark: '#4a0e2d',
    secondary: '#C73E9A',
    secondaryLight: '#FF6EC7',
    accent: '#ffb3d9',
    text: '#333',
    textLight: '#666',
    white: '#ffffff',
    background: 'linear-gradient(135deg, #7D1346 0%, #4a0e2d 100%)',
    buttonGradient: 'linear-gradient(135deg, #FF6EC7 0%, #C73E9A 100%)',
    buttonHover: 'linear-gradient(135deg, #C73E9A 0%, #FF6EC7 100%)'
  }
};

export function injectGameStyles(): void {
  if (document.getElementById('game-theme-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'game-theme-styles';
  style.textContent = getGameStyles();
  document.head.appendChild(style);
}

export function showLoadingScreen(container: HTMLElement, message: string = 'Loading game...'): void {
  container.innerHTML = `
    <div class="game-loading">
      <div class="loading-spinner">
        <div class="loading-card"></div>
        <div class="loading-card"></div>
        <div class="loading-card"></div>
        <div class="loading-card"></div>
      </div>
      <div class="loading-text">${message}</div>
      <div class="loading-subtext">Shuffling the deck...</div>
    </div>
  `;
}

export function getGameStyles(): string {
  return `
    /* Loading screen styles */
    .game-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: ${THEME.colors.primary};
    }
    
    .loading-spinner {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      position: relative;
    }
    
    .loading-card {
      position: absolute;
      width: 40px;
      height: 56px;
      background: linear-gradient(135deg, ${THEME.colors.secondary}, ${THEME.colors.secondaryLight});
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: shuffleCards 2s infinite ease-in-out;
    }
    
    .loading-card:nth-child(1) {
      animation-delay: 0s;
      transform-origin: center bottom;
    }
    
    .loading-card:nth-child(2) {
      animation-delay: 0.2s;
      transform-origin: center bottom;
    }
    
    .loading-card:nth-child(3) {
      animation-delay: 0.4s;
      transform-origin: center bottom;
    }
    
    .loading-card:nth-child(4) {
      animation-delay: 0.6s;
      transform-origin: center bottom;
    }
    
    @keyframes shuffleCards {
      0%, 100% {
        transform: rotate(0deg) translateX(0);
        opacity: 0.8;
      }
      25% {
        transform: rotate(-15deg) translateX(-20px);
        opacity: 1;
      }
      50% {
        transform: rotate(0deg) translateX(0) translateY(-10px);
        opacity: 1;
      }
      75% {
        transform: rotate(15deg) translateX(20px);
        opacity: 1;
      }
    }
    
    .loading-text {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 10px;
      animation: pulse 1.5s infinite ease-in-out;
    }
    
    .loading-subtext {
      font-size: 14px;
      color: ${THEME.colors.textLight};
      animation: fadeInOut 2s infinite ease-in-out;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.8;
      }
      50% {
        opacity: 1;
      }
    }
    
    @keyframes fadeInOut {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
    
    /* Game container styles */
    .game-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    /* Choice buttons with Poker Power colors */
    .choice-btn {
      background: ${THEME.colors.buttonGradient};
      color: white;
      border: none;
      padding: 12px 24px;
      margin: 5px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .choice-btn:hover:not(:disabled) {
      background: ${THEME.colors.buttonHover};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .choice-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .choice-btn.correct {
      background: linear-gradient(135deg, #4caf50, #66bb6a);
    }
    
    .choice-btn.incorrect {
      background: linear-gradient(135deg, #f44336, #ef5350);
    }
    
    /* Score display */
    .score-display {
      background: rgba(125, 19, 70, 0.1);
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      color: ${THEME.colors.primary};
    }
    
    /* Timer with warning states */
    .timer-display {
      background: rgba(125, 19, 70, 0.1);
      color: ${THEME.colors.primary};
      font-weight: 700;
    }
    
    .timer-display.warning {
      background: #FFEBEE;
      color: #D32F2F;
    }
    
    /* Headers and text */
    h1, h2, h3 {
      color: ${THEME.colors.primary};
    }
    
    .question {
      color: ${THEME.colors.text};
      font-size: 18px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    
    /* Level badges */
    .level-badge {
      background: ${THEME.colors.buttonGradient};
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      display: inline-block;
    }
    
    /* Feedback messages */
    .feedback {
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      font-weight: 600;
      text-align: center;
    }
    
    .feedback.correct {
      background: #e8f5e9;
      color: #2e7d32;
      border: 2px solid #4caf50;
    }
    
    .feedback.incorrect {
      background: #ffebee;
      color: #c62828;
      border: 2px solid #f44336;
    }
    
    /* Card selection */
    .card.selected {
      border: 3px solid ${THEME.colors.secondary};
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(199, 62, 154, 0.3);
    }
    
    /* Next button */
    .next-btn {
      background: ${THEME.colors.buttonGradient};
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 20px auto;
      display: block;
    }
    
    .next-btn:hover {
      background: ${THEME.colors.buttonHover};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    /* VS divider for Hand vs Hand */
    .vs-divider {
      font-size: 24px;
      font-weight: 700;
      color: ${THEME.colors.primary};
      margin: 0 20px;
      align-self: center;
    }
    
    /* Hand display sections */
    .hand-display {
      text-align: center;
      padding: 20px;
      background: rgba(125, 19, 70, 0.05);
      border-radius: 8px;
      margin: 10px;
    }
    
    .hand-display h3 {
      margin-bottom: 15px;
      color: ${THEME.colors.primary};
    }
  `;
}