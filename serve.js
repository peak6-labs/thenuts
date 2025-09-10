#!/usr/bin/env node
/**
 * Simple HTTP server for testing ES modules locally
 * Requires Node.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = path.join(__dirname, parsedUrl.pathname);
  
  // Default to index.html
  if (pathname.endsWith('/')) {
    pathname = path.join(pathname, 'index.html');
  }
  
  fs.exists(pathname, (exist) => {
    if (!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    
    // Read file
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // Set MIME type
        const ext = path.parse(pathname).ext;
        const mimeType = MIME_TYPES[ext] || 'text/plain';
        
        // Add headers for ES modules
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Cache-Control', 'no-cache');
        
        res.end(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log('🎮 Poker Training Games Server');
  console.log(`📡 Server running at http://localhost:${PORT}/`);
  console.log(`🎯 Open http://localhost:${PORT}/test-new-architecture.html to test`);
  console.log(`🏠 Open http://localhost:${PORT}/ for main menu`);
  console.log('\nPress Ctrl+C to stop the server');
});