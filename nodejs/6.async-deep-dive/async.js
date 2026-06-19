const fs = require('fs');
const fsp = require('fs').promises;

//
// 1. Callback Style (Old way)
//
fs.readFile('file1.txt', 'utf-8', (err, data) => {
  if (err) return console.error('Callback Error:', err);
  console.log('📦 Callback:', data);
});
// "This works, but what if you had to read 3 files one after another? You’d nest callbacks inside callbacks… and that becomes callback hell."
// ❌ Messy. Hard to read. Hard to manage.

//
// 2. Promise Style
//
fsp.readFile('file2.txt', 'utf-8')
  .then((data) => console.log('📦 Promise:', data))
  .catch((err) => console.error('Promise Error:', err));

//
// "Promises flatten the code and make chaining easier. You can attach .then() and .catch() — it’s more readable."
// ✅ Cleaner than callbacks, but still feels chained.

// 3. Async/Await Style
//
async function readAsync() {
  try {
    const data = await fsp.readFile('file3.txt', 'utf-8');
    console.log('📦 Async/Await:', data);
  } catch (err) {
    console.error('Async/Await Error:', err);
  }
}
readAsync();
// "This feels just like writing normal, synchronous code — but it’s still async under the hood. It’s easy to read, debug, and scale."
// 🚀 Async/await = the cleanest and most readable way to write async code.

//
// 4. Use Case: Read 3 files
//

// a. Sequential (One after another)
async function readSequential() {
  console.time('⏱️ Sequential');
  const f1 = await fsp.readFile('file1.txt', 'utf-8');
  const f2 = await fsp.readFile('file2.txt', 'utf-8');
  const f3 = await fsp.readFile('file3.txt', 'utf-8');
  console.log('🪜 Sequential Read:', f1, f2, f3);
  console.timeEnd('⏱️ Sequential');
}

// b. Concurrent (All at once)
async function readConcurrent() {
  console.time('⚡ Concurrent');
  const [f1, f2, f3] = await Promise.all([
    fsp.readFile('file1.txt', 'utf-8'),
    fsp.readFile('file2.txt', 'utf-8'),
    fsp.readFile('file3.txt', 'utf-8'),
  ]);
  console.log('⚡ Concurrent Read:', f1, f2, f3);
  console.timeEnd('⚡ Concurrent');
}

setTimeout(() => {
  readSequential();
  readConcurrent();
}, 500); // Give above logs some space
