'use strict';

const net = require('net');
const uniqueID = require('./randomIdGenerator.js');
const wordMap = require('./dictionary.js');
const Networker = require('./networker');

const clients = [];
const usedWordMap = new Map();
let activeLetter = null;
let activeClient = null;
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
    if (wordMap.has(word)) {
      if (usedWordMap.has(word)) {
        console.log(`The word "${word}" has already been used.`);
        networker.send('This word has already been used. Try again');
        return;
      }
      if (!(word.charAt(0) === activeLetter || turnsCount === 1)) {
        console.log(`The word "${word}" starts with wrong letter.`);
        networker.send('This word starts with wrong letter. Try again');
        return;
      }
      wordCount += 1;
      activeLetter = word.charAt(word.length - 1);
      usedWordMap.set(word, null);
      console.log(`The word "${word}" exists in the dictionary.`);
      networker.send('Good job!');
      finishGame();
      startGame();
    } else {
      console.log(`The word "${word}" does not exist in the dictionary.`);
      networker.send('This word does not exist. Try again');
    }
  }

  activeClient = { socket, networker };
  clients.push(activeClient);
  if (clients.length === 2) {
    console.log('The minimum amount of players is reached');
    console.log('The game will start in 5 seconds');
    setTimeout(startGame, 5000);
  }
});

server.on('error', (e) => {
  console.log(e);
});

function startGame() {
  turnsCount += 1;
  if (wordCountCopy === wordCount && turnsCount > 1) {
    console.log('The game is over!');
    finishGame();
    activeClient.networker.send('You lost...');
    const clientId = activeClient.socket.id;
    for (const user of clients) {
      if (user.socket.id !== clientId) {
        user.networker.send('You won!');
      }
    }
    server.unref();
    return;
  }
  wordCountCopy = wordCount;
  activeClient = clients[wordCount % clients.length];
  activeClient.networker.send('Now it`s your turn!');
  if (activeLetter) {
    activeClient.networker.send(`Start with letter "${activeLetter}"`);
  }
  gameInterval = setInterval(startGame, 10000);
}

function finishGame() {
  clearInterval(gameInterval);
}

server.listen(8000);
