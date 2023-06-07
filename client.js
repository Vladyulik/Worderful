'use strict';

const net = require('net');

const socket = new net.Socket();

socket.on('data', (data) => {
  console.log('Received:', data);
});

socket.connect({
  port: 8000,
  host: '127.0.0.1',
}, () => {
  socket.write('Hi');
});

//socket.unref();
