// TO-DO: switch storage of available rooms and room members to database

var bot = require('./bot');
var database = require('./database');

var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
app.use(express.json());
// 0 : bot or 1: human
var mode = {}
var available_rooms = [];
var i = -1;

// returns room number and assigns partners if possible
function assign_room_number(id){
  console.log("available " + available_rooms );
  rand = Math.random();
  if(rand < 0.5){
    mode[id] = 0;
  }else{
    mode[id] = 1;
  }

  if(mode[id] == 0){
    return -1;
  }else{
    if(available_rooms.length != 0){
      room = available_rooms.pop();
      console.log("asigning " + room);
      return room[0];
    }else{
      i++;
      available_rooms.push([i, id]);
      console.log("available " + available_rooms);
      return i;
    }
  }
}

// when user connects, assign a room number and display messages
io.on('connection', function(socket){
  var room;
  console.log('user connected');

  socket.on('request room number', () => {
    room = assign_room_number(socket.id);
    console.log("assigned " + socket.id + " to room "+ room);
    if(room != -1){
      socket.join(room);
    }
    database.get_messages(room).then(rows => {
      console.log(rows[0]);
      for(index in rows){
        console.log(rows[index].content);
        socket.emit('chat message', rows[index].content);
      }
    });
  });

  // received chat message from user
  socket.on('chat message', function(msg){
    database.add_message(socket.id,room,msg);
    // send message to other user in human mode
    if(mode[socket.id] == 1){
  		socket.to(room).broadcast.emit('chat message', msg);
    // or send bot response
    }else{
      response = bot.respond(msg)
      setTimeout(function(){
          socket.emit('chat message',response);
      },response.length*300);
    }
  });
  // user took a guess
  socket.on('check mode', function(val){
    if(Number(val) == mode[socket.id]){
      bool = 1;
    }else{
      bool = 0;
    }
    if(mode[socket.id] == 1){
      if(bool == 1){
        socket.to(room).broadcast.emit('decision', 'Oh no. Your opponent found out that you are a human.');
      }else{
        socket.to(room).broadcast.emit('decision', 'Congratulations! You tricked your opponent into thinking that you are a bot.');
      }
    }
    socket.emit('mode bool', bool.toString());

  });
  // user confirmed result
  socket.on('leave',() => {
    socket.leave(room);
    database.delete_room(room);
    if(available_rooms.includes(room)){
      available_rooms.remove(room);
    }
  });
});


// welcome page
app.get('/', function (req, res) {
   fs.readFile('../html/index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
})

app.get('/css_welcome', function (req, res) {
   fs.readFile('../css/style.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/css_boot', function (req, res) {
   fs.readFile('../css/bootstrap.min.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/png_robot', function (req, res) {
   fs.readFile('../images/ban-1.png', function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
      });
})

app.get('/jpg_background', function (req, res) {
   fs.readFile('../images/bg-1.jpg', function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(data);
        res.end();
      });
})

// starting chat
app.get('/chat', function (req, res) {
   console.log("Got a GET request for the homepage");
   fs.readFile('../html/chat.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
   });
})

app.get('/css', function (req, res) {
   fs.readFile('../css/chat.css', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
   });
})

app.get('/js', function (req, res) {
   fs.readFile('../js/chat.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      });
})

http.listen(3000, function () {
   console.log("Server online")
})
