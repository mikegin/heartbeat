const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const { spawn } = require('child_process');
const server1 = spawn('node', ['server/server1.js']);

server1.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

server1.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

server1.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

const readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', function(line) {
    const lineArr = line.split(' ')
    if(lineArr.length > 0) {
        switch(lineArr[0].trim()) {
            case 'addMonitor':
            case 'removeMonitor':
                if(lineArr.length < 3) {
                    console.log('requires checker and checkee port number')
                    break;
                }
                let message = Buffer.from(lineArr[0].trim() + " " + lineArr[2].trim());
                client.send(message, lineArr[1].trim(), 'localhost');   

                break;
            default:
                console.log('Say what? I might have heard `' + line.trim() + '`');
            break;
        }
    }
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});