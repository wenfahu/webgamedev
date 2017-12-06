var express = require('express');
var redis = require('redis');
var DateTime = require('luxon').DateTime;

var pub = redis.createClient()
var sub = redis.createClient()

var app = express();
app.use(express.static('dist'))
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(8888);

sub.subscribe('latest');

var liked = 0;

var mio = io.of('/msg');
mio.on('connection', function(socket){
    console.log('message connected');
    pub.lrange('history', 0, -1, function(err, data){
        socket.send(data);
    });
    socket.on("io:message", function(text){
        let str = JSON.stringify({
            m: text,
            t: DateTime.local().toISO(),
            n: socket.conn.id
        });
        console.log(socket.conn.id);
        console.log("msg recv: " + text);
        pub.rpush('history', str);
        pub.publish('latest', str);
    });
});

sub.on("message", function(channel, message){
    mio.emit(channel, message);
});

var nio = io.of('/like');
nio.on('connection', function(socket){
    console.log('liked connected');
    socket.send({likes: liked});
    socket.on('liked', function(){
        liked = liked + 1;
        console.log(liked);
        socket.emit('change_liked', {likes: liked});
        socket.broadcast.emit('change_liked', {likes: liked});
    });
});

