/**
 * Cards Library for Poker Training Games
 * Provides consistent card rendering, deck utilities, and display formatting
 */

const Cards = (function() {
    'use strict';

    // Constants
    const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const SUITS = ['h', 'd', 'c', 's'];
    const SUIT_SYMBOLS = {
        'h': '♥', 'hearts': '♥', '♥': '♥',
        'd': '♦', 'diamonds': '♦', '♦': '♦',
        'c': '♣', 'clubs': '♣', '♣': '♣',
        's': '♠', 'spades': '♠', '♠': '♠'
    };
    const SUIT_COLORS = {
        'h': 'red', 'hearts': 'red', '♥': 'red',
        'd': 'red', 'diamonds': 'red', '♦': 'red',
        'c': 'black', 'clubs': 'black', '♣': 'black',
        's': 'black', 'spades': 'black', '♠': 'black'
    };
    const SUIT_NAMES = {
        'h': 'hearts', '♥': 'hearts',
        'd': 'diamonds', '♦': 'diamonds',
        'c': 'clubs', '♣': 'clubs',
        's': 'spades', '♠': 'spades'
    };

    // Card rendering configuration
    let config = {
        useImages: true,  // Use card images for rendering
        imagePath: 'images/cards/',  // Path to card images (relative)
        imageFormat: 'png',  // Image format
        defaultWidth: 70,
        defaultHeight: 100,
        defaultFontSize: 24
    };

    // Random number generator state
    let randomState = {
        seed: null,
        generator: null
    };

    /**
     * Configure the cards library
     * @param {Object} options - Configuration options
     */
    function configure(options) {
        Object.assign(config, options);
    }

    /**
     * Mulberry32 seeded random number generator
     * @param {number} seed - Seed value
     * @returns {Function} Random number generator function
     */
    function mulberry32(seed) {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    /**
     * Set the random seed for deterministic shuffling
     * @param {number} seed - Seed value (use null for Math.random)
     */
    function setSeed(seed) {
        if (seed === null || seed === undefined) {
            randomState.seed = null;
            randomState.generator = null;
        } else {
            randomState.seed = seed;
            randomState.generator = mulberry32(seed);
        }
    }

    /**
     * Get a random number using either seeded or Math.random
     * @returns {number} Random number between 0 and 1
     */
    function getRandom() {
        return randomState.generator ? randomState.generator() : Math.random();
    }

    /**
     * Get hourly seed based on UTC time (like the-nuts.html)
     * @param {number} offset - Optional offset to add to seed
     * @returns {number} Seed value
     */
    function getHourlySeed(offset = 0) {
        const now = new Date();
        const utcHour = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours()
        );
        return utcHour + offset;
    }

    /**
     * Parse card from various formats
     * @param {string|Object} card - Card in various formats (e.g., "Ah", {rank: "A", suit: "♥"})
     * @returns {Object} Normalized card object {rank, suit, color}
     */
    function parseCard(card) {
        if (typeof card === 'string') {
            // Handle string format like "Ah" or "10s"
            const match = card.match(/^(10|[2-9TJQKA])([hdcs])$/i);
            if (!match) {
                throw new Error(`Invalid card format: ${card}`);
            }
            const rank = match[1].toUpperCase();
            const suit = match[2].toLowerCase();
            return {
                rank: rank === '10' ? 'T' : rank,
                suit: suit,
                suitSymbol: SUIT_SYMBOLS[suit],
                color: SUIT_COLORS[suit],
                displayRank: rank === 'T' ? '10' : rank,
                toString: () => `${rank === '10' ? 'T' : rank}${suit}`
            };
        } else if (typeof card === 'object') {
            // Handle object format from pokersolver or custom format
            const suit = card.suit ? card.suit.toLowerCase() : '';
            const suitKey = SUIT_SYMBOLS[suit] ? suit : 
                          Object.keys(SUIT_SYMBOLS).find(k => SUIT_SYMBOLS[k] === card.suit) || suit;
            
            const rank = card.rank === '10' ? 'T' : card.rank;
            return {
                rank: rank,
                suit: suitKey,
                suitSymbol: SUIT_SYMBOLS[suitKey] || card.suit,
                color: SUIT_COLORS[suitKey] || (card.isRed && card.isRed() ? 'red' : 'black'),
                displayRank: rank === 'T' ? '10' : rank,
                toString: () => `${rank}${suitKey}`
            };
        }
        throw new Error('Invalid card format');
    }

    /**
     * Create a card DOM element
     * @param {string|Object} card - Card to render
     * @param {Object} options - Rendering options
     * @returns {HTMLElement} Card DOM element
     */
    function createCardElement(card, options = {}) {
        const parsedCard = parseCard(card);
        const opts = Object.assign({
            width: config.defaultWidth,
            height: config.defaultHeight,
            fontSize: config.defaultFontSize,
            clickable: false,
            selected: false,
            faceDown: false,
            onClick: null,
            className: '',
            style: 'simple'  // 'simple' or 'detailed'
        }, options);

        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${parsedCard.color} ${opts.className}`;
        if (opts.selected) cardDiv.classList.add('selected');
        if (opts.faceDown) cardDiv.classList.add('face-down');
        if (opts.clickable) cardDiv.classList.add('clickable');
        
        // Apply sizing
        cardDiv.style.width = `${opts.width}px`;
        cardDiv.style.height = `${opts.height}px`;
        cardDiv.style.fontSize = `${opts.fontSize}px`;

        if (opts.faceDown) {
            // Show card back
            cardDiv.innerHTML = config.useImages ? 
                `<img src="${config.imagePath}back.${config.imageFormat}" alt="Card back" />` :
                '<div class="card-back">🂠</div>';
        } else if (config.useImages) {
            // Future: Use card images
            const imageName = `${parsedCard.rank}${parsedCard.suit}`;
            cardDiv.innerHTML = `<img src="${config.imagePath}${imageName}.${config.imageFormat}" 
                                      alt="${parsedCard.displayRank}${parsedCard.suitSymbol}" />`;
        } else {
            // Text-based rendering
            if (opts.style === 'detailed') {
                // Two-line format (rank above suit)
                cardDiv.innerHTML = `
                    <div class="card-rank">${parsedCard.displayRank}</div>
                    <div class="card-suit">${parsedCard.suitSymbol}</div>
                `;
            } else {
                // Simple format (rank and suit together)
                cardDiv.textContent = `${parsedCard.displayRank}${parsedCard.suitSymbol}`;
            }
        }

        // Add click handler
        if (opts.clickable && opts.onClick) {
            cardDiv.style.cursor = 'pointer';
            cardDiv.addEventListener('click', opts.onClick);
        }

        // Store card data
        cardDiv.dataset.rank = parsedCard.rank;
        cardDiv.dataset.suit = parsedCard.suit;
        cardDiv.dataset.card = parsedCard.toString();

        return cardDiv;
    }

    /**
     * Render multiple cards into a container
     * @param {Array} cards - Array of cards to render
     * @param {HTMLElement|string} container - Container element or ID
     * @param {Object} options - Rendering options for all cards
     */
    function renderCards(cards, container, options = {}) {
        const containerEl = typeof container === 'string' ? 
            document.getElementById(container) : container;
        
        containerEl.innerHTML = '';
        cards.forEach((card, index) => {
            const cardOpts = Object.assign({}, options, {
                onClick: options.onClick ? () => options.onClick(card, index) : null
            });
            containerEl.appendChild(createCardElement(card, cardOpts));
        });
    }

    /**
     * Generate a standard 52-card deck
     * @param {Object} options - Generation options
     * @returns {Array} Array of card strings
     */
    function generateDeck(options = {}) {
        const opts = Object.assign({
            shuffled: false,
            seed: null  // Use null for Math.random, number for deterministic
        }, options);

        const deck = [];
        for (const rank of RANKS) {
            for (const suit of SUITS) {
                deck.push(rank + suit);
            }
        }

        if (opts.shuffled) {
            if (opts.seed !== null) {
                setSeed(opts.seed);
            }
            shuffleArray(deck);
            if (opts.seed !== null) {
                setSeed(null);  // Reset to Math.random
            }
        }

        return deck;
    }

    /**
     * Shuffle an array in place (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array (mutates original)
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(getRandom() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Shuffle a deck with optional seed
     * @param {Array} deck - Deck to shuffle
     * @param {number|null} seed - Optional seed for deterministic shuffle
     * @returns {Array} New shuffled array (does not mutate original)
     */
    function shuffleDeck(deck, seed = null) {
        const newDeck = [...deck];
        if (seed !== null) {
            setSeed(seed);
        }
        shuffleArray(newDeck);
        if (seed !== null) {
            setSeed(null);  // Reset to Math.random
        }
        return newDeck;
    }

    /**
     * Deck class for managing a deck of cards
     */
    class Deck {
        constructor(options = {}) {
            this.options = Object.assign({
                shuffled: true,
                seed: null
            }, options);
            this.reset();
        }

        reset() {
            this.cards = generateDeck({
                shuffled: this.options.shuffled,
                seed: this.options.seed
            });
            this.dealtCards = [];
        }

        shuffle(seed = null) {
            if (seed !== null) {
                setSeed(seed);
            }
            shuffleArray(this.cards);
            if (seed !== null) {
                setSeed(null);
            }
        }

        deal(count = 1) {
            const dealt = [];
            for (let i = 0; i < count && this.cards.length > 0; i++) {
                const card = this.cards.pop();
                dealt.push(card);
                this.dealtCards.push(card);
            }
            return count === 1 ? dealt[0] : dealt;
        }

        cardsRemaining() {
            return this.cards.length;
        }

        getDealtCards() {
            return [...this.dealtCards];
        }
    }

    /**
     * Format card notation for display with colored HTML
     * @param {string} text - Text containing card notations
     * @returns {string} HTML string with colored card symbols
     */
    function formatCardsInText(text) {
        // Replace card notations with colored spans
        let formatted = text
            // Card notations (e.g., "Ah", "10s")
            .replace(/(^|[^a-zA-Z])([2-9TJQKA]|10)([hdcs])\b/gi, (match, prefix, rank, suit) => {
                const suitLower = suit.toLowerCase();
                const suitSymbol = SUIT_SYMBOLS[suitLower];
                const colorClass = SUIT_COLORS[suitLower] === 'red' ? 'card-heart' : 'card-spade';
                const displayRank = rank === 'T' ? '10' : rank;
                return `${prefix}<span class="${colorClass}">${displayRank}${suitSymbol}</span>`;
            });
        
        return formatted;
    }

    /**
     * Format hole cards for display
     * @param {Array} holeCards - Array of two hole cards
     * @param {Object} options - Display options
     * @returns {string} Formatted HTML string
     */
    function formatHoleCards(holeCards, options = {}) {
        if (!holeCards || holeCards.length !== 2) {
            throw new Error('Hole cards must be an array of exactly 2 cards');
        }

        const opts = Object.assign({
            separator: ' ',
            colored: true
        }, options);

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
     * Get card image filename
     * @param {string|Object} card - Card to get image for
     * @returns {string} Image filename
     */
    function getCardImageName(card) {
        const parsed = parseCard(card);
        return `${parsed.rank}${parsed.suit}.${config.imageFormat}`;
    }

    /**
     * Compare two cards for sorting
     * @param {string|Object} a - First card
     * @param {string|Object} b - Second card
     * @returns {number} Comparison result
     */
    function compareCards(a, b) {
        const cardA = parseCard(a);
        const cardB = parseCard(b);
        
        const rankA = RANKS.indexOf(cardA.rank);
        const rankB = RANKS.indexOf(cardB.rank);
        
        if (rankA !== rankB) {
            return rankB - rankA;  // Higher rank first
        }
        
        // If ranks are equal, sort by suit (spades, hearts, diamonds, clubs)
        const suitOrder = ['s', 'h', 'd', 'c'];
        return suitOrder.indexOf(cardA.suit) - suitOrder.indexOf(cardB.suit);
    }

    /**
     * Sort an array of cards
     * @param {Array} cards - Cards to sort
     * @param {boolean} descending - Sort in descending order (default: true)
     * @returns {Array} Sorted array (new array)
     */
    function sortCards(cards, descending = true) {
        const sorted = [...cards].sort(compareCards);
        return descending ? sorted : sorted.reverse();
    }

    /**
     * Default CSS styles for cards
     * @returns {string} CSS string
     */
    function getDefaultStyles() {
        return `
            .card {
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
            
            /* Inline card colors for text */
            .card-heart, .card-diamond {
                color: #dc3545;
                font-weight: 600;
            }
            
            .card-spade, .card-club {
                color: #212529;
                font-weight: 600;
            }
        `;
    }

    /**
     * Inject default styles into the document
     */
    function injectDefaultStyles() {
        if (document.getElementById('cards-default-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cards-default-styles';
        style.textContent = getDefaultStyles();
        document.head.appendChild(style);
    }

    // Public API
    return {
        // Configuration
        configure,
        injectDefaultStyles,
        
        // Random number generation
        setSeed,
        getRandom,
        getHourlySeed,
        mulberry32,
        
        // Card parsing and utilities
        parseCard,
        compareCards,
        sortCards,
        
        // Deck utilities
        generateDeck,
        shuffleArray,
        shuffleDeck,
        Deck,
        
        // Rendering
        createCardElement,
        renderCards,
        
        // Formatting
        formatCardsInText,
        formatHoleCards,
        getCardImageName,
        
        // Constants (read-only)
        RANKS: Object.freeze([...RANKS]),
        SUITS: Object.freeze([...SUITS]),
        SUIT_SYMBOLS: Object.freeze({...SUIT_SYMBOLS}),
        SUIT_COLORS: Object.freeze({...SUIT_COLORS}),
        SUIT_NAMES: Object.freeze({...SUIT_NAMES})
    };
})();

// Export for use in Node.js/module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Cards;
}