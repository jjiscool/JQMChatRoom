var express = require('express');

var app = express();
//app.use(express.logger());



var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

var records=new Array;

var users=new Array;

app.use(express.static(__dirname + '/public'));

server.listen(80);





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
    //console.log("Login");
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

   socket.on('isRegisted', function (data) {
   console.log(users[data.uid]);
     if(users[data.uid]){

        socket.emit('isRegistedR', {isRegist:"yes",username:users[data.uid]});

     }else{

        socket.emit('isRegistedR', {isRegist:"no",username:"null"});

     }

  });

   socket.on('Regist', function (data) {
     //console.log(users[data.uid]);
     users[data.uid]=data.name;
     //console.log(users[data.uid]);

  });
  socket.on('disconnect', function () {
      
    socket.broadcast.emit('new', {name:username,msg:"【"+username+"离开了聊天室】"});
  });

});