var bot = require('./bot');
var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
// human or bot
var mode = 0
var available_rooms = [];
var messages = {};
var assigned = {};

app.use(express.json());
i = -1;

// returns room number and assigns partners if possible
function assign_room_number(id){
  if(mode == 0){
    return -1;
  }else{
    if(available_rooms.length != 0){
      room = available_rooms.pop();
      assigned_rooms[id] = room[1];
      assigned_rooms[room[1]] = id;
      return room[0];
    }else{
      i++;
      available_rooms.push((i, id));
      messages[i] = [];
      return i;
    }
  }
}

io.on('connection', function(socket){
  var room;
  console.log('user connected');
  socket.on('request room number', () => {
    room = assign_room_number(socket.id);
    if(room != -1){
      socket.join(room);
    }
  });
  for(message in messages[room]){
      socket.emit('chat message', message);
  }
  socket.on('chat message', function(msg){
    // send message to other user in human mode
    if(mode == 1){
      messages[room].push(msg);
  		socket.to(room).broadcast.emit('chat message', msg);
    // or send bot response
    }else{
      socket.emit('chat message',bot.respond(msg));
    }
  });
  socket.on('check mode', function(val){
    bool = Number(val) == mode;
    socket.emit('mode bool', bool.toString());
  })
});


// welcome page
app.get('/', function (req, res) {
   fs.readFile('html/index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
})

app.get('/css_welcome', function (req, res) {
   fs.readFile('css/style.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/css_boot', function (req, res) {
   fs.readFile('css/bootstrap.min.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/png_robot', function (req, res) {
   fs.readFile('images/ban-1.png', function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
      });
})

app.get('/jpg_background', function (req, res) {
   fs.readFile('images/bg-1.jpg', function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(data);
        res.end();
      });
})


// starting chat
app.get('/chat', function (req, res) {
   console.log("Got a GET request for the homepage");
   fs.readFile('html/chat.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
   });
})


app.get('/css', function (req, res) {
   fs.readFile('css/chat.css', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
   });
})

// connect to bot or user
app.get('/js', function (req, res) {
   rand = Math.random();
   if(rand < 0.5){
     mode = 0
   }else{
     mode = 1
   }
   fs.readFile('js/chat.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      });
})

http.listen(3000, function () {
   console.log("Server online")
})
