require('dotenv').config()
const net = require('node:net');

const NETCAT_PORT = 5000;

const netcatServer = net.createServer((socket) => {
  console.log('Netcat client connected');
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
});
netcatServer.on('error', (err) => {
  console.error('Netcat connection error:', err);
});

netcatServer.listen(NETCAT_PORT, () => {
  console.log(`Netcat server listening on port ${NETCAT_PORT}`);
});