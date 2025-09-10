/**
 * Cards Library for Poker Training Games
 * Provides consistent card rendering, deck utilities, and display formatting
 */
import type { Card, CardOptions, DeckOptions, Rank, Suit, SuitSymbol, CardColor } from '../types/cards.js';
export declare const RANKS: readonly Rank[];
export declare const SUITS: readonly Suit[];
export declare const SUIT_SYMBOLS: Record<string, SuitSymbol>;
export declare const SUIT_COLORS: Record<string, CardColor>;
export declare const SUIT_NAMES: Record<string, string>;
interface CardConfig {
    useImages: boolean;
    imagePath: string;
    imageFormat: string;
    defaultWidth: number;
    defaultHeight: number;
    defaultFontSize: number;
}
/**
 * Configure the cards library
 */
export declare function configure(options: Partial<CardConfig>): void;
/**
 * Parse card from various formats
 */
export declare function parseCard(card: string | Partial<Card>): Card;
/**
 * Create a card DOM element
 */
export declare function createCardElement(card: string | Card, options?: CardOptions): HTMLElement;
/**
 * Render multiple cards into a container
 */
export declare function renderCards(cards: (string | Card)[], container: HTMLElement | string, options?: CardOptions): void;
/**
 * Generate a standard 52-card deck
 */
export declare function generateDeck(options?: DeckOptions): string[];
/**
 * Shuffle a deck with optional seed
 */
export declare function shuffleDeck<T>(deck: T[], seed?: number | null): T[];
/**
 * Format card notation for display with colored HTML
 */
export declare function formatCardsInText(text: string): string;
/**
 * Format hole cards for display
 */
export declare function formatHoleCards(holeCards: [string, string] | [Card, Card], options?: {
    separator?: string;
    colored?: boolean;
}): string;
/**
 * Compare two cards for sorting
 */
export declare function compareCards(a: string | Card, b: string | Card): number;
/**
 * Sort an array of cards
 */
export declare function sortCards(cards: (string | Card)[], descending?: boolean): (string | Card)[];
/**
 * Get card image filename
 */
export declare function getCardImageName(card: string | Card): string;
/**
 * Deck class for managing a deck of cards
 */
export declare class Deck {
    private cards;
    private dealtCards;
    private options;
    constructor(options?: DeckOptions);
    reset(): void;
    shuffle(seed?: number | null): void;
    deal(count?: number): string | string[];
    cardsRemaining(): number;
    getDealtCards(): string[];
}
/**
 * Get default CSS styles for cards
 */
export declare function getDefaultStyles(): string;
/**
 * Inject default styles into the document
 */
export declare function injectDefaultStyles(): void;
export {};
//# sourceMappingURL=cards.d.ts.map