# Poker Training Games

A comprehensive poker training platform built as a Single Page Application with TypeScript. Features progressive difficulty levels from basic hand recognition to expert-level play.

## Play Now

🎮 **Open `index.html` in any modern browser or visit [GitHub Pages deployment](https://yourusername.github.io/thenuts/)**

## Features

- 🎯 **Single Page Application** - Smooth navigation with state persistence
- 🃏 **Professional Hand Evaluation** - Powered by pokersolver library
- 📱 **Mobile Responsive** - Works on all devices
- 💾 **Progress Tracking** - High scores and achievements saved locally
- 🔄 **State Persistence** - Games survive page refreshes
- ⚡ **TypeScript** - Type-safe development with ES modules
- 🚀 **No Framework** - Vanilla TypeScript keeps it lightweight

## Game Progression

### 🎓 Foundation Level - "Talk the Talk"
Learn the basic foundational lingo of poker:
1. **Name That Hand** - Identify poker hands from 5 cards (30 rounds)
2. **Hand vs Hand** - Compare which of two hands wins (10 rounds)
3. **Best Five from Seven** - Select the best 5-card hand from 7 cards (10 rounds)

### 🎯 Beginner Level - "Community Cards" (Coming Soon)
Understand how community cards work:
- Complete the Hand
- River Decisions
- Reading the Board

### 🧠 Intermediate Level - "Opponent Awareness" (Coming Soon)
Learn to consider opponent hands:
- Beat This Hand
- Multiple Opponents
- Danger Boards

### 🏆 Advanced Level - "The Nuts"
The ultimate challenge with progressive difficulty:
- **Level 1**: Practice mode with hints showing what each hand makes
- **Level 2**: Standard difficulty with no hints
- **Level 3**: Expert mode with close hand strengths and 30-second timer
- Must achieve 15/15 correct to advance to the next level

## Development Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run serve

# Watch mode for development
npm run watch
```

Then open http://localhost:8000

## Architecture

Built as a modern SPA with TypeScript:

```
/src
  /games         - Game implementations
    /foundation  - Foundation level games
    /advanced    - Advanced level games
    BaseGame.ts  - Base class for all games
  /lib          - Shared libraries
    router.ts   - SPA routing with state persistence
    cards.ts    - Card utilities and rendering
    poker.ts    - Poker logic and hand evaluation
  /components   - Reusable UI components
    Modal.ts    - Game modals
    Timer.ts    - Countdown timer with pause
    ScoreDisplay.ts - Score tracking
```

## Technical Features

- **Hash-based routing** - Works on GitHub Pages (#/route)
- **State persistence** - Games survive browser refresh
- **Seeded random** - Consistent games worldwide per hour
- **Professional evaluation** - Pokersolver library for accuracy
- **Mobile optimized** - Touch-friendly with responsive design
- **No backend** - Fully client-side application

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Feel free to fork and submit pull requests! The codebase is designed to be AI-friendly with clear TypeScript types and modular architecture.

## License

Open source - MIT License