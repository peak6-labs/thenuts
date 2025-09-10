# Architecture Documentation

## Overview

The poker training games have been refactored from monolithic HTML files with embedded JavaScript to a modular TypeScript architecture. This provides better maintainability, code reuse, and AI-assisted development capabilities.

## Directory Structure

```
/src
  /components     # Reusable UI components
    - Modal.ts          # Modal dialog system
    - Timer.ts          # Game timer with pause support
    - ScoreDisplay.ts   # Score tracking display
    
  /games         # Individual game implementations
    /foundation   # Foundation level games
    /beginner     # Beginner level games
    /intermediate # Intermediate level games  
    /advanced     # Advanced level games
    - BaseGame.ts # Abstract base class for all games
    
  /lib           # Core libraries
    - cards.ts    # Card rendering and deck utilities
    - poker.ts    # Poker hand evaluation logic
    - random.ts   # Seeded random number generation
    - storage.ts  # LocalStorage persistence
    
  /types         # TypeScript type definitions
    - cards.d.ts  # Card-related types
    - games.d.ts  # Game interface types
    - ui.d.ts     # UI component types
    
  /styles        # Shared stylesheets
    - main.css    # Core styles and theme

/dist           # Compiled JavaScript (generated)
/public         # Static HTML files
```

## Key Improvements

### 1. TypeScript Migration
- **Type Safety**: All code now has full TypeScript type checking
- **Better IntelliSense**: IDE support for autocomplete and refactoring
- **Compile-time Error Detection**: Catches bugs before runtime
- **Self-documenting**: Types serve as inline documentation

### 2. Modular Architecture
- **Component Reuse**: Shared UI components (Modal, Timer, Score) used across all games
- **Separation of Concerns**: Game logic, UI, and utilities are clearly separated
- **Single Responsibility**: Each module has one clear purpose
- **Dependency Management**: ES modules provide clean import/export

### 3. Shared Libraries

#### Cards Library (`src/lib/cards.ts`)
- Card parsing and validation
- Deck generation and shuffling
- Card rendering (text and image support)
- Formatting utilities for display

#### Poker Library (`src/lib/poker.ts`)
- Hand evaluation and ranking
- Board texture analysis
- Hand comparison utilities
- Specific hand generation for training

#### Random Library (`src/lib/random.ts`)
- Seeded random number generation (Mulberry32)
- Hourly/daily seed generation for consistent puzzles
- Array shuffling utilities
- Random selection helpers

#### Storage Library (`src/lib/storage.ts`)
- High score persistence
- Game progress tracking
- Settings management
- Import/export functionality

### 4. Base Game Class

The `BaseGame` abstract class provides:
- Standard game lifecycle (initialize, start, pause, reset)
- Score and streak tracking
- Timer integration
- High score management
- Result display modal
- Scenario generation framework

### 5. Reusable UI Components

#### Modal Component
- Configurable title, content, and buttons
- Backdrop click and ESC key support
- Animation support
- Static methods for common patterns (alert, confirm)

#### Timer Component
- Countdown timer with pause/resume
- Visual warning states
- Multiple display formats
- Click-to-pause functionality

#### Score Display Component
- Current/total score tracking
- Streak display
- Accuracy percentage
- Real-time updates

## Build Process

### Development
```bash
npm install        # Install dependencies
npm run build      # Compile TypeScript
npm run watch      # Watch mode for development
```

### Production Deployment
The GitHub Actions workflow automatically:
1. Checks out code
2. Installs dependencies
3. Builds TypeScript
4. Deploys to GitHub Pages

## Migration Guide

### Converting Existing Games

1. **Extract Game Logic**
   ```typescript
   export class MyGame extends BaseGame {
     protected generateScenarios(): GameScenario[] {
       // Generate game scenarios
     }
     
     protected renderScenario(): void {
       // Render current scenario
     }
   }
   ```

2. **Use Shared Components**
   ```typescript
   import { Modal } from '../components/Modal';
   import { Timer } from '../components/Timer';
   
   this.timer = new Timer({ duration: 60 });
   this.timer.attachTo('timer-display');
   ```

3. **Leverage Type Safety**
   ```typescript
   import type { Card, HandRanking } from '../types/cards';
   
   function evaluateHand(cards: Card[]): HandRanking {
     // Type-safe hand evaluation
   }
   ```

## Benefits for AI-Assisted Development

### 1. Clear File Boundaries
- Each component/game in its own file (200-400 lines max)
- AI tools can understand context without parsing 2000+ line files
- Easier to provide specific file context to AI

### 2. Type Information
- TypeScript types provide clear contracts
- AI can better understand expected inputs/outputs
- Reduces ambiguity in code generation

### 3. Consistent Patterns
- All games extend BaseGame with same interface
- UI components follow consistent API patterns
- Makes it easier for AI to generate new features

### 4. Modular Testing
- Each module can be tested independently
- Clear separation makes it easier to identify issues
- AI can generate targeted tests for specific modules

## Static Site Deployment

Despite using TypeScript and modules, this remains a static site:
- TypeScript compiles to regular JavaScript
- No server or backend required
- Works perfectly with GitHub Pages
- Modern browsers support ES modules natively

The compiled structure:
```
index.html         # Main menu
foundation.html    # Foundation games
the-nuts.html      # Advanced game
/dist/*.js         # Compiled TypeScript
/images/           # Card images
/styles/           # CSS files
```

## Future Enhancements

### Planned Improvements
1. **Progressive Web App**: Add offline support with service workers
2. **Animation Library**: Smooth card animations and transitions
3. **Sound Effects**: Audio feedback for actions
4. **Achievement System**: Unlock badges and rewards
5. **Statistics Dashboard**: Detailed performance analytics

### Easy Extensions
- New games just extend BaseGame
- New UI components follow established patterns
- Shared utilities can be expanded without breaking existing code
- Type definitions ensure compatibility

## Conclusion

This architecture provides a solid foundation for:
- **Scalability**: Easy to add new games and features
- **Maintainability**: Clear separation and type safety
- **AI Compatibility**: Optimized for AI-assisted development
- **User Experience**: Consistent UI and smooth performance
- **Developer Experience**: Modern tooling and clear patterns

The refactoring maintains the simplicity of a static site while providing the benefits of modern development practices.