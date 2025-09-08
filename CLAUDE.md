# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A suite of poker training games designed to teach players from basic hand recognition to expert-level play. The project aims to create a complete learning progression through multiple game levels, helping players build skills incrementally.

### Current Games
1. **index.html** - Main menu page linking to all available games
2. **foundation-level.html** - "Talk the Talk" - Three foundation games for learning basic poker hands
3. **the-nuts.html** - "The Nuts" - Advanced game identifying the best possible hand

## Project Goals

We're building a comprehensive poker training platform with 10 progressive games across 4 difficulty levels (see game-progression.md for full list). The goal is to take players from zero poker knowledge to expert-level board reading skills.

### Implementation Status
- ✅ Foundation Level (3/3 games complete in foundation-level.html)
- ⏳ Beginner Level (0/3 games - focusing on community cards)
- ⏳ Intermediate Level (0/3 games - opponent awareness)
- ✅ Advanced Level (1/1 game complete in the-nuts.html)

## Current State

### Foundation Level Games (foundation-level.html)
"Talk the Talk" - Learn the basic foundational lingo of poker
- **Name That Hand** - 30 rounds identifying poker hands from 5 cards
- **Hand vs Hand** - 10 rounds comparing which of two hands wins
- **Best Five from Seven** - 10 rounds selecting best 5-card hand from 7 cards
- Features high score tracking, mobile-friendly menu interface
- No progression locks - all games immediately accessible

### Advanced Level Game (the-nuts.html)
"The Nuts" has been transformed from showing hand names to showing hole cards, making it more challenging and educational. Players must now understand poker hand rankings and visualize what hands the hole cards make.

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
- **index.html** - Main menu page with links to all games
- **foundation-level.html** - Contains all 3 foundation level games (~1500 lines)
- **the-nuts.html** - The advanced nuts identification game (~2200 lines)
- **game-progression.md** - Documentation of the full 10-game progression plan

### the-nuts.html Architecture (~2200 lines):
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

The games have no build process or dependencies to install locally. Simply open files in a browser:
- `index.html` - Main menu to access all games
- `foundation-level.html` - Foundation level training games
- `the-nuts.html` - The Nuts advanced game

The pokersolver library (v2.1.4) is loaded from CDN (jsdelivr) and provides the `Hand` global object for poker hand evaluation.

## Code Conventions

- All game logic is in vanilla JavaScript (no framework)
- Event handlers use inline `onclick` attributes
- CSS uses BEM-like class naming (`.game-container`, `.choice-btn`)
- Mobile-first responsive design with touch event handling
- Hints use format: `(Makes: [Hand Type])`

## Recent Changes

### The Nuts Game
- Transformed from showing hand names to showing hole cards
- Added 3-level progression system with 100% accuracy requirement
- Implemented pause/unpause functionality for testing
- Changed from failing on first mistake to completing all 15 hands
- Updated terminology from Easy/Medium/Hard to Level 1/2/3
- Fixed Level 1 hints to show actual hand names for all choices

### Foundation Level Games
- Created foundation-level.html with 3 training games
- Implemented "Talk the Talk" with Name That Hand, Hand vs Hand, and Best Five from Seven
- Added high score tracking with localStorage
- Made mobile-friendly with menu-first design
- Removed progression locks for immediate accessibility
- Changed to 30 rounds for Name That Hand with even distribution

### Project Structure
- Renamed index.html to the-nuts.html
- Created new index.html as main menu hub
- Added game-progression.md documenting the full 10-game plan