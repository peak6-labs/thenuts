# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"The Nuts" is a single-page poker training web game where players identify the best possible poker hand (the nuts) given 5 community cards. The game runs entirely in the browser with no backend.

## Architecture

The entire application is contained in **index.html** (1055 lines):
- **Lines 7-427**: CSS styles (responsive design, mobile-optimized)
- **Lines 429**: External pokersolver library loaded from CDN
- **Lines 432-513**: HTML structure (game container, modals, controls)
- **Lines 515-1054**: Game logic in vanilla JavaScript

### Key Components

1. **Seeded Random Number Generator** (lines 610-635)
   - Uses mulberry32 algorithm with hourly UTC seeds
   - Ensures all players worldwide get identical card sequences each hour
   - Creates competitive scoring environment

2. **Poker Logic** (lines 657-706)
   - `findTheNuts()`: Exhaustively checks all possible 2-card combinations
   - Uses pokersolver's `Hand.solve()` for evaluation and `Hand.compare()` for ranking
   - Generates plausible wrong answers from random hole card samples

3. **Game Flow**
   - 60-second timed rounds with auto-advance after each answer
   - Pre-generates 50 scenarios at game start for performance
   - Mobile-optimized with native share API integration

## Development Setup

The game has no build process or dependencies to install locally. Simply open `index.html` in a browser.

The pokersolver library (v2.1.4) is loaded from CDN and provides the `Hand` global object for poker hand evaluation.

## Code Conventions

- All game logic is in vanilla JavaScript (no framework)
- Event handlers use inline `onclick` attributes
- CSS uses BEM-like class naming (`.game-container`, `.choice-btn`)
- Mobile-first responsive design with touch event handling