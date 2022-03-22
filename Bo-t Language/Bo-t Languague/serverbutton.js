var express = require('express');

var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

console.log("server is running");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('new connection: ' + socket.id);
    socket.on('pauseMusic', audiopause);
    socket.on('playMusic', audioplay);

    function audiopause() {
        socket.broadcast.emit('pauseMusic', pamusic);
        console.log('Pausing');
    }

    function audioplay() {
        socket.broadcast.emit('playMusic', plmusic);
        console.log('Playing');
    }
}