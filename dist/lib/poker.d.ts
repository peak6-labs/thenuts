/**
 * Poker hand evaluation and utility functions
 */
import type { Card, BoardTexture, Rank } from '../types/cards.js';
export type HandRanking = 'Royal Flush' | 'Straight Flush' | 'Four of a Kind' | 'Full House' | 'Flush' | 'Straight' | 'Three of a Kind' | 'Two Pair' | 'Pair' | 'High Card';
export interface HandEvaluation {
    name: HandRanking;
    rank: number;
    cards: string[];
}
/**
 * Hand rankings from lowest to highest
 */
export declare const HAND_RANKINGS: readonly HandRanking[];
/**
 * Get numeric value for a hand ranking (higher is better)
 */
export declare function getHandRankingValue(ranking: HandRanking): number;
/**
 * Compare two hand rankings
 */
export declare function compareHandRankings(a: HandRanking, b: HandRanking): number;
/**
 * Get rank value for comparison (Ace high = 14)
 */
export declare function getRankValue(rank: Rank): number;
/**
 * Check if cards form a flush
 */
export declare function isFlush(cards: (Card | string)[]): boolean;
/**
 * Check if cards form a straight
 */
export declare function isStraight(cards: (Card | string)[]): boolean;
/**
 * Check if cards form a straight flush
 */
export declare function isStraightFlush(cards: (Card | string)[]): boolean;
/**
 * Count occurrences of each rank
 */
export declare function countRanks(cards: (Card | string)[]): Map<Rank, number>;
/**
 * Get pairs from cards
 */
export declare function getPairs(cards: (Card | string)[]): Rank[];
/**
 * Get three of a kinds from cards
 */
export declare function getThreeOfAKinds(cards: (Card | string)[]): Rank[];
/**
 * Get four of a kinds from cards
 */
export declare function getFourOfAKinds(cards: (Card | string)[]): Rank[];
/**
 * Simple hand evaluation (basic, not complete poker evaluation)
 * For complete evaluation, use pokersolver library in production
 */
export declare function evaluateHand(cards: (Card | string)[]): HandEvaluation;
/**
 * Analyze board texture for strategic considerations
 */
export declare function analyzeBoardTexture(communityCards: (Card | string)[]): BoardTexture;
/**
 * Get hand description string
 */
export declare function getHandDescription(ranking: HandRanking, cards: (Card | string)[]): string;
/**
 * Compare two hands and return winner
 * Returns: positive if hand1 wins, negative if hand2 wins, 0 if tie
 */
export declare function compareHands(hand1: (Card | string)[], hand2: (Card | string)[]): number;
/**
 * Get numeric rank for a hand evaluation
 */
export declare function getHandRank(evaluation: HandEvaluation): number;
/**
 * Generate a specific hand type for training games
 */
export declare function generateHandType(type: HandRanking, deck: string[]): string[] | null;
//# sourceMappingURL=poker.d.ts.map