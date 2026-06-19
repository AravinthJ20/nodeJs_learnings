const path = require('path');

const filePath = '/users/logesh/projects/demo/app.js';

console.log('Base name:', path.basename(filePath)); // ➤ app.js
console.log('Dir name:', path.dirname(filePath)); // ➤ /users/logesh/projects/demo
console.log('Extension:', path.extname(filePath)); // ➤ .js

// Join paths safely
const joinedPath = path.join(__dirname, 'data', 'output.txt');
console.log('Joined Path:', joinedPath);

// Normalize a messy path
console.log('Normalized:', path.normalize('/users/../users//logesh/demo//'));
