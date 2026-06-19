//1. Running Node.js
// console.log("Hello, Node.js 2025!");

// 2. File Write/Read
// Sync
const fs = require('fs');

// Write File (Sync)
fs.writeFileSync('test.txt', 'Hello, Node.js 2025!');

// Read File (Sync)
const data = fs.readFileSync('test.txt', 'utf-8');
console.log('Read Synchronously:', data);
// Async


