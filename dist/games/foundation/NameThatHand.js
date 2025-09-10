/**
 * Name That Hand - Foundation level game
 * Players identify poker hands from 5 cards
 */
import { BaseGame } from '../BaseGame.js';
import { generateDeck, renderCards } from '../../lib/cards.js';
import { HAND_RANKINGS, generateHandType, evaluateHand } from '../../lib/poker.js';
import { shuffleArray } from '../../lib/random.js';
export class NameThatHand extends BaseGame {
    constructor() {
        const config = {
            name: 'Name That Hand',
            difficulty: 'foundation',
            rounds: 30,
            description: 'Identify poker hands from 5 cards',
            instructions: [
                'Look at the 5 cards shown',
                'Identify what poker hand they make',
                'Select the correct hand name from the choices',
                'Learn to recognize all 10 hand types'
            ]
        };
        super(config);
        this.targetHandTypes = [];
    }
    generateScenarios() {
        const scenarios = [];
        // Generate 3 of each hand type for even distribution
        this.targetHandTypes = [];
        for (let i = 0; i < 3; i++) {
            this.targetHandTypes.push(...HAND_RANKINGS);
        }
        // Shuffle the order
        this.targetHandTypes = shuffleArray(this.targetHandTypes);
        // Generate a scenario for each target hand
        for (let i = 0; i < this.config.rounds; i++) {
            const targetHand = this.targetHandTypes[i];
            const deck = generateDeck({ shuffled: true });
            // Try to generate the specific hand type
            let cards = generateHandType(targetHand, deck);
            // If generation failed, use a shuffled hand
            if (!cards) {
                cards = deck.slice(0, 5);
            }
            // Create choices - the correct answer plus 3 wrong ones
            const evaluation = evaluateHand(cards);
            const correctAnswer = evaluation.name;
            const choices = this.generateChoices(correctAnswer);
            scenarios.push({
                id: `round-${i + 1}`,
                correctAnswer,
                choices,
                communityCards: {
                    flop: [cards[0], cards[1], cards[2]],
                    turn: cards[3],
                    river: cards[4]
                }
            });
        }
        return scenarios;
    }
    generateChoices(correctAnswer) {
        const choices = [];
        const allRankings = [...HAND_RANKINGS];
        // Add the correct answer
        choices.push({
            id: correctAnswer,
            display: correctAnswer,
            value: correctAnswer
        });
        // Remove correct answer from possibilities
        const wrongChoices = allRankings.filter(r => r !== correctAnswer);
        // Pick 3 random wrong answers
        const selectedWrong = shuffleArray(wrongChoices).slice(0, 3);
        for (const wrong of selectedWrong) {
            choices.push({
                id: wrong,
                display: wrong,
                value: wrong
            });
        }
        // Shuffle all choices
        return shuffleArray(choices);
    }
    renderScenario() {
        if (!this.currentScenario)
            return;
        const gameArea = this.uiManager.getGameArea();
        if (!gameArea)
            return;
        // Get the cards from the scenario
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
      <div class="round-info">
        <h3>Round ${this.state.currentRound} of ${this.state.totalRounds}</h3>
        <p>What poker hand do these cards make?</p>
      </div>
      
      <div class="cards-display" id="cards-display"></div>
      
      <div class="choices-container" id="choices-container"></div>
      
      <div class="feedback" id="feedback" style="display: none;"></div>
    `;
        // Render the cards
        const cardsContainer = gameArea.querySelector('#cards-display');
        if (cardsContainer) {
            renderCards(cards, cardsContainer, {
                width: 80,
                height: 115,
                style: 'simple'
            });
        }
        // Render choices
        const choicesContainer = gameArea.querySelector('#choices-container');
        if (choicesContainer && this.currentScenario.choices) {
            choicesContainer.innerHTML = '';
            for (const choice of this.currentScenario.choices) {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.display || '';
                button.onclick = () => this.submitAnswer(choice.value);
                choicesContainer.appendChild(button);
            }
        }
    }
    renderGame() {
        // Additional game-specific UI setup if needed
        this.addStyles();
    }
    checkAnswer(answer, correctAnswer) {
        return answer === correctAnswer;
    }
    handleAnswerFeedback(isCorrect, answer) {
        const gameArea = this.uiManager.getGameArea();
        const feedback = gameArea?.querySelector('#feedback');
        if (!feedback)
            return;
        const choiceButtons = gameArea?.querySelectorAll('.choice-btn');
        choiceButtons?.forEach(btn => {
            const button = btn;
            button.disabled = true;
            if (button.textContent === this.currentScenario?.correctAnswer) {
                button.classList.add('correct');
            }
            else if (button.textContent === answer) {
                button.classList.add('incorrect');
            }
        });
        feedback.style.display = 'block';
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = isCorrect
            ? '✓ Correct! Well done!'
            : `✗ That's ${answer}. The correct answer is ${this.currentScenario?.correctAnswer}.`;
    }
    addStyles() {
        if (document.getElementById('name-that-hand-styles'))
            return;
        const style = document.createElement('style');
        style.id = 'name-that-hand-styles';
        style.textContent = `
      .round-info {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .round-info h3 {
        color: #7D1346;
        margin-bottom: 10px;
      }
      
      .cards-display {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 30px 0;
        flex-wrap: wrap;
      }
      
      .choices-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 30px auto;
        max-width: 600px;
      }
      
      .choice-btn {
        padding: 15px 20px;
        border: 2px solid #C73E9A;
        border-radius: 10px;
        background: white;
        color: #C73E9A;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .choice-btn:hover:not(:disabled) {
        background: #C73E9A;
        color: white;
        transform: translateY(-2px);
      }
      
      .choice-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
      
      .choice-btn.correct {
        background: #4CAF50;
        border-color: #4CAF50;
        color: white;
      }
      
      .choice-btn.incorrect {
        background: #f44336;
        border-color: #f44336;
        color: white;
      }
      
      .feedback {
        text-align: center;
        padding: 15px;
        border-radius: 10px;
        margin: 20px auto;
        max-width: 500px;
        font-size: 1.1em;
        font-weight: 600;
      }
      
      .feedback.correct {
        background: #e8f5e9;
        color: #2e7d32;
      }
      
      .feedback.incorrect {
        background: #ffebee;
        color: #c62828;
      }
    `;
        document.head.appendChild(style);
    }
}
//# sourceMappingURL=NameThatHand.js.map