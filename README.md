# The Nuts - Poker Training Game

A web-based poker training game that helps players practice identifying "the nuts" - the best possible poker hand given the community cards. Now featuring a progressive difficulty system that challenges players to truly understand poker hand strengths!

## Play Now

Open `index.html` in any modern web browser to access the game menu. No installation required.

## Game Features

### Progressive Difficulty System
- **Level 1 (Learning Mode)**: Shows hole cards with hints indicating what hand each choice makes
- **Level 2 (Standard Mode)**: Shows only hole cards, no hints - the classic challenge
- **Level 3 (Expert Mode)**: Near-nuts hands only with 30-second timer - extremely challenging

### Progression Requirements
- Must achieve **15/15 perfect score** to advance to the next level
- Track your best streaks and attempts per level
- Educational approach - complete all 15 hands before seeing results

### Core Gameplay
- **Timed rounds** - 60 seconds for Level 1-2, 30 seconds for Level 3
- **Synchronized gameplay** - All players worldwide get the same card sequence each hour (UTC) per level
- **Competitive scoring** - Share and compare scores with friends
- **Mobile-friendly** - Responsive design with native sharing on mobile devices
- **Pause feature** - Click the timer to pause/unpause (for testing and learning)

## How to Play

"The nuts" is the absolute best possible hand that ANY player could have given the 5 community cards on the board. You need to look at the hole card options and determine which ones would create the strongest possible hand.

### Example
If the board shows: 10♣ 10♠ 3♥ K♣ 8♥  
And you see these hole card options:
- 10♥ 10♦ (Makes: Four of a Kind - THE NUTS!)
- K♥ K♦ (Makes: Full House)
- A♣ 4♣ (Makes: Flush)
- 3♣ 3♦ (Makes: Full House)

The correct answer would be 10♥ 10♦ as it makes Four 10s, the best possible hand.

## What's New

### Recent Updates
- **Hole Cards Display**: Game now shows hole cards instead of hand names for increased challenge
- **3-Level Progression**: Master each level with perfect accuracy to advance
- **Educational Hints**: Level 1 shows what each hand makes to help learning
- **Pause/Unpause**: Click timer to pause for testing and practice
- **Improved Feedback**: See exactly what hands were made after each round

## Technical Details

- Pure vanilla JavaScript, no framework dependencies
- Uses pokersolver library (loaded from CDN) for hand evaluation
- Seeded random number generator ensures consistent gameplay per hour/level
- Fully client-side, no backend required
- ~2200 lines of code in a single HTML file

## Development

Simply edit `the-nuts.html` and refresh your browser. The game uses:
- Mulberry32 PRNG with UTC hour-based seeds (offset per difficulty)
- Exhaustive search algorithm to find the absolute nuts
- Pokersolver's `Hand.solve()` and `Hand.winners()` methods
- Strategic decoy generation based on board texture
- Difficulty-specific scenario generation

### Key Functions
- `findTheNuts()`: Returns best hand description and hole cards
- `generateLevel1/2/3Scenario()`: Creates difficulty-specific challenges
- `togglePause()`: Handles timer pause/resume functionality
- `handleLevelComplete/Failure()`: Manages progression logic

## Tips for Success

### Level 1 (Learning)
- Pay attention to the hints - they tell you exactly what each hand makes
- Focus on learning hand rankings and recognizing patterns
- Take your time - you have 60 seconds

### Level 2 (Standard)
- No more hints - you need to visualize what each hand makes
- Think about all possible combinations
- Remember: the nuts is the BEST possible hand anyone could have

### Level 3 (Expert)
- Very close hand strengths - often just one rank apart
- Only 30 seconds - quick decision making required
- Watch for subtle differences like kicker cards

## License

Open source - feel free to fork and modify!