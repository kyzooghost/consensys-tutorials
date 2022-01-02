// lsof -i :8125
// kill -9 PID

const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')
const net = require('net');

let activeSockets = streamSet()

// You can use the net module to create TCP servers in node. Check the docs for the createServer function and you'll be on your way. 
// Once you have a socket you can use the .on('data' function(data) {...}) method to read data from it and the .write(data) method to write to it.

const server = net.createServer()

server.on("connection", (socket) => { 
    socket = jsonStream(socket)
    activeSockets.add(socket)
    console.log("New client connection is made:", "Address: " + socket.remoteAddress + " | Port:" + socket.remotePort);
    console.log(activeSockets.size, "clients connected")
    
    socket.on("data", (data) => { 
        activeSockets.forEach((client) => {
            if (client !== socket && data.username !== undefined) {
                client.write(`${data.username}: ${data.message}`)
            }
        })
    }); 

    socket.once("close", () => { 
      console.log("client connection closed"); 
    }); 

    socket.on("error", (err) => { 
      console.log("client connection got errored out.") 
    }); 
}); 

server.on('error', (e) => { 
    if (e.code === 'EADDRINUSE') { 
      console.log('Address in use, retrying...'); 
      setTimeout(() => { 
        server.close(); 
        server.listen(port); 
      }, 1000); 
    } 
    else { 
      console.log("Server failed.") 
    } 
}); 

const port = 8125

server.listen(port, () => {
  console.log('Server is listening on port: ', server.address().port);
});