const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var myArgs = process.argv.slice(2);

if(myArgs.length < 1) {
  console.log('requires port number')
  return
}

const PORT = myArgs[0]

const intervalToPort = {

}

const addMonitor = (remotePort) => {
  const interval = setInterval(() => {
    const message = Buffer.from("checking hearbeat from " + PORT)
    server.send(message, remotePort, 'localhost')
  }, 2000)

  intervalToPort[remotePort] = interval
}

const removeMonitor = (remotePort) => {
  clearInterval(intervalToPort[remotePort])
  delete intervalToPort[remotePort]
}

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  const msgArr = msg.toString().split(' ')
  if(msgArr.length >= 2) {
    const [fn, remotePort] = msgArr
    if(fn === "addMonitor") {
      addMonitor(remotePort)
    }

    if(fn === "removeMonitor") {
      removeMonitor(remotePort)
    }
  }
  
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT);