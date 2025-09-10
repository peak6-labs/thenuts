/**
 * Type definitions for card-related functionality
 */

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Suit = 'h' | 'd' | 'c' | 's';
export type SuitSymbol = '♥' | '♦' | '♣' | '♠';
export type CardColor = 'red' | 'black';

export interface Card {
  rank: Rank;
  suit: Suit;
  suitSymbol: SuitSymbol;
  color: CardColor;
  displayRank: string; // '10' for 'T', otherwise same as rank
  toString(): string; // Returns card notation like "Ah"
}

export interface CardOptions {
  width?: number;
  height?: number;
  fontSize?: number;
  clickable?: boolean;
  selected?: boolean;
  faceDown?: boolean;
  onClick?: (card: Card | string, index?: number) => void;
  className?: string;
  style?: 'simple' | 'detailed';
}

export interface DeckOptions {
  shuffled?: boolean;
  seed?: number | null;
}

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
  rank: HandRanking;
  description: string;
  cards: Card[];
  value: number; // Numeric value for comparison
}

export interface PokerHand {
  cards: Card[];
  evaluation?: HandEvaluation;
}

export interface HoleCards {
  cards: [Card, Card] | [string, string];
}

export interface CommunityCards {
  flop?: [Card, Card, Card] | [string, string, string];
  turn?: Card | string;
  river?: Card | string;
}

export interface BoardTexture {
  isFlushPossible: boolean;
  isStraightPossible: boolean;
  isPaired: boolean;
  isMonotone: boolean;
  isRainbow: boolean;
  highCard: Rank;
  possibleStraights: string[];
  possibleFlushes: Suit[];
}