# Testing the New Architecture

## The CORS Issue

ES modules (`import`/`export`) don't work when opening HTML files directly from the file system (`file://` protocol) due to browser security restrictions. You need a local web server.

## Quick Start

### Option 1: Using Node.js (Recommended)
```bash
# Start the development server
npm run serve

# Or build and serve in one command
npm start
```

Then open: http://localhost:8000/test-new-architecture.html

### Option 2: Using Python
```bash
# If you have Python 3
python3 serve.py

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open: http://localhost:8000/test-new-architecture.html

### Option 3: Using VS Code
If you use VS Code, install the "Live Server" extension:
1. Install the extension
2. Right-click on `test-new-architecture.html`
3. Select "Open with Live Server"

### Option 4: Using any other local server
```bash
# Using http-server (npm package)
npx http-server

# Using PHP
php -S localhost:8000

# Using Ruby
ruby -run -ehttpd . -p8000
```

## What to Test

Once the server is running, open http://localhost:8000/test-new-architecture.html and test:

1. **Card Library** - Tests card parsing, deck generation, shuffling
2. **Random Library** - Tests seeded random generation
3. **Storage Library** - Tests localStorage operations
4. **UI Components** - Creates Modal, Timer, and Score displays
5. **Name That Hand** - Play the foundation game
6. **The Nuts** - Play the advanced game

## Testing on GitHub Pages

The architecture works perfectly on GitHub Pages because it's served over HTTPS. The CORS issue only affects local `file://` testing.

Once deployed to GitHub Pages, everything works without any server:
- https://yourusername.github.io/thenuts/

## Development Workflow

1. **Start the dev server**: `npm run serve`
2. **In another terminal, watch for changes**: `npm run watch`
3. **Make changes to TypeScript files in `/src`**
4. **Changes compile automatically**
5. **Refresh browser to see updates**

## Common Issues

### "Module not found" errors
- Make sure you ran `npm run build` first
- Check that `/dist` folder exists with compiled JS files

### Changes not showing
- Hard refresh the browser (Cmd+Shift+R or Ctrl+Shift+F5)
- The server has cache disabled, but browsers can be stubborn

### Server port already in use
- Change the PORT in `serve.js` or `serve.py`
- Or kill the existing process using port 8000

## Production Testing

To test exactly how it will work on GitHub Pages:
```bash
# Build the production files
npm run build

# Serve with cache enabled (like GitHub Pages)
python3 -m http.server 8000
```

This simulates the GitHub Pages environment locally.