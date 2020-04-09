var bot = require('./bot');
var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
// human or bot
var mode = {}
var available_rooms = [];
var messages = {};

app.use(express.json());
i = -1;

// returns room number and assigns partners if possible
function assign_room_number(id){
  console.log("available " + available_rooms );
  rand = Math.random();
  if(rand < 0){
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
    console.log("assigned " + socket.id + " to room "+ room);
    if(room != -1){
      socket.join(room);
    }
  });

  for(message in messages[room]){
      socket.emit('chat message', message);
  }

  socket.on('chat message', function(msg){
    // send message to other user in human mode
    if(mode[socket.id] == 1){
      console.log(messages);
      messages[room].push(msg);
  		socket.to(room).broadcast.emit('chat message', msg);
    // or send bot response
    }else{
      socket.emit('chat message',bot.respond(msg));
    }
  });

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
    console.log(bool);
    socket.emit('mode bool', bool.toString());

  });

  socket.on('leave',() => {
    socket.leave(room);
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
