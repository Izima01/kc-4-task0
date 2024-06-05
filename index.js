const http = require('http');
const fs = require('fs');
const path = require('path');
const basicAuth = require('./auth');

const memoriesFilePath = path.join(__dirname, 'memories.json');

function getRandomNumber() {
    return Math.floor(Math.random() * (99 - 10 + 1)) +10;
}

const loadMemories = () => {
  if (fs.existsSync(memoriesFilePath)) {
    const data = fs.readFileSync(memoriesFilePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

const saveMemories = (memories) => {
  fs.writeFileSync(memoriesFilePath, JSON.stringify(memories, null, 2));
};

const server = http.createServer((req, res) => {
    basicAuth(req, res, () => {
        if (req.url === '/memories' && req.method === 'GET') {
            const memories = loadMemories();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(memories));
        } else if (req.url === '/memories' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              const newMemory = { id: getRandomNumber(), content: JSON.parse(body) }
              const memories = loadMemories();
              memories.push(newMemory);
              saveMemories(memories);
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, newMemory }));
            });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});