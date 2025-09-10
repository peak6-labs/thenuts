/**
 * Hand vs Hand - Compare two poker hands
 */

import { BaseGame } from '../BaseGame.js';
import type { GameScenario, GameConfig } from '../../types/games';
import * as Cards from '../../lib/cards.js';
import * as Random from '../../lib/random.js';
import { compareHandsWithSolver, getHandDescription } from '../../lib/pokersolver-wrapper.js';

interface HandVsHandScenario extends GameScenario {
  hand1: string[];
  hand2: string[];
  winner: 'hand1' | 'hand2' | 'tie';
}

export class HandVsHand extends BaseGame {
  protected containerId: string = 'game-container';
  protected scenarios: HandVsHandScenario[] = [];
  // Override base class currentScenario with more specific type
  protected declare currentScenario: GameScenario | null;

  constructor(config: Partial<GameConfig> = {}) {
    super({
      name: 'Hand vs Hand',
      difficulty: 'foundation',
      rounds: 10,
      timeLimit: 30,
      description: 'Compare two poker hands and determine the winner',
      instructions: ['Look at both hands', 'Determine which hand wins', 'Select your answer'],
      ...config
    });
  }

  protected generateScenarios(): GameScenario[] {
    const scenarios: HandVsHandScenario[] = [];
    const usedPairs = new Set<string>();
    
    // Use seeded random for consistent games
    Random.setSeed(Random.getHourlySeed());

    for (let i = 0; i < this.config.rounds; i++) {
      let scenario: HandVsHandScenario | null = null;
      let attempts = 0;
      
      while (!scenario && attempts < 50) {
        attempts++;
        
        // Generate two different 5-card hands
        const deck = Cards.generateDeck({ shuffled: true });
        const hand1 = deck.slice(0, 5);
        const hand2 = deck.slice(5, 10);
        
        // Evaluate hands using pokersolver
        const desc1 = getHandDescription(hand1);
        const desc2 = getHandDescription(hand2);
        
        // Create signature to avoid duplicates
        const signature = `${desc1}-${desc2}`;
        if (usedPairs.has(signature)) continue;
        
        usedPairs.add(signature);
        
        // Determine winner using pokersolver
        let winner: 'hand1' | 'hand2' | 'tie';
        let explanation: string;
        
        const comparison = compareHandsWithSolver(hand1, hand2);
        if (comparison > 0) {
          winner = 'hand1';
          explanation = `${desc1} beats ${desc2}`;
        } else if (comparison < 0) {
          winner = 'hand2';
          explanation = `${desc2} beats ${desc1}`;
        } else {
          winner = 'tie';
          explanation = `Both hands are ${desc1} - it's a tie!`;
        }
        
        scenario = {
          id: `hvh-${i}`,
          hand1,
          hand2,
          winner,
          choices: [
            { id: 'hand1', display: 'Hand 1 wins' },
            { id: 'hand2', display: 'Hand 2 wins' },
            { id: 'tie', display: "It's a tie" }
          ],
          correctAnswer: winner,
          explanation
        };
      }
      
      if (scenario) {
        scenarios.push(scenario);
      }
    }
    
    this.scenarios = scenarios;
    return scenarios;
  }

  protected renderScenario(): void {
    const scenario = this.scenarios[this.state.currentRound || 0] as HandVsHandScenario;
    if (!scenario) return;
    
    this.currentScenario = scenario;
    
    const container = this.container;
    if (!container) return;
    
    // Find or create game area
    let gameArea = container.querySelector('.game-area') as HTMLElement;
    if (!gameArea) {
      gameArea = document.createElement('div');
      gameArea.className = 'game-area';
      container.appendChild(gameArea);
    }
    
    gameArea.innerHTML = `
      <div class="hands-comparison">
        <div class="hand-display">
          <h3>Hand 1</h3>
          <div class="cards-row" id="hand1-cards"></div>
        </div>
        
        <div class="vs-divider">VS</div>
        
        <div class="hand-display">
          <h3>Hand 2</h3>
          <div class="cards-row" id="hand2-cards"></div>
        </div>
      </div>
      
      <div class="question">Which hand wins?</div>
      
      <div class="choice-buttons">
        <button class="choice-btn" data-choice="hand1">Hand 1 Wins</button>
        <button class="choice-btn" data-choice="tie">It's a Tie</button>
        <button class="choice-btn" data-choice="hand2">Hand 2 Wins</button>
      </div>
    `;
    
    // Render cards
    Cards.renderCards(scenario.hand1, 'hand1-cards', { width: 90, height: 130 });
    Cards.renderCards(scenario.hand2, 'hand2-cards', { width: 90, height: 130 });
    
    // Add event listeners
    const buttons = gameArea.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        if (choice) {
          this.handleAnswer(choice);
        }
      });
    });
  }

  protected handleAnswer(answerId: string): void {
    if (!this.currentScenario) return;
    
    const scenario = this.currentScenario as unknown as HandVsHandScenario;
    const isCorrect = answerId === scenario?.winner;
    
    // Update score
    if (isCorrect) {
      this.state.score++;
      this.state.streak++;
    } else {
      this.state.streak = 0;
    }
    
    // Show feedback
    this.showFeedback(isCorrect, answerId, scenario?.winner || '', this.currentScenario?.explanation || '');
    
    // Continue after delay
    setTimeout(() => {
      if (this.state.currentRound < this.config.rounds - 1) {
        this.state.currentRound++;
        this.renderScenario();
      } else {
        this.state.isComplete = true;
      }
    }, 3000);
  }

  private showFeedback(isCorrect: boolean, selected: string, correct: string, explanation: string): void {
    const gameArea = document.querySelector('.game-area');
    if (!gameArea) return;
    
    // Disable and style buttons
    const buttons = gameArea.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
      const button = btn as HTMLButtonElement;
      button.disabled = true;
      const choice = button.getAttribute('data-choice');
      
      // Highlight correct answer in green
      if (choice === correct) {
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        button.style.borderColor = '#4CAF50';
      }
      // If wrong, show selected in red
      else if (choice === selected && !isCorrect) {
        button.style.background = '#F44336';
        button.style.color = 'white';
        button.style.borderColor = '#F44336';
      }
    });
    
    // Show result message
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-message';
    resultDiv.style.cssText = `
      text-align: center;
      margin-top: 20px;
      padding: 15px;
      background: ${isCorrect ? '#E8F5E9' : '#FFEBEE'};
      border-radius: 8px;
      border: 2px solid ${isCorrect ? '#4CAF50' : '#F44336'};
    `;
    resultDiv.innerHTML = `
      <div style="font-size: 2em; margin-bottom: 10px;">${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</div>
      <div style="font-size: 1.1em; color: #333;">${explanation}</div>
    `;
    
    // Insert after the buttons
    const buttonContainer = gameArea.querySelector('.choice-buttons');
    if (buttonContainer && buttonContainer.parentNode) {
      buttonContainer.parentNode.insertBefore(resultDiv, buttonContainer.nextSibling);
    }
  }
  
  protected renderGame(): void {
    this.renderScenario();
  }
  
  protected checkAnswer(_userAnswer: string, _correctAnswer: string): boolean {
    // Handled in handleAnswer
    return false;
  }
  
  protected handleAnswerFeedback(_isCorrect: boolean): void {
    // Handled in showFeedback
  }
  
  getInstructions(): string {
    return "Compare two poker hands and determine which one wins. Remember the hand rankings!";
  }
}

// Add styles
export function getHandVsHandStyles(): string {
  return `
    .hands-comparison {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .hand-display {
      text-align: center;
    }
    
    .hand-display h3 {
      color: #7D1346;
      margin-bottom: 15px;
    }
    
    .cards-row {
      display: flex;
      justify-content: center;
      gap: 5px;
    }
    
    .vs-divider {
      font-size: 2em;
      font-weight: bold;
      color: #C73E9A;
      padding: 0 20px;
    }
    
    .question {
      text-align: center;
      font-size: 1.3em;
      margin: 20px 0;
      color: #333;
      font-weight: 600;
    }
    
    .choice-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
      flex-wrap: wrap;
    }
    
    .choice-btn {
      padding: 15px 30px;
      font-size: 1.1em;
      background: white;
      border: 2px solid #C73E9A;
      border-radius: 8px;
      color: #C73E9A;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 600;
    }
    
    .choice-btn:hover:not(:disabled) {
      background: #C73E9A;
      color: white;
      transform: translateY(-2px);
    }
    
    .choice-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .feedback {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      text-align: center;
      z-index: 100;
    }
    
    .feedback-icon {
      font-size: 3em;
      margin-bottom: 10px;
    }
    
    .feedback.correct .feedback-icon {
      color: #4CAF50;
    }
    
    .feedback.incorrect .feedback-icon {
      color: #F44336;
    }
    
    .feedback-text {
      font-size: 1.2em;
      color: #333;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .hands-comparison {
        flex-direction: column;
        gap: 20px;
      }
      
      .vs-divider {
        padding: 10px 0;
      }
    }
  `;
}