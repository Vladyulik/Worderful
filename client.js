'use strict';

const net = require('net');
const Networker = require('./networker');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const socket = net.createConnection({ port: 8000, host: 'localhost' });

socket.on('connect', () => {
  const networker = new Networker(socket, (data) => {
    const text = data.toString();
    console.log(text);
    switch (text) {
    case 'Now it`s your turn!':
      readline.resume();
      break;
    case 'Good job!':
      readline.pause();
      break;
    case 'You lost...':
      readline.close();
      socket.destroy();
      break;
    case 'You won!':
      readline.close();
      socket.destroy();
      break;
    default:
      break;
    }
  });
  networker.init();
  readline.on('line', (word) => {
    word = word.toLowerCase();
    networker.send(word);
  });
});
