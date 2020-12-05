let nConnection = 0;
let express = require("express");
let socket = require("socket.io");
let dotenv = require("dotenv").config();
let app = express();
let server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));

let io = socket(server);
io.sockets.on('connection', socket => {
    console.log(`${nConnection}, id=${socket.id}`)
    io.sockets.emit("port", process.env.PORT)
    io.sockets.emit("access", nConnection);
    if(nConnection++ > 1) {
        socket.connection.end()
    }
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