'use strict';

const net = require('net');

const onData = (data) => {
  console.log('received:', data);
};

const server = net.createServer((socket) => {
  socket.write('Hi');
  socket.on('data', onData);
  socket.on('error', (err) => {
    console.log('Socket error', err);
  });
});

server.listen(8000);

server.on('error', (err) => {
  console.log('Server error', err);
});
