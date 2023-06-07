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
    console.log(data.toString());
  });
  networker.init();
  readline.on('line', (word) => {
    word = word.toLowerCase();
    networker.send(word);
  });
});
