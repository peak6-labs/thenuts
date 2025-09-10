/**
 * Wrapper for pokersolver library to provide proper hand evaluation
 */

// Access pokersolver from global scope (loaded via CDN)
declare global {
  interface Window {
    Hand: any;
  }
}

const Hand = (window as any).Hand;

/**
 * Convert our card format to pokersolver format
 * Our format: "Ah", "Td", "9c"
 * Pokersolver format: same but expects uppercase suits
 */
function toPokerSolverFormat(card: string): string {
  // Replace T with 10 if needed, though pokersolver accepts both
  return card.charAt(0).toUpperCase() + card.charAt(1).toLowerCase();
}

/**
 * Evaluate a poker hand using pokersolver
 * Returns the hand with all evaluation data
 */
export function evaluateHandWithSolver(cards: string[]) {
  const formattedCards = cards.map(toPokerSolverFormat);
  return Hand.solve(formattedCards);
}

/**
 * Compare two hands and determine the winner
 * Returns: 1 if hand1 wins, -1 if hand2 wins, 0 if tie
 */
export function compareHandsWithSolver(hand1: string[], hand2: string[]): number {
  const solved1 = evaluateHandWithSolver(hand1);
  const solved2 = evaluateHandWithSolver(hand2);
  
  const winners = Hand.winners([solved1, solved2]);
  
  if (winners.length === 2) {
    return 0; // Tie
  } else if (winners[0] === solved1) {
    return 1; // Hand 1 wins
  } else {
    return -1; // Hand 2 wins
  }
}

/**
 * Get hand description from pokersolver evaluation
 */
export function getHandDescription(cards: string[]): string {
  const hand = evaluateHandWithSolver(cards);
  return hand.descr;
}

/**
 * Find the best 5-card hand from 7 cards (Texas Hold'em style)
 */
export function findBestHand(cards: string[]): { cards: string[], description: string } {
  if (cards.length <= 5) {
    const hand = evaluateHandWithSolver(cards);
    return {
      cards: cards, // Return original cards, not reconstructed ones
      description: hand.descr
    };
  }
  
  // Generate all combinations of 5 cards from the 7
  const combinations: string[][] = [];
  for (let i = 0; i < cards.length - 4; i++) {
    for (let j = i + 1; j < cards.length - 3; j++) {
      for (let k = j + 1; k < cards.length - 2; k++) {
        for (let l = k + 1; l < cards.length - 1; l++) {
          for (let m = l + 1; m < cards.length; m++) {
            combinations.push([cards[i], cards[j], cards[k], cards[l], cards[m]]);
          }
        }
      }
    }
  }
  
  // Evaluate all combinations
  const evaluatedHands = combinations.map(combo => ({
    cards: combo,
    hand: evaluateHandWithSolver(combo)
  }));
  
  // Find the best hand
  const sorted = evaluatedHands.sort((a, b) => {
    const winners = Hand.winners([a.hand, b.hand]);
    if (winners.length === 2) return 0;
    return winners[0] === a.hand ? -1 : 1;
  });
  
  const best = sorted[0];
  return {
    cards: best.cards, // These are the original cards from combinations
    description: best.hand.descr
  };
}

/**
 * Find the nuts (best possible hand) given community cards
 */
export function findTheNuts(communityCards: string[], availableCards: string[]): {
  holeCards: [string, string],
  description: string
} {
  let bestHand = null;
  let bestHoleCards: [string, string] = ['', ''];
  
  // Try all possible 2-card combinations from available cards
  for (let i = 0; i < availableCards.length - 1; i++) {
    for (let j = i + 1; j < availableCards.length; j++) {
      const holeCards: [string, string] = [availableCards[i], availableCards[j]];
      const allCards = [...communityCards, ...holeCards];
      const result = findBestHand(allCards);
      
      if (!bestHand) {
        bestHand = result;
        bestHoleCards = holeCards;
      } else {
        // Compare with current best
        const currentBest = evaluateHandWithSolver(bestHand.cards);
        const newHand = evaluateHandWithSolver(result.cards);
        const winners = Hand.winners([currentBest, newHand]);
        
        if (winners.length === 1 && winners[0] === newHand) {
          bestHand = result;
          bestHoleCards = holeCards;
        }
      }
    }
  }
  
  return {
    holeCards: bestHoleCards,
    description: bestHand?.description || 'High Card'
  };
}

export default {
  evaluateHand: evaluateHandWithSolver,
  compareHands: compareHandsWithSolver,
  getHandDescription,
  findBestHand,
  findTheNuts
};