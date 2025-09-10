/**
 * Best Five from Seven - Select the best 5-card hand from 7 cards
 */

import { BaseGame } from '../BaseGame.js';
import type { GameScenario, GameConfig } from '../../types/games';
import * as Cards from '../../lib/cards.js';
import * as Random from '../../lib/random.js';
import { findBestHand, getHandDescription } from '../../lib/pokersolver-wrapper.js';

interface BestFiveScenario extends GameScenario {
  allCards: string[];
  bestHand: string[];
  handName: string;
  possibleHands: string[][];
}

export class BestFiveFromSeven extends BaseGame {
  protected containerId: string = 'game-container';
  protected scenarios: BestFiveScenario[] = [];
  // Override base class currentScenario with more specific type
  protected declare currentScenario: GameScenario | null;
  private selectedCards: Set<string> = new Set();

  constructor(config: Partial<GameConfig> = {}) {
    super({
      name: 'Best Five from Seven',
      difficulty: 'foundation',
      rounds: 10,
      timeLimit: 45,
      description: 'Select the best 5-card hand from 7 cards',
      instructions: ['Look at all 7 cards', 'Click to select 5 cards', 'Submit your selection'],
      ...config
    });
  }

  protected generateScenarios(): GameScenario[] {
    const scenarios: BestFiveScenario[] = [];
    
    // Use seeded random for consistent games
    Random.setSeed(Random.getHourlySeed() + 100);

    // Ensure variety of hand types (not used currently)
    // const _targetHands = [
    //   'straight-flush', 'four-of-a-kind', 'full-house', 
    //   'flush', 'straight', 'three-of-a-kind',
    //   'two-pair', 'pair', 'high-card', 'flush'
    // ];

    for (let i = 0; i < this.config.rounds; i++) {
      let scenario: BestFiveScenario | null = null;
      let attempts = 0;
      
      while (!scenario && attempts < 100) {
        attempts++;
        
        // Generate 7 cards (like Texas Hold'em)
        const deck = Cards.generateDeck({ shuffled: true });
        const sevenCards = deck.slice(0, 7);
        
        // Find the best 5-card hand from the 7 cards using pokersolver
        const bestHandResult = findBestHand(sevenCards);
        
        // Skip if hand is too weak (high card) after first few rounds
        if (bestHandResult.description.includes('High Card') && i > 3) continue;
        
        scenario = {
          id: `bf7-${i}`,
          allCards: sevenCards,
          bestHand: bestHandResult.cards,
          handName: bestHandResult.description,
          possibleHands: [], // Not used anymore
          choices: [], // Will be the cards themselves
          correctAnswer: bestHandResult.cards.sort().join(','),
          explanation: `The best hand is ${bestHandResult.description}`
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
    const scenario = this.scenarios[this.state.currentRound || 0] as BestFiveScenario;
    if (!scenario) return;
    
    this.currentScenario = scenario;
    this.selectedCards.clear();
    
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
      <div class="instructions">
        Select the best 5-card poker hand from these 7 cards
      </div>
      
      <div class="seven-cards" id="seven-cards"></div>
      
      <div class="selection-info">
        <span id="cards-selected">0</span> / 5 cards selected
      </div>
      
      <div class="action-buttons">
        <button id="clear-btn" class="action-btn secondary">Clear Selection</button>
        <button id="submit-btn" class="action-btn primary" disabled>Submit Hand</button>
      </div>
      
      <div id="selected-display" class="selected-hand"></div>
    `;
    
    // Render clickable cards
    const cardsContainer = document.getElementById('seven-cards');
    if (cardsContainer) {
      scenario.allCards.forEach((card, _index) => {
        const cardEl = Cards.createCardElement(card, {
          width: 85,
          height: 120,
          clickable: true,
          onClick: () => this.toggleCard(card)
        });
        cardEl.dataset.cardValue = card;
        cardsContainer.appendChild(cardEl);
      });
    }
    
    // Add event listeners
    const clearBtn = document.getElementById('clear-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearSelection());
    }
    
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitSelection());
    }
  }

  private toggleCard(card: string): void {
    if (this.selectedCards.has(card)) {
      this.selectedCards.delete(card);
    } else if (this.selectedCards.size < 5) {
      this.selectedCards.add(card);
    }
    
    this.updateSelection();
  }

  private clearSelection(): void {
    this.selectedCards.clear();
    this.updateSelection();
  }

  private updateSelection(): void {
    // Update card visuals
    const allCards = document.querySelectorAll('.seven-cards .card');
    allCards.forEach(cardEl => {
      const cardValue = (cardEl as HTMLElement).dataset.cardValue;
      if (cardValue && this.selectedCards.has(cardValue)) {
        cardEl.classList.add('selected');
      } else {
        cardEl.classList.remove('selected');
      }
    });
    
    // Update counter
    const counter = document.getElementById('cards-selected');
    if (counter) {
      counter.textContent = this.selectedCards.size.toString();
    }
    
    // Update submit button
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = this.selectedCards.size !== 5;
    }
    
    // Show selected hand
    const display = document.getElementById('selected-display');
    if (display && this.selectedCards.size === 5) {
      const selectedArray = Array.from(this.selectedCards);
      const description = getHandDescription(selectedArray);
      display.innerHTML = `
        <div class="selected-label">Your selection:</div>
        <div class="selected-hand-name">${description}</div>
      `;
    } else if (display) {
      display.innerHTML = '';
    }
  }

  private submitSelection(): void {
    if (!this.currentScenario || this.selectedCards.size !== 5) return;
    
    const selectedArray = Array.from(this.selectedCards).sort();
    const scenario = this.currentScenario as unknown as BestFiveScenario;
    const correctArray = scenario?.bestHand.sort() || [];
    
    const isCorrect = selectedArray.join(',') === correctArray.join(',');
    
    this.handleAnswer(isCorrect ? 'correct' : 'incorrect');
  }

  protected handleAnswer(answerId: string): void {
    if (!this.currentScenario) return;
    
    const isCorrect = answerId === 'correct';
    
    // Update score
    if (isCorrect) {
      this.state.score++;
      this.state.streak++;
    } else {
      this.state.streak = 0;
    }
    
    // Show feedback
    this.showFeedback(isCorrect);
    
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

  private showFeedback(isCorrect: boolean): void {
    if (!this.currentScenario) return;
    
    const gameArea = document.querySelector('.game-area');
    if (!gameArea) return;
    
    // Disable interaction
    const allCards = gameArea.querySelectorAll('.card');
    allCards.forEach(card => {
      (card as HTMLElement).style.pointerEvents = 'none';
    });
    
    const buttons = gameArea.querySelectorAll('button');
    buttons.forEach(btn => {
      (btn as HTMLButtonElement).disabled = true;
    });
    
    // Highlight correct answer
    allCards.forEach(cardEl => {
      const cardValue = (cardEl as HTMLElement).dataset.cardValue;
      const scenario = this.currentScenario as unknown as BestFiveScenario;
      if (cardValue && scenario?.bestHand.includes(cardValue)) {
        cardEl.classList.add('correct-answer');
      }
    });
    
    // Show result
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackDiv.innerHTML = `
      <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
      <div class="feedback-text">
        ${isCorrect ? 'Correct!' : 'Not quite.'}<br>
        The best hand was: <strong>${(this.currentScenario as unknown as BestFiveScenario).handName}</strong>
      </div>
    `;
    
    gameArea.appendChild(feedbackDiv);
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
    return "Select the best possible 5-card poker hand from the 7 cards shown. Click cards to select them.";
  }
}

// Add styles
export function getBestFiveStyles(): string {
  return `
    .instructions {
      text-align: center;
      font-size: 1.2em;
      color: #333;
      margin-bottom: 30px;
      font-weight: 600;
    }
    
    .seven-cards {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .seven-cards .card {
      transition: all 0.3s;
      cursor: pointer;
    }
    
    .seven-cards .card:hover {
      transform: translateY(-10px);
    }
    
    .seven-cards .card.selected {
      transform: translateY(-20px);
      box-shadow: 0 10px 30px rgba(199, 62, 154, 0.4);
      border-color: #C73E9A;
      border-width: 3px;
    }
    
    .seven-cards .card.correct-answer {
      border-color: #4CAF50;
      border-width: 4px;
      box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
    }
    
    .selection-info {
      text-align: center;
      font-size: 1.1em;
      margin: 20px 0;
      color: #666;
    }
    
    #cards-selected {
      font-weight: bold;
      color: #C73E9A;
      font-size: 1.2em;
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
    }
    
    .action-btn {
      padding: 12px 30px;
      font-size: 1.1em;
      border-radius: 8px;
      border: 2px solid;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 600;
    }
    
    .action-btn.primary {
      background: #C73E9A;
      color: white;
      border-color: #C73E9A;
    }
    
    .action-btn.primary:hover:not(:disabled) {
      background: #932153;
      border-color: #932153;
      transform: translateY(-2px);
    }
    
    .action-btn.primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .action-btn.secondary {
      background: white;
      color: #666;
      border-color: #ddd;
    }
    
    .action-btn.secondary:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
    }
    
    .selected-hand {
      text-align: center;
      margin: 20px 0;
      min-height: 50px;
    }
    
    .selected-label {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
    
    .selected-hand-name {
      font-size: 1.3em;
      font-weight: bold;
      color: #7D1346;
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
      font-size: 1.1em;
      color: #333;
    }
    
    @media (max-width: 768px) {
      .seven-cards .card {
        width: 60px !important;
        height: 85px !important;
      }
    }
  `;
}