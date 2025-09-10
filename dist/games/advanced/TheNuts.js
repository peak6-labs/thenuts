/**
 * The Nuts - Advanced level game
 * Players identify the best possible hand for any board
 */
import { BaseGame } from '../BaseGame.js';
import { generateDeck, renderCards, shuffleDeck, formatHoleCards } from '../../lib/cards.js';
import { getHourlySeed, shuffleArray } from '../../lib/random.js';
import { getCompletedLevels, markLevelCompleted } from '../../lib/storage.js';
import { findTheNuts as findTheNutsWithSolver, findBestHand } from '../../lib/pokersolver-wrapper.js';
export class TheNuts extends BaseGame {
    constructor(level = 'level1') {
        const config = {
            name: 'The Nuts',
            difficulty: 'advanced',
            rounds: 15,
            timeLimit: level === 'level3' ? 30 : 60,
            description: 'Identify the absolute best possible hand',
            instructions: [
                'Look at the community cards',
                'Find which hole cards make the nuts',
                'Level 1: Hints show what each choice makes',
                'Level 2: No hints, standard difficulty',
                'Level 3: Very close hands, 30-second timer',
                'Get 15/15 correct to advance levels'
            ]
        };
        super(config);
        this.currentLevel = 'level1';
        this.currentLevel = level;
        getCompletedLevels(); // Check completed levels if needed
    }
    shouldUseSeed() {
        return true; // Use deterministic scenarios
    }
    getSeed() {
        const levelOffset = this.currentLevel === 'level1' ? 0 :
            this.currentLevel === 'level2' ? 1000 : 2000;
        return getHourlySeed(levelOffset);
    }
    generateScenarios() {
        const scenarios = [];
        const deck = generateDeck({ shuffled: false });
        for (let i = 0; i < this.config.rounds; i++) {
            const scenario = this.generateLevelScenario(deck);
            scenarios.push(scenario);
        }
        return scenarios;
    }
    generateLevelScenario(deck) {
        switch (this.currentLevel) {
            case 'level1':
                return this.generateLevel1Scenario(deck);
            case 'level2':
                return this.generateLevel2Scenario(deck);
            case 'level3':
                return this.generateLevel3Scenario(deck);
            default:
                return this.generateLevel2Scenario(deck);
        }
    }
    generateLevel1Scenario(deck) {
        const shuffled = shuffleDeck(deck);
        const communityCards = shuffled.slice(0, 5);
        const remainingDeck = shuffled.slice(5);
        // Find the actual nuts
        const nuts = this.findTheNuts(communityCards, remainingDeck);
        // Generate decoy hands with wide strength gaps
        const choices = [
            {
                id: 'nuts',
                display: formatHoleCards(nuts.holeCards),
                value: nuts.holeCards,
                holeCards: nuts.holeCards,
                handStrength: 100,
                hint: `(Makes: ${nuts.description})`
            }
        ];
        // Add 3 progressively weaker hands
        const strengthTargets = [70, 40, 10];
        for (const target of strengthTargets) {
            const decoy = this.generateDecoyHand(communityCards, remainingDeck, target, choices.map(c => c.holeCards));
            choices.push({
                id: `decoy-${target}`,
                display: formatHoleCards(decoy.holeCards),
                value: decoy.holeCards,
                holeCards: decoy.holeCards,
                handStrength: target,
                hint: `(Makes: ${decoy.description})`
            });
        }
        return {
            id: `level1-round-${this.state.currentRound}`,
            communityCards: {
                flop: [communityCards[0], communityCards[1], communityCards[2]],
                turn: communityCards[3],
                river: communityCards[4]
            },
            choices: shuffleArray(choices),
            correctAnswer: nuts.holeCards.join(',')
        };
    }
    generateLevel2Scenario(deck) {
        const shuffled = shuffleDeck(deck);
        const communityCards = shuffled.slice(0, 5);
        const remainingDeck = shuffled.slice(5);
        const nuts = this.findTheNuts(communityCards, remainingDeck);
        // Standard difficulty - no hints
        const choices = [
            {
                id: 'nuts',
                display: formatHoleCards(nuts.holeCards),
                value: nuts.holeCards,
                holeCards: nuts.holeCards,
                handStrength: 100
            }
        ];
        // Add decoys with moderate strength differences
        const strengthTargets = [80, 60, 40];
        for (const target of strengthTargets) {
            const decoy = this.generateDecoyHand(communityCards, remainingDeck, target, choices.map(c => c.holeCards));
            choices.push({
                id: `decoy-${target}`,
                display: formatHoleCards(decoy.holeCards),
                value: decoy.holeCards,
                holeCards: decoy.holeCards,
                handStrength: target
            });
        }
        return {
            id: `level2-round-${this.state.currentRound}`,
            communityCards: {
                flop: [communityCards[0], communityCards[1], communityCards[2]],
                turn: communityCards[3],
                river: communityCards[4]
            },
            choices: shuffleArray(choices),
            correctAnswer: nuts.holeCards.join(',')
        };
    }
    generateLevel3Scenario(deck) {
        const shuffled = shuffleDeck(deck);
        const communityCards = shuffled.slice(0, 5);
        const remainingDeck = shuffled.slice(5);
        const nuts = this.findTheNuts(communityCards, remainingDeck);
        // Hard difficulty - all near-nuts hands
        const choices = [
            {
                id: 'nuts',
                display: formatHoleCards(nuts.holeCards),
                value: nuts.holeCards,
                holeCards: nuts.holeCards,
                handStrength: 100
            }
        ];
        // Add very strong decoys (90+ strength)
        const strengthTargets = [95, 92, 90];
        for (const target of strengthTargets) {
            const decoy = this.generateDecoyHand(communityCards, remainingDeck, target, choices.map(c => c.holeCards));
            choices.push({
                id: `decoy-${target}`,
                display: formatHoleCards(decoy.holeCards),
                value: decoy.holeCards,
                holeCards: decoy.holeCards,
                handStrength: target
            });
        }
        return {
            id: `level3-round-${this.state.currentRound}`,
            communityCards: {
                flop: [communityCards[0], communityCards[1], communityCards[2]],
                turn: communityCards[3],
                river: communityCards[4]
            },
            choices: shuffleArray(choices),
            correctAnswer: nuts.holeCards.join(',')
        };
    }
    findTheNuts(communityCards, deck) {
        // Use pokersolver for accurate nuts finding
        return findTheNutsWithSolver(communityCards, deck);
    }
    generateDecoyHand(communityCards, deck, targetStrength, usedHoleCards) {
        // Generate strategic decoys based on target strength
        const availableCards = deck.filter(card => {
            return !usedHoleCards.some(used => used.includes(card));
        });
        // Collect potential hands with their evaluations
        const candidates = [];
        // Try various hole card combinations
        for (let i = 0; i < Math.min(availableCards.length - 1, 20); i++) {
            for (let j = i + 1; j < Math.min(availableCards.length, 21); j++) {
                const holeCards = [
                    availableCards[i],
                    availableCards[j]
                ];
                const allCards = [...communityCards, ...holeCards];
                const bestHand = findBestHand(allCards);
                // Estimate hand strength (simplified)
                const strength = this.estimateHandStrength(bestHand.description);
                candidates.push({
                    holeCards,
                    description: bestHand.description,
                    strength
                });
            }
        }
        // Sort by how close they are to target strength
        candidates.sort((a, b) => {
            const diffA = Math.abs(a.strength - targetStrength);
            const diffB = Math.abs(b.strength - targetStrength);
            return diffA - diffB;
        });
        // Return the closest match
        const selected = candidates[0] || {
            holeCards: [availableCards[0], availableCards[1]],
            description: 'High Card'
        };
        return {
            holeCards: selected.holeCards,
            description: selected.description
        };
    }
    estimateHandStrength(description) {
        // Rough strength estimates based on hand type
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('straight flush'))
            return 99;
        if (lowerDesc.includes('four of a kind'))
            return 95;
        if (lowerDesc.includes('full house'))
            return 90;
        if (lowerDesc.includes('flush'))
            return 85;
        if (lowerDesc.includes('straight'))
            return 80;
        if (lowerDesc.includes('three of a kind'))
            return 70;
        if (lowerDesc.includes('two pair'))
            return 60;
        if (lowerDesc.includes('pair'))
            return 40;
        return 20; // High card
    }
    renderScenario() {
        if (!this.currentScenario || !this.container)
            return;
        const gameArea = this.container.querySelector('#game-area');
        if (!gameArea) {
            console.error('Game area not found in container');
            console.log('Container contents:', this.container.innerHTML);
            return;
        }
        const cards = [];
        if (this.currentScenario.communityCards) {
            const { flop, turn, river } = this.currentScenario.communityCards;
            if (flop)
                cards.push(...flop);
            if (turn)
                cards.push(turn);
            if (river)
                cards.push(river);
        }
        gameArea.innerHTML = `
      <div class="level-indicator">
        <span class="level-badge">${this.currentLevel.toUpperCase()}</span>
        <span class="round-info">Round ${this.state.currentRound}/${this.state.totalRounds}</span>
      </div>
      
      <div class="board-section">
        <h3>Community Cards</h3>
        <div class="community-cards" id="community-cards"></div>
      </div>
      
      <div class="question">
        <p>What is the nuts? (The best possible hand ANY player could have)</p>
      </div>
      
      <div class="choices-grid" id="choices-grid"></div>
      
      <div class="feedback" id="feedback" style="display: none;"></div>
    `;
        // Render community cards
        // Use default card dimensions from library
        renderCards(cards, gameArea.querySelector('#community-cards'));
        // Render choices
        const choicesGrid = gameArea.querySelector('#choices-grid');
        if (choicesGrid && this.currentScenario.choices) {
            for (const choice of this.currentScenario.choices) {
                const button = document.createElement('button');
                button.className = 'hole-cards-btn choice-btn';
                button.innerHTML = `
          <div class="hole-cards-display">${choice.display}</div>
          ${choice.hint ? `<div class="hint">${choice.hint}</div>` : ''}
        `;
                button.addEventListener('click', () => {
                    this.submitAnswer(choice.value);
                });
                choicesGrid.appendChild(button);
            }
        }
        this.addStyles();
    }
    renderGame() {
        // Level-specific UI setup
    }
    checkAnswer(answer, correctAnswer) {
        // Check if the hole cards match
        const answerCards = answer;
        const correctStr = correctAnswer;
        const correctCards = correctStr.split(',');
        return (answerCards[0] === correctCards[0] && answerCards[1] === correctCards[1]) ||
            (answerCards[0] === correctCards[1] && answerCards[1] === correctCards[0]);
    }
    handleAnswerFeedback(isCorrect, _answer) {
        const buttons = this.container?.querySelectorAll('.hole-cards-btn');
        buttons?.forEach(btn => {
            const button = btn;
            button.disabled = true;
        });
        if (!isCorrect) {
            this.state.mistakes++;
            // Check if level failed
            if (this.state.mistakes > 0 && this.currentLevel !== 'level1') {
                this.handleLevelFailure();
                return;
            }
        }
        // Show feedback - look in game-area since that's where it's rendered
        const gameArea = this.container?.querySelector('#game-area');
        const feedback = gameArea?.querySelector('#feedback');
        if (feedback) {
            feedback.style.display = 'block';
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            feedback.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect';
        }
    }
    handleLevelFailure() {
        // Show failure modal and restart level
        this.endGame();
    }
    endGame() {
        if (this.state.score === 15) {
            // Perfect score - advance to next level
            markLevelCompleted(`the-nuts-${this.currentLevel}`);
            if (this.currentLevel === 'level1') {
                this.currentLevel = 'level2';
            }
            else if (this.currentLevel === 'level2') {
                this.currentLevel = 'level3';
            }
        }
        super.endGame();
    }
    addStyles() {
        if (document.getElementById('the-nuts-styles'))
            return;
        const style = document.createElement('style');
        style.id = 'the-nuts-styles';
        style.textContent = `
      .level-indicator {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .level-badge {
        background: #C73E9A;
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
      }
      
      .board-section {
        text-align: center;
        margin: 30px 0;
      }
      
      .community-cards {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
      }
      
      .question {
        text-align: center;
        font-size: 1.1em;
        color: #666;
        margin: 20px 0;
      }
      
      .choices-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .hole-cards-btn {
        padding: 15px;
        border: 2px solid #C73E9A;
        border-radius: 10px;
        background: white;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .hole-cards-btn:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      }
      
      .hole-cards-display {
        font-size: 1.3em;
        font-weight: bold;
        color: #333;
      }
      
      .hint {
        font-size: 0.9em;
        color: #666;
        margin-top: 5px;
      }
      
      @media (max-width: 600px) {
        .choices-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
        document.head.appendChild(style);
    }
}
//# sourceMappingURL=TheNuts.js.map