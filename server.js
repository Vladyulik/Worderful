'use strict';

const net = require('net');
const uniqueID = require('./randomIdGenerator.js');
const wordMap = require('./dictionary.js');
const Networker = require('./networker');

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
      console.log(`The word "${word}" exists in the dictionary.`);
      networker.send('Good job!');
    } else {
      console.log(`The word "${word}" does not exist in the dictionary.`);
      networker.send('The word does not exist. Try again');
    }
  }
});

server.on('error', (e) => {
  console.log(e);
});

server.listen(8000);
