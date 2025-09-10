/**
 * Wrapper for pokersolver library to provide proper hand evaluation
 */
declare global {
    interface Window {
        Hand: any;
    }
}
/**
 * Evaluate a poker hand using pokersolver
 * Returns the hand with all evaluation data
 */
export declare function evaluateHandWithSolver(cards: string[]): any;
/**
 * Compare two hands and determine the winner
 * Returns: 1 if hand1 wins, -1 if hand2 wins, 0 if tie
 */
export declare function compareHandsWithSolver(hand1: string[], hand2: string[]): number;
/**
 * Get hand description from pokersolver evaluation
 */
export declare function getHandDescription(cards: string[]): string;
/**
 * Find the best 5-card hand from 7 cards (Texas Hold'em style)
 */
export declare function findBestHand(cards: string[]): {
    cards: string[];
    description: string;
};
/**
 * Find the nuts (best possible hand) given community cards
 */
export declare function findTheNuts(communityCards: string[], availableCards: string[]): {
    holeCards: [string, string];
    description: string;
};
declare const _default: {
    evaluateHand: typeof evaluateHandWithSolver;
    compareHands: typeof compareHandsWithSolver;
    getHandDescription: typeof getHandDescription;
    findBestHand: typeof findBestHand;
    findTheNuts: typeof findTheNuts;
};
export default _default;
//# sourceMappingURL=pokersolver-wrapper.d.ts.map