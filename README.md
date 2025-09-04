# The Nuts - Poker Training Game

A web-based poker training game that helps players practice identifying "the nuts" - the best possible poker hand given the community cards.

## Play Now

Open `index.html` in any modern web browser to play. No installation required.

## How It Works

- **60-second timed rounds** - Identify as many nuts as possible
- **Synchronized gameplay** - All players worldwide get the same card sequence each hour (UTC)
- **Competitive scoring** - Share and compare scores with friends
- **Mobile-friendly** - Responsive design with native sharing on mobile devices

## Game Rules

"The nuts" is the absolute best possible hand that ANY player could have given the 5 community cards on the board. You need to imagine what 2 hole cards would create the strongest possible hand.

For example, if the board shows: 10♣ 10♠ 3♥ K♣ 8♥  
The nuts would be Four 10s (if someone held 10♥ 10♦)

## Technical Details

- Pure vanilla JavaScript, no framework dependencies
- Uses pokersolver library (loaded from CDN) for hand evaluation
- Seeded random number generator ensures consistent gameplay per hour
- Fully client-side, no backend required

## Development

Simply edit `index.html` and refresh your browser. The game uses:
- Mulberry32 PRNG with UTC hour-based seeds
- Exhaustive search algorithm to find the absolute nuts
- Pokersolver's hand evaluation and comparison methods

## License

Open source - feel free to fork and modify!