# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"The Nuts" is a single-page poker training web game where players identify the best possible poker hand (the nuts) given 5 community cards. The game features a progressive difficulty system with three levels that require perfect accuracy to advance.

## Current State (as of last update)

The game has been transformed from showing hand names to showing hole cards, making it more challenging and educational. Players must now understand poker hand rankings and visualize what hands the hole cards make.

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

The entire application is contained in **index.html** (~2200 lines):
- **Lines 7-520**: CSS styles (responsive design, mobile-optimized, difficulty UI)
- **Line 531**: External pokersolver library loaded from CDN
- **Lines 534-650**: HTML structure (game container, modals, difficulty progress, controls)
- **Lines 652-2230**: Game logic in vanilla JavaScript

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

The game has no build process or dependencies to install locally. Simply open `index.html` in a browser.

The pokersolver library (v2.1.4) is loaded from CDN and provides the `Hand` global object for poker hand evaluation.

## Code Conventions

- All game logic is in vanilla JavaScript (no framework)
- Event handlers use inline `onclick` attributes
- CSS uses BEM-like class naming (`.game-container`, `.choice-btn`)
- Mobile-first responsive design with touch event handling
- Hints use format: `(Makes: [Hand Type])`

## Recent Changes

- Transformed from showing hand names to showing hole cards
- Added 3-level progression system with 100% accuracy requirement
- Implemented pause/unpause functionality for testing
- Changed from failing on first mistake to completing all 15 hands
- Updated terminology from Easy/Medium/Hard to Level 1/2/3
- Fixed Level 1 hints to show actual hand names for all choices