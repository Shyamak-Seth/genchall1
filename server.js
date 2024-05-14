require('dotenv').config()
const net = require('node:net');
const express = require('express')
const app = express()

const NETCAT_PORT = process.env.PORT || 5000;
const requestCounts = {}
const WINDOW_SIZE_IN_HOURS = 1;
const MAX_WINDOW_REQUEST_COUNT = 30;

const resetRequestCounts = () => {
    for (const key in requestCounts) {
      requestCounts[key] = 0;
    }
};
setInterval(resetRequestCounts, WINDOW_SIZE_IN_HOURS * 60 * 60 * 1000);

const netcatServer = net.createServer((socket) => {
  console.log('Netcat client connected');
  const clientIP = socket.remoteAddress
  if (!requestCounts[clientIP]) {
    requestCounts[clientIP] = 1;
  } else {
    requestCounts[clientIP]++;
  }
  if (requestCounts[clientIP] > MAX_WINDOW_REQUEST_COUNT) {
    console.log('Rate limit exceeded for IP: ', clientIP);
    socket.end('Rate limit exceeded, try again later');
  } else {
    const num1 = '011011011',
        num2 = '01101010101'
    socket.write(`
    ************************************
    ******WELCOME TO ENCRYPTID CTF******
    ************************************

    Number 1: ${num1}
    Number 2: ${num2}

    For each level, you need to perform specific operations on the numbers given above. Press any key to continue.`)
    var level = 1

    socket.on('data', (data) => {
        const myData = data.toString()
        level += 1
        console.log(level);
    });

    socket.on('end', () => {
        console.log('Netcat client disconnected');
    });
    socket.pipe(socket)
  }
  socket.on('error', (err) => {
    console.error('Netcat connection error:', err);
  });
});

netcatServer.listen(NETCAT_PORT, () => {
  console.log(`Netcat server listening on port ${NETCAT_PORT}`);
});