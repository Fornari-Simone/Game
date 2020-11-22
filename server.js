let nConnection = 0;
let express = require("express");
let socket = require("socket.io");
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

let io = socket(server);
io.sockets.on('connection', socket => {
    console.log(`${nConnection}, id=${socket.id}`)
    io.sockets.emit("access", nConnection);
    nConnection++;
    socket.on('disconnect', reason => {
        console.log(reason)
        nConnection--;
        io.sockets.emit("disconn", nConnection)
    })

    socket.on('change', data => {
        socket.broadcast.emit('change', data)
    })
})

//socket.client.server.eio