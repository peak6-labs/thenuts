/**
 * Cards Library for Poker Training Games
 * Provides consistent card rendering, deck utilities, and display formatting
 */

import type { Card, CardOptions, DeckOptions, Rank, Suit, SuitSymbol, CardColor } from '../types/cards.js';

export const RANKS: readonly Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
export const SUITS: readonly Suit[] = ['h', 'd', 'c', 's'] as const;

export const SUIT_SYMBOLS: Record<string, SuitSymbol> = {
  'h': '♥', 'hearts': '♥', '♥': '♥',
  'd': '♦', 'diamonds': '♦', '♦': '♦',
  'c': '♣', 'clubs': '♣', '♣': '♣',
  's': '♠', 'spades': '♠', '♠': '♠'
} as const;

export const SUIT_COLORS: Record<string, CardColor> = {
  'h': 'red', 'hearts': 'red', '♥': 'red',
  'd': 'red', 'diamonds': 'red', '♦': 'red',
  'c': 'black', 'clubs': 'black', '♣': 'black',
  's': 'black', 'spades': 'black', '♠': 'black'
} as const;

export const SUIT_NAMES: Record<string, string> = {
  'h': 'hearts', '♥': 'hearts',
  'd': 'diamonds', '♦': 'diamonds',
  'c': 'clubs', '♣': 'clubs',
  's': 'spades', '♠': 'spades'
} as const;

interface CardConfig {
  useImages: boolean;
  imagePath: string;
  imageFormat: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultFontSize: number;
}

let config: CardConfig = {
  useImages: true,
  imagePath: 'images/cards/',
  imageFormat: 'png',
  defaultWidth: 85,
  defaultHeight: 120,
  defaultFontSize: 28
};

/**
 * Configure the cards library
 */
export function configure(options: Partial<CardConfig>): void {
  config = { ...config, ...options };
}

/**
 * Parse card from various formats
 */
export function parseCard(card: string | Partial<Card>): Card {
  if (typeof card === 'string') {
    const match = card.match(/^(10|[2-9TJQKA])([hdcs])$/i);
    if (!match) {
      throw new Error(`Invalid card format: ${card}`);
    }
    const rank = (match[1].toUpperCase() === '10' ? 'T' : match[1].toUpperCase()) as Rank;
    const suit = match[2].toLowerCase() as Suit;
    
    return {
      rank,
      suit,
      suitSymbol: SUIT_SYMBOLS[suit],
      color: SUIT_COLORS[suit],
      displayRank: rank === 'T' ? '10' : rank,
      toString: () => `${rank}${suit}`
    };
  } else if (typeof card === 'object' && card.rank && card.suit) {
    const cardSuit = card.suit as string;
    const suit = cardSuit.toLowerCase() as Suit;
    const suitKey = SUIT_SYMBOLS[suit] ? suit : 
                  (Object.keys(SUIT_SYMBOLS).find(k => SUIT_SYMBOLS[k] === cardSuit) || suit) as Suit;
    
    const cardRank = card.rank as string;
    const rank = (cardRank === '10' ? 'T' : cardRank) as Rank;
    
    return {
      rank,
      suit: suitKey,
      suitSymbol: SUIT_SYMBOLS[suitKey] || (cardSuit as SuitSymbol),
      color: SUIT_COLORS[suitKey] || 'black',
      displayRank: rank === 'T' ? '10' : rank,
      toString: () => `${rank}${suitKey}`
    };
  }
  throw new Error('Invalid card format');
}

/**
 * Create a card DOM element
 */
export function createCardElement(card: string | Card, options: CardOptions = {}): HTMLElement {
  const parsedCard = parseCard(card);
  const opts = {
    width: config.defaultWidth,
    height: config.defaultHeight,
    fontSize: config.defaultFontSize,
    clickable: false,
    selected: false,
    faceDown: false,
    onClick: undefined,
    className: '',
    style: 'simple' as const,
    ...options
  };

  const cardDiv = document.createElement('div');
  cardDiv.className = `card ${parsedCard.color} ${opts.className}`;
  if (opts.selected) cardDiv.classList.add('selected');
  if (opts.faceDown) cardDiv.classList.add('face-down');
  if (opts.clickable) cardDiv.classList.add('clickable');
  
  cardDiv.style.width = `${opts.width}px`;
  cardDiv.style.height = `${opts.height}px`;
  cardDiv.style.fontSize = `${opts.fontSize}px`;

  if (opts.faceDown) {
    cardDiv.innerHTML = config.useImages ? 
      `<img src="${config.imagePath}back.${config.imageFormat}" alt="Card back" />` :
      '<div class="card-back">🂠</div>';
  } else if (config.useImages) {
    const imageName = `${parsedCard.rank}${parsedCard.suit}`;
    cardDiv.innerHTML = `<img src="${config.imagePath}${imageName}.${config.imageFormat}" 
                              alt="${parsedCard.displayRank}${parsedCard.suitSymbol}" />`;
  } else {
    if (opts.style === 'detailed') {
      cardDiv.innerHTML = `
        <div class="card-rank">${parsedCard.displayRank}</div>
        <div class="card-suit">${parsedCard.suitSymbol}</div>
      `;
    } else {
      cardDiv.textContent = `${parsedCard.displayRank}${parsedCard.suitSymbol}`;
    }
  }

  if (opts.clickable && opts.onClick) {
    cardDiv.style.cursor = 'pointer';
    cardDiv.addEventListener('click', () => opts.onClick!(parsedCard, 0));
  }

  cardDiv.dataset.rank = parsedCard.rank;
  cardDiv.dataset.suit = parsedCard.suit;
  cardDiv.dataset.card = parsedCard.toString();

  return cardDiv;
}

/**
 * Render multiple cards into a container
 */
export function renderCards(
  cards: (string | Card)[], 
  container: HTMLElement | string, 
  options: CardOptions = {}
): void {
  const containerEl = typeof container === 'string' ? 
    document.getElementById(container) : container;
  
  if (!containerEl) {
    throw new Error('Container element not found');
  }
  
  containerEl.innerHTML = '';
  cards.forEach((card, index) => {
    const cardOpts = { 
      ...options, 
      onClick: options.onClick ? () => options.onClick!(card, index) : undefined 
    };
    containerEl.appendChild(createCardElement(card, cardOpts));
  });
}

/**
 * Generate a standard 52-card deck
 */
export function generateDeck(options: DeckOptions = {}): string[] {
  const deck: string[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push(rank + suit);
    }
  }

  if (options.shuffled) {
    return shuffleDeck(deck, options.seed);
  }

  return deck;
}

/**
 * Shuffle a deck with optional seed
 */
export function shuffleDeck<T>(deck: T[], seed: number | null = null): T[] {
  const newDeck = [...deck];
  const random = seed !== null ? createSeededRandom(seed) : Math.random;
  
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  
  return newDeck;
}

/**
 * Create seeded random number generator
 */
function createSeededRandom(seed: number): () => number {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Format card notation for display with colored HTML
 */
export function formatCardsInText(text: string): string {
  return text.replace(
    /(^|[^a-zA-Z])([2-9TJQKA]|10)([hdcs])\b/gi, 
    (_match, prefix, rank, suit) => {
      const suitLower = suit.toLowerCase() as Suit;
      const suitSymbol = SUIT_SYMBOLS[suitLower];
      const colorClass = SUIT_COLORS[suitLower] === 'red' ? 'card-heart' : 'card-spade';
      const displayRank = rank === 'T' ? '10' : rank;
      return `${prefix}<span class="${colorClass}">${displayRank}${suitSymbol}</span>`;
    }
  );
}

/**
 * Format hole cards for display
 */
export function formatHoleCards(
  holeCards: [string, string] | [Card, Card], 
  options: { separator?: string; colored?: boolean } = {}
): string {
  const opts = { separator: ' ', colored: true, ...options };

  const cards = holeCards.map(card => {
    const parsed = parseCard(card);
    const display = `${parsed.displayRank}${parsed.suitSymbol}`;
    
    if (opts.colored) {
      const colorClass = parsed.color === 'red' ? 'card-heart' : 'card-spade';
      return `<span class="${colorClass}">${display}</span>`;
    }
    return display;
  });

  return cards.join(opts.separator);
}

/**
 * Compare two cards for sorting
 */
export function compareCards(a: string | Card, b: string | Card): number {
  const cardA = parseCard(a);
  const cardB = parseCard(b);
  
  const rankA = RANKS.indexOf(cardA.rank);
  const rankB = RANKS.indexOf(cardB.rank);
  
  if (rankA !== rankB) {
    return rankB - rankA; // Higher rank first
  }
  
  const suitOrder: Suit[] = ['s', 'h', 'd', 'c'];
  return suitOrder.indexOf(cardA.suit) - suitOrder.indexOf(cardB.suit);
}

/**
 * Sort an array of cards
 */
export function sortCards(
  cards: (string | Card)[], 
  descending: boolean = true
): (string | Card)[] {
  const sorted = [...cards].sort(compareCards);
  return descending ? sorted : sorted.reverse();
}

/**
 * Get card image filename
 */
export function getCardImageName(card: string | Card): string {
  const parsed = parseCard(card);
  return `${parsed.rank}${parsed.suit}.${config.imageFormat}`;
}

/**
 * Deck class for managing a deck of cards
 */
export class Deck {
  private cards: string[] = [];
  private dealtCards: string[] = [];
  private options: DeckOptions;

  constructor(options: DeckOptions = {}) {
    this.options = { shuffled: true, ...options };
    this.reset();
  }

  reset(): void {
    this.cards = generateDeck({
      shuffled: this.options.shuffled,
      seed: this.options.seed
    });
    this.dealtCards = [];
  }

  shuffle(seed: number | null = null): void {
    this.cards = shuffleDeck(this.cards, seed);
  }

  deal(count: number = 1): string | string[] {
    const dealt: string[] = [];
    for (let i = 0; i < count && this.cards.length > 0; i++) {
      const card = this.cards.pop()!;
      dealt.push(card);
      this.dealtCards.push(card);
    }
    return count === 1 ? dealt[0] : dealt;
  }

  cardsRemaining(): number {
    return this.cards.length;
  }

  getDealtCards(): string[] {
    return [...this.dealtCards];
  }
}

/**
 * Get default CSS styles for cards
 */
export function getDefaultStyles(): string {
  return `
    .card, .playing-card {
      display: inline-block;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      margin: 5px;
      position: relative;
      font-weight: bold;
      text-align: center;
      line-height: 100px;
      cursor: default;
      transition: transform 0.2s;
      user-select: none;
      box-sizing: border-box;
    }
    
    .card.clickable {
      cursor: pointer;
    }
    
    .card:hover.clickable {
      transform: translateY(-5px);
    }
    
    .card.selected {
      border-color: #667eea;
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
      transform: translateY(-10px);
    }
    
    .card.red {
      color: #dc3545;
    }
    
    .card.black {
      color: #212529;
    }
    
    .card.face-down {
      background: linear-gradient(45deg, #667eea 25%, #764ba2 75%);
      color: white;
    }
    
    .card .card-rank {
      font-size: 1.3em;
      font-weight: 700;
      line-height: 1.2;
      margin-top: 20%;
    }
    
    .card .card-suit {
      font-size: 1.1em;
      margin-top: 5px;
    }
    
    .card-back {
      font-size: 2em;
      line-height: inherit;
    }
    
    .card-heart, .card-diamond {
      color: #dc3545;
      font-weight: 600;
    }
    
    .card-spade, .card-club {
      color: #212529;
      font-weight: 600;
    }
    
    .card img, .playing-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      border-radius: 6px;
    }
    
    .cards-container, .cards-display, .community-cards {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    
    .hole-cards-btn {
      background: white;
      border: 2px solid #667eea;
      border-radius: 10px;
      padding: 15px 20px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1.1em;
    }
    
    .hole-cards-btn:hover {
      background: #f3f4f6;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    .hole-cards-btn .hint {
      font-size: 0.85em;
      color: #6b7280;
      margin-top: 5px;
    }
  `;
}

/**
 * Inject default styles into the document
 */
export function injectDefaultStyles(): void {
  if (document.getElementById('cards-default-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'cards-default-styles';
  style.textContent = getDefaultStyles();
  document.head.appendChild(style);
}