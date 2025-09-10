# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A suite of poker training games designed to teach players from basic hand recognition to expert-level play. The project is built as a Single Page Application (SPA) using TypeScript and ES modules, with no build dependencies beyond TypeScript compilation.

### Architecture
- **index.html** - SPA entry point with hash-based routing
- **TypeScript/ES Modules** - All game logic in modular TypeScript
- **No Framework** - Vanilla TypeScript with custom lightweight router
- **State Persistence** - Games survive page refreshes via sessionStorage

## Project Goals

We're building a comprehensive poker training platform with 10 progressive games across 4 difficulty levels (see game-progression.md for full list). The goal is to take players from zero poker knowledge to expert-level board reading skills.

### Implementation Status
- ✅ Foundation Level (3/3 games complete)
- ⏳ Beginner Level (0/3 games - focusing on community cards)
- ⏳ Intermediate Level (0/3 games - opponent awareness)
- ✅ Advanced Level (1/1 game complete)

## Current State

### Single Page Application
The entire game suite runs as a SPA from `index.html` with hash-based routing:
- `#/` - Home page with game selection
- `#/foundation` - Foundation games menu
- `#/foundation?game=name-that-hand` - Specific foundation game
- `#/the-nuts` - The Nuts advanced game

### Foundation Level Games
"Talk the Talk" - Learn the basic foundational lingo of poker
- **Name That Hand** - 30 rounds identifying poker hands from 5 cards
- **Hand vs Hand** - 10 rounds comparing which of two hands wins
- **Best Five from Seven** - 10 rounds selecting best 5-card hand from 7 cards

### Advanced Level Game
"The Nuts" - Identify the best possible hand with hole cards shown

### Key Features Implemented

1. **Progressive Difficulty System**
   - **Level 1**: Shows hole cards with hints indicating what hand each choice makes
   - **Level 2**: Shows only hole cards, no hints (standard difficulty)
   - **Level 3**: Shows hole cards with very close hand strengths, 30-second timer
   - Must get 15/15 correct to advance to next level
   - Tracks best streaks and attempts per level

2. **Educational Approach**
   - Players complete all 15 hands before seeing results (not punished on first mistake)
   - Non-insulting terminology (Level 1/2/3 instead of Easy/Medium/Hard)
   - Level 1 shows hints for ALL choices to avoid making correct answer obvious
   - Clear feedback showing what hands were made

3. **Testing Features**
   - Countdown timer is clickable to pause/unpause for testing
   - Visual indicator (orange pulsing) when paused
   - Pause symbol (⏸) shown in timer text

## Architecture

### File Structure
```
/src (TypeScript source)
  /games
    /foundation - Foundation level games
    /advanced - Advanced level games
    BaseGame.ts - Base class for all games
  /lib
    router.ts - SPA routing
    cards.ts - Card utilities
    poker.ts - Poker logic
    pokersolver-wrapper.ts - Hand evaluation
  /components
    Modal.ts, Timer.ts, ScoreDisplay.ts
/dist (Compiled JavaScript)
  [Mirrors src structure with .js files]
/archive-old-code (Old HTML implementations)
index.html - SPA entry point
```

### Key Components

1. **Seeded Random Number Generator** (lines ~710-735)
   - Uses mulberry32 algorithm with hourly UTC seeds
   - Seeds offset by difficulty level (+0/+1000/+2000) for variety
   - Ensures all players worldwide get identical sequences per level/hour

2. **Poker Logic** (lines ~757-890)
   - `findTheNuts()`: Returns both hand description AND hole cards
   - Uses pokersolver's `Hand.solve()` for evaluation and `Hand.winners()` for comparison
   - Generates strategic decoys based on board texture

3. **Difficulty-Specific Generation** (lines ~1270-1480)
   - `generateLevel1Scenario()`: Wide strength gaps, adds hints for all choices
   - `generateLevel2Scenario()`: Standard difficulty, no hints
   - `generateLevel3Scenario()`: Near-nuts hands only, very challenging

4. **Game Flow**
   - 60-second timer for Level 1-2, 30-second for Level 3
   - Must complete all 15 hands before evaluation
   - Auto-advances through hands after each answer
   - Progressive unlock system with perfect score requirement

5. **Pause System** (lines ~1640-1670)
   - Click timer to pause/unpause
   - Tracks accumulated pause time
   - Visual feedback with CSS animation

## State Management

```javascript
// Core game state
let currentDifficulty = 'level1'; // 'level1', 'level2', 'level3'
let streakCount = 0; // Current correct answers in this attempt
let completedLevels = new Set(); // Tracks which levels passed
let attemptCounts = { level1: 0, level2: 0, level3: 0 };
let bestStreaks = { level1: 0, level2: 0, level3: 0 };

// Timer pause state (for testing)
let isPaused = false;
let pausedElapsedTime = 0;
let pauseStartTime = null;
```

## Development Setup

```bash
npm install      # Install TypeScript
npm run build    # Compile TypeScript to JavaScript
npm run serve    # Start dev server on localhost:8000
```

Then open http://localhost:8000/ to play.

The pokersolver library (v2.1.4) is loaded from CDN in index.html.

## Code Conventions

- All game logic is in vanilla JavaScript (no framework)
- Event handlers use inline `onclick` attributes
- CSS uses BEM-like class naming (`.game-container`, `.choice-btn`)
- Mobile-first responsive design with touch event handling
- Hints use format: `(Makes: [Hand Type])`

## Recent Changes (2025-09-10)

### Migrated to Single Page Application
- Refactored entire codebase from monolithic HTML files to TypeScript SPA
- Implemented hash-based router for GitHub Pages compatibility
- Added state persistence across page refreshes
- All games now extend BaseGame class with lifecycle methods
- Archived old HTML implementations in `/archive-old-code/`

### TypeScript Architecture
- Modular ES modules with no framework dependencies
- Shared libraries for cards, poker logic, and UI components
- Type-safe development with full TypeScript support
- Professional hand evaluation via pokersolver wrapper