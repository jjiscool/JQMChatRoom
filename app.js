var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

var records=new Array;

server.listen(80);



app.use("/", express.static(__dirname + '/public'));



io.sockets.on('connection', function (socket) {
  var username='';

  socket.on('msg', function (data) {
    if(records.length>50){ 
        records.shift();
        records.push(data);
    }
    else{
        records.push(data);
    }
    socket.emit('new', data);
    socket.broadcast.emit('new', data);

  });

   socket.on('login', function (data) {
    var newd=records.concat();
    username=data.name;
    if(newd.length>50){ 
        newd.shift();
        newd.push(data);
    }
    else{
        newd.push(data);
    }
    socket.emit('in', newd);
    socket.broadcast.emit('new', data);

  });
  socket.on('disconnect', function () {
      
    socket.broadcast.emit('new', {name:username,msg:"【"+username+"离开了聊天室】"});
  });

});