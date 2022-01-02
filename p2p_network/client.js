const jsonStream = require('duplex-json-stream')
const net = require('net');
const readline = require('readline')
let username;

const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
}); 

// For the client you can also use the net module to connect to the server.
// Just like with the connection, you can use process.stdin.on('data', ...) to read from stdin and process.stdout.write(data) to write to stdout.

const client = jsonStream(net.createConnection({port: 8125}, function() {
    console.log('CLIENT: Connected to server!'); 
    client.write("CLIENT: Hello this is client!")

    rl.question('What username do you want? ', (answer) => {
        username = answer
        console.log(`Your username is ${username}`);
    });
}));

client.on('data', function(data) {
   console.log(data.toString());
   //client.end();
});

client.on('end', function() { 
   console.log('CLIENT: Disconnected from server :(');
});

rl.on('line', (input) => { 
    if (username !== "") {
        // client.write(`${input}`);
        client.write({username: username, message: input});
    }
});

