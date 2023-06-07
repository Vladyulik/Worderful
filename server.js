'use strict';

const net = require('net');
const uniqueID = require('./randomIdGenerator.js');
const wordMap = require('./dictionary.js');
const Networker = require('./networker');

const clients = [];
const usedWordMap = new Map();
let wordCount = 0;
let wordCountCopy = 0;
let turnsCount = 0;
let gameInterval;
const server = net.createServer();

server.on('connection', (socket) => {
  socket.id = uniqueID();
  const networker = new Networker(socket, handleData);
  networker.init();

  socket.on('end', () => {
    console.log('socket end');
  });
  socket.on('close', () => {
    console.log('socket close');
  });
  socket.on('error', (e) => {
    if (e.code === 'ECONNRESET') {
      return;
    }
    console.log(e);
  });

  function handleData(data) {
    const word = data.toString().toLowerCase();
    if (wordMap.has(word) && !usedWordMap.has(word)) {
      wordCount += 1;
      usedWordMap.set(word, null);
      console.log(`The word "${word}" exists in the dictionary.`);
      networker.send('Good job!');
    } else {
      console.log(`The word "${word}" does not exist in the dictionary / has already been used.`);
      networker.send('The word does not exist / has already been used. Try again');
    }
  }

  clients.push({ socket, networker });
  if (clients.length === 2) {
    startGame();
  }
});

server.on('error', (e) => {
  console.log(e);
});

function startGame() {
  let client = clients[clients.length - 1];
  gameInterval = setInterval(() => {
    turnsCount += 1;
    if (wordCountCopy === wordCount && turnsCount > 1) {
      console.log('The game is over!');
      stopGame();
      client.networker.send('You lost...');
      const clientId = client.socket.id;
      for (const user of clients) {
        if (user.socket.id !== clientId) {
          user.networker.send('You won!');
        }
      }
      server.unref();
      return;
    }
    wordCountCopy = wordCount;
    client = clients[wordCount % clients.length];
    client.networker.send('Now it`s your turn!');
  }, 5000);
}

function stopGame() {
  clearInterval(gameInterval);
}

server.listen(8000);
