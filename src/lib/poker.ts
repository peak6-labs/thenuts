/**
 * Poker hand evaluation and utility functions
 */

import type { Card, BoardTexture, Rank, Suit } from '../types/cards.js';

export type HandRanking = 
  | 'Royal Flush'
  | 'Straight Flush'
  | 'Four of a Kind'
  | 'Full House'
  | 'Flush'
  | 'Straight'
  | 'Three of a Kind'
  | 'Two Pair'
  | 'Pair'
  | 'High Card';

export interface HandEvaluation {
  name: HandRanking;
  rank: number;
  cards: string[];
}
import { parseCard, RANKS, SUITS } from './cards.js';

/**
 * Hand rankings from lowest to highest
 */
export const HAND_RANKINGS: readonly HandRanking[] = [
  'High Card',
  'Pair',
  'Two Pair',
  'Three of a Kind',
  'Straight',
  'Flush',
  'Full House',
  'Four of a Kind',
  'Straight Flush',
  'Royal Flush'
] as const;

/**
 * Get numeric value for a hand ranking (higher is better)
 */
export function getHandRankingValue(ranking: HandRanking): number {
  return HAND_RANKINGS.indexOf(ranking);
}

/**
 * Compare two hand rankings
 */
export function compareHandRankings(a: HandRanking, b: HandRanking): number {
  return getHandRankingValue(b) - getHandRankingValue(a);
}

/**
 * Get rank value for comparison (Ace high = 14)
 */
export function getRankValue(rank: Rank): number {
  if (rank === 'A') return 14;
  if (rank === 'K') return 13;
  if (rank === 'Q') return 12;
  if (rank === 'J') return 11;
  if (rank === 'T') return 10;
  return parseInt(rank);
}

/**
 * Check if cards form a flush
 */
export function isFlush(cards: (Card | string)[]): boolean {
  if (cards.length < 5) return false;
  
  const parsedCards = cards.map(c => parseCard(c));
  const suitCounts: Record<Suit, number> = { h: 0, d: 0, c: 0, s: 0 };
  
  for (const card of parsedCards) {
    suitCounts[card.suit]++;
    if (suitCounts[card.suit] >= 5) return true;
  }
  
  return false;
}

/**
 * Check if cards form a straight
 */
export function isStraight(cards: (Card | string)[]): boolean {
  if (cards.length < 5) return false;
  
  const parsedCards = cards.map(c => parseCard(c));
  const rankValues = [...new Set(parsedCards.map(c => getRankValue(c.rank)))].sort((a, b) => b - a);
  
  // Check for regular straights
  for (let i = 0; i <= rankValues.length - 5; i++) {
    let isStraight = true;
    for (let j = 0; j < 4; j++) {
      if (rankValues[i + j] - rankValues[i + j + 1] !== 1) {
        isStraight = false;
        break;
      }
    }
    if (isStraight) return true;
  }
  
  // Check for A-2-3-4-5 (wheel)
  const hasAce = rankValues.includes(14);
  const hasTwo = rankValues.includes(2);
  const hasThree = rankValues.includes(3);
  const hasFour = rankValues.includes(4);
  const hasFive = rankValues.includes(5);
  
  return hasAce && hasTwo && hasThree && hasFour && hasFive;
}

/**
 * Check if cards form a straight flush
 */
export function isStraightFlush(cards: (Card | string)[]): boolean {
  if (cards.length < 5) return false;
  
  const parsedCards = cards.map(c => parseCard(c));
  const bySuit: Record<Suit, Card[]> = { h: [], d: [], c: [], s: [] };
  
  for (const card of parsedCards) {
    bySuit[card.suit].push(card);
  }
  
  for (const suit of SUITS) {
    if (bySuit[suit].length >= 5) {
      const suitCards = bySuit[suit].map(c => c.rank + c.suit);
      if (isStraight(suitCards)) return true;
    }
  }
  
  return false;
}

/**
 * Count occurrences of each rank
 */
export function countRanks(cards: (Card | string)[]): Map<Rank, number> {
  const counts = new Map<Rank, number>();
  
  for (const card of cards) {
    const parsed = parseCard(card);
    counts.set(parsed.rank, (counts.get(parsed.rank) || 0) + 1);
  }
  
  return counts;
}

/**
 * Get pairs from cards
 */
export function getPairs(cards: (Card | string)[]): Rank[] {
  const counts = countRanks(cards);
  const pairs: Rank[] = [];
  
  for (const [rank, count] of counts) {
    if (count === 2) pairs.push(rank);
  }
  
  return pairs.sort((a, b) => getRankValue(b) - getRankValue(a));
}

/**
 * Get three of a kinds from cards
 */
export function getThreeOfAKinds(cards: (Card | string)[]): Rank[] {
  const counts = countRanks(cards);
  const threes: Rank[] = [];
  
  for (const [rank, count] of counts) {
    if (count === 3) threes.push(rank);
  }
  
  return threes.sort((a, b) => getRankValue(b) - getRankValue(a));
}

/**
 * Get four of a kinds from cards
 */
export function getFourOfAKinds(cards: (Card | string)[]): Rank[] {
  const counts = countRanks(cards);
  const fours: Rank[] = [];
  
  for (const [rank, count] of counts) {
    if (count === 4) fours.push(rank);
  }
  
  return fours.sort((a, b) => getRankValue(b) - getRankValue(a));
}

/**
 * Simple hand evaluation (basic, not complete poker evaluation)
 * For complete evaluation, use pokersolver library in production
 */
export function evaluateHand(cards: (Card | string)[]): HandEvaluation {
  const parsedCards = cards.map(c => parseCard(c));
  const cardStrings = parsedCards.map(c => c.toString());
  
  if (cards.length < 5) {
    return { name: 'High Card', rank: 1, cards: cardStrings };
  }
  
  const isRoyalFlush = isStraightFlush(cards) && cards.some(c => {
    const parsed = parseCard(c);
    return parsed.rank === 'A';
  });
  
  if (isRoyalFlush) return { name: 'Royal Flush', rank: 10, cards: cardStrings };
  if (isStraightFlush(cards)) return { name: 'Straight Flush', rank: 9, cards: cardStrings };
  
  const fours = getFourOfAKinds(cards);
  if (fours.length > 0) return { name: 'Four of a Kind', rank: 8, cards: cardStrings };
  
  const threes = getThreeOfAKinds(cards);
  const pairs = getPairs(cards);
  
  if (threes.length > 0 && pairs.length > 0) return { name: 'Full House', rank: 7, cards: cardStrings };
  if (isFlush(cards)) return { name: 'Flush', rank: 6, cards: cardStrings };
  if (isStraight(cards)) return { name: 'Straight', rank: 5, cards: cardStrings };
  if (threes.length > 0) return { name: 'Three of a Kind', rank: 4, cards: cardStrings };
  if (pairs.length >= 2) return { name: 'Two Pair', rank: 3, cards: cardStrings };
  if (pairs.length === 1) return { name: 'Pair', rank: 2, cards: cardStrings };
  
  return { name: 'High Card', rank: 1, cards: cardStrings };
}

/**
 * Analyze board texture for strategic considerations
 */
export function analyzeBoardTexture(communityCards: (Card | string)[]): BoardTexture {
  const parsedCards = communityCards.map(c => parseCard(c));
  const suitCounts: Record<Suit, number> = { h: 0, d: 0, c: 0, s: 0 };
  const rankCounts = countRanks(parsedCards);
  
  for (const card of parsedCards) {
    suitCounts[card.suit]++;
  }
  
  const maxSuitCount = Math.max(...Object.values(suitCounts));
  const uniqueSuits = Object.values(suitCounts).filter(c => c > 0).length;
  const sortedRanks = parsedCards.map(c => c.rank).sort((a, b) => getRankValue(b) - getRankValue(a));
  
  return {
    isFlushPossible: maxSuitCount >= 3,
    isStraightPossible: checkStraightPossibility(parsedCards),
    isPaired: Array.from(rankCounts.values()).some(c => c >= 2),
    isMonotone: uniqueSuits === 1,
    isRainbow: uniqueSuits === parsedCards.length && parsedCards.length <= 4,
    highCard: sortedRanks[0],
    possibleStraights: findPossibleStraights(parsedCards),
    possibleFlushes: (Object.entries(suitCounts) as [Suit, number][])
      .filter(([_, count]) => count >= 3)
      .map(([suit]) => suit)
  };
}

/**
 * Check if a straight is possible with the given cards
 */
function checkStraightPossibility(cards: Card[]): boolean {
  if (cards.length < 3) return false;
  
  const rankValues = [...new Set(cards.map(c => getRankValue(c.rank)))].sort((a, b) => a - b);
  
  // Check for gaps
  for (let i = 0; i < rankValues.length - 2; i++) {
    const gap1 = rankValues[i + 1] - rankValues[i];
    const gap2 = rankValues[i + 2] - rankValues[i + 1];
    if (gap1 <= 4 && gap2 <= 4) return true;
  }
  
  // Check wheel possibility
  const hasLowCards = rankValues.some(v => v <= 5);
  const hasAce = rankValues.includes(14);
  if (hasLowCards && hasAce) return true;
  
  return false;
}

/**
 * Find possible straights that could be made
 */
function findPossibleStraights(cards: Card[]): string[] {
  const straights: string[] = [];
  const rankValues = [...new Set(cards.map(c => getRankValue(c.rank)))];
  
  // Check each possible 5-card straight
  for (let start = 2; start <= 10; start++) {
    const needed: number[] = [];
    let have = 0;
    
    for (let i = 0; i < 5; i++) {
      const rank = start + i;
      if (rankValues.includes(rank)) {
        have++;
      } else {
        needed.push(rank);
      }
    }
    
    if (have >= 3 && needed.length <= 2) {
      const straightName = start === 10 ? 'Broadway' : `${start} to ${start + 4}`;
      straights.push(straightName);
    }
  }
  
  // Check wheel (A-2-3-4-5)
  const wheelRanks = [14, 2, 3, 4, 5];
  const wheelHave = wheelRanks.filter(r => rankValues.includes(r)).length;
  if (wheelHave >= 3) {
    straights.push('Wheel (A-5)');
  }
  
  return straights;
}

/**
 * Get hand description string
 */
export function getHandDescription(ranking: HandRanking, cards: (Card | string)[]): string {
  const parsedCards = cards.map(c => parseCard(c));
  
  switch (ranking) {
    case 'Royal Flush':
      return 'Royal Flush';
    
    case 'Straight Flush': {
      const highCard = parsedCards.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank))[0];
      return `Straight Flush, ${highCard.displayRank} high`;
    }
    
    case 'Four of a Kind': {
      const fours = getFourOfAKinds(cards);
      return `Four ${fours[0]}s`;
    }
    
    case 'Full House': {
      const threes = getThreeOfAKinds(cards);
      const pairs = getPairs(cards);
      return `Full House, ${threes[0]}s full of ${pairs[0]}s`;
    }
    
    case 'Flush': {
      const highCard = parsedCards.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank))[0];
      return `Flush, ${highCard.displayRank} high`;
    }
    
    case 'Straight': {
      const highCard = parsedCards.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank))[0];
      return `Straight, ${highCard.displayRank} high`;
    }
    
    case 'Three of a Kind': {
      const threes = getThreeOfAKinds(cards);
      return `Three ${threes[0]}s`;
    }
    
    case 'Two Pair': {
      const pairs = getPairs(cards);
      return `Two Pair, ${pairs[0]}s and ${pairs[1]}s`;
    }
    
    case 'Pair': {
      const pairs = getPairs(cards);
      return `Pair of ${pairs[0]}s`;
    }
    
    default: {
      const highCard = parsedCards.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank))[0];
      return `${highCard.displayRank} high`;
    }
  }
}

/**
 * Compare two hands and return winner
 * Returns: positive if hand1 wins, negative if hand2 wins, 0 if tie
 */
export function compareHands(hand1: (Card | string)[], hand2: (Card | string)[]): number {
  const eval1 = evaluateHand(hand1);
  const eval2 = evaluateHand(hand2);
  
  if (eval1.rank !== eval2.rank) {
    return eval1.rank - eval2.rank;
  }
  
  // If same hand type, compare the actual cards
  const cards1 = hand1.map(c => parseCard(c));
  const cards2 = hand2.map(c => parseCard(c));
  
  // Compare based on hand type
  switch (eval1.name) {
    case 'Four of a Kind': {
      const quads1 = getFourOfAKinds(cards1)[0];
      const quads2 = getFourOfAKinds(cards2)[0];
      const quadComp = getRankValue(quads1) - getRankValue(quads2);
      if (quadComp !== 0) return quadComp;
      break;
    }
    
    case 'Full House': {
      const trips1 = getThreeOfAKinds(cards1)[0];
      const trips2 = getThreeOfAKinds(cards2)[0];
      const tripComp = getRankValue(trips1) - getRankValue(trips2);
      if (tripComp !== 0) return tripComp;
      
      const pairs1 = getPairs(cards1)[0];
      const pairs2 = getPairs(cards2)[0];
      return getRankValue(pairs1) - getRankValue(pairs2);
    }
    
    case 'Flush':
    case 'Straight':
    case 'High Card': {
      // Compare high cards
      const sorted1 = cards1.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
      const sorted2 = cards2.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
      
      for (let i = 0; i < Math.min(sorted1.length, sorted2.length); i++) {
        const comp = getRankValue(sorted1[i].rank) - getRankValue(sorted2[i].rank);
        if (comp !== 0) return comp;
      }
      break;
    }
    
    case 'Three of a Kind': {
      const trips1 = getThreeOfAKinds(cards1)[0];
      const trips2 = getThreeOfAKinds(cards2)[0];
      const comp = getRankValue(trips1) - getRankValue(trips2);
      if (comp !== 0) return comp;
      
      // Compare kickers
      const kickers1 = cards1.filter(c => c.rank !== trips1).sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
      const kickers2 = cards2.filter(c => c.rank !== trips2).sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
      
      for (let i = 0; i < Math.min(kickers1.length, kickers2.length); i++) {
        const kickerComp = getRankValue(kickers1[i].rank) - getRankValue(kickers2[i].rank);
        if (kickerComp !== 0) return kickerComp;
      }
      break;
    }
    
    case 'Two Pair': {
      const pairs1 = getPairs(cards1);
      const pairs2 = getPairs(cards2);
      
      // Compare high pair
      const highPairComp = getRankValue(pairs1[0]) - getRankValue(pairs2[0]);
      if (highPairComp !== 0) return highPairComp;
      
      // Compare low pair
      const lowPairComp = getRankValue(pairs1[1]) - getRankValue(pairs2[1]);
      if (lowPairComp !== 0) return lowPairComp;
      
      // Compare kicker
      const kicker1 = cards1.find(c => !pairs1.includes(c.rank));
      const kicker2 = cards2.find(c => !pairs2.includes(c.rank));
      if (kicker1 && kicker2) {
        return getRankValue(kicker1.rank) - getRankValue(kicker2.rank);
      }
      break;
    }
    
    case 'Pair': {
      const pair1 = getPairs(cards1)[0];
      const pair2 = getPairs(cards2)[0];
      const pairComp = getRankValue(pair1) - getRankValue(pair2);
      if (pairComp !== 0) return pairComp;
      
      // Compare kickers
      const kickers1 = cards1.filter(c => c.rank !== pair1).sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
      const kickers2 = cards2.filter(c => c.rank !== pair2).sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
      
      for (let i = 0; i < Math.min(kickers1.length, kickers2.length); i++) {
        const kickerComp = getRankValue(kickers1[i].rank) - getRankValue(kickers2[i].rank);
        if (kickerComp !== 0) return kickerComp;
      }
      break;
    }
  }
  
  return 0;
}

/**
 * Get numeric rank for a hand evaluation
 */
export function getHandRank(evaluation: HandEvaluation): number {
  return evaluation.rank;
}

/**
 * Generate a specific hand type for training games
 */
export function generateHandType(type: HandRanking, deck: string[]): string[] | null {
  const shuffled = [...deck];
  
  // This is a simplified version - in production, use more sophisticated generation
  // or integrate with pokersolver for accurate hand generation
  
  switch (type) {
    case 'Pair':
      return findHandWithPairs(shuffled, 1);
    
    case 'Two Pair':
      return findHandWithPairs(shuffled, 2);
    
    case 'Three of a Kind':
      return findHandWithTrips(shuffled);
    
    case 'Straight':
      return findStraight(shuffled);
    
    case 'Flush':
      return findFlush(shuffled);
    
    case 'Full House':
      return findFullHouse(shuffled);
    
    case 'Four of a Kind':
      return findQuads(shuffled);
    
    case 'Straight Flush':
      return findStraightFlush(shuffled);
    
    case 'Royal Flush':
      return findRoyalFlush(shuffled);
    
    default:
      return shuffled.slice(0, 5);
  }
}

// Helper functions for hand generation
function findHandWithPairs(deck: string[], pairCount: number): string[] | null {
  const hand: string[] = [];
  const usedRanks = new Set<Rank>();
  
  for (let i = 0; i < pairCount; i++) {
    const rank = RANKS.find(r => !usedRanks.has(r));
    if (!rank) return null;
    
    const cards = deck.filter(c => parseCard(c).rank === rank).slice(0, 2);
    if (cards.length < 2) return null;
    
    hand.push(...cards);
    usedRanks.add(rank);
  }
  
  // Fill remaining cards
  while (hand.length < 5) {
    const card = deck.find(c => !hand.includes(c) && !usedRanks.has(parseCard(c).rank));
    if (!card) return null;
    hand.push(card);
    usedRanks.add(parseCard(card).rank);
  }
  
  return hand;
}

function findHandWithTrips(deck: string[]): string[] | null {
  for (const rank of RANKS) {
    const cards = deck.filter(c => parseCard(c).rank === rank);
    if (cards.length >= 3) {
      const hand = cards.slice(0, 3);
      const others = deck.filter(c => parseCard(c).rank !== rank).slice(0, 2);
      return [...hand, ...others];
    }
  }
  return null;
}

function findStraight(deck: string[]): string[] | null {
  // Simplified - just return any 5 consecutive ranks if possible
  const sortedByRank = deck.sort((a, b) => getRankValue(parseCard(b).rank) - getRankValue(parseCard(a).rank));
  return sortedByRank.slice(0, 5);
}

function findFlush(deck: string[]): string[] | null {
  for (const suit of SUITS) {
    const cards = deck.filter(c => parseCard(c).suit === suit);
    if (cards.length >= 5) {
      return cards.slice(0, 5);
    }
  }
  return null;
}

function findFullHouse(deck: string[]): string[] | null {
  const trips = findHandWithTrips(deck);
  if (!trips) return null;
  
  const tripRank = parseCard(trips[0]).rank;
  const pair = deck.filter(c => {
    const rank = parseCard(c).rank;
    return rank !== tripRank;
  }).slice(0, 2);
  
  if (pair.length < 2) return null;
  
  return [...trips.slice(0, 3), ...pair];
}

function findQuads(deck: string[]): string[] | null {
  for (const rank of RANKS) {
    const cards = deck.filter(c => parseCard(c).rank === rank);
    if (cards.length === 4) {
      const kicker = deck.find(c => parseCard(c).rank !== rank);
      return [...cards, kicker!];
    }
  }
  return null;
}

function findStraightFlush(deck: string[]): string[] | null {
  // Simplified - would need more complex logic in production
  return findFlush(deck);
}

function findRoyalFlush(deck: string[]): string[] | null {
  // Simplified - would need specific royal flush logic in production
  for (const suit of SUITS) {
    const royalRanks = ['T', 'J', 'Q', 'K', 'A'];
    const cards = royalRanks.map(r => r + suit);
    if (cards.every(c => deck.includes(c))) {
      return cards;
    }
  }
  return null;
}