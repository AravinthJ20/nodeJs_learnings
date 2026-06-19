const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/file') {
    const readStream = fs.createReadStream(path.resolve(__dirname,'sample.mp4'));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    readStream.pipe(res); // Streams the file
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
