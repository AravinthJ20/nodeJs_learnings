const fs = require('fs');

// Write File (Sync)
fs.writeFileSync('test.txt', 'Hello, Node.js 2025!');

// Read File (Sync)
const data = fs.readFileSync('test.txt', 'utf-8');
console.log('Read Synchronously:', data);


console.log('This logs BEFORE async read/write completes!');



// async

fs.writeFile('async.txt', 'Async Hello!', (err) => {
  if (err) throw err;
  console.log('File written.');
  console.log('Email Sent.');

  fs.readFile('async.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log('Read Asynchronously:', data);
  });
});

console.log('This logs BEFORE async read/write completes!');
