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
var matched = {};

// returns room number and assigns partners if possible
// room -1 : chatbot room -2 : awaiting connection
async function assign_room_number(id){
  rand = Math.random();
  if(rand < 0.5){
    mode[id] = 0;
  }else{
    mode[id] = 1;
  }

  if(mode[id] == 0){
    database.add_user(id,-1);
    matched[id] = -1
  }else{
    await database.assign_available_user(id);
    console.log("found available: " + available);
    matched[id] = available;
    matched[available] = id;
  }
}

// when user connects, assign a room number and display messages
io.on('connection', function(socket){
  var partner;
  console.log('user connected');

  socket.on('request room number', () => {
      assign_room_number(socket.id).then(() => {
        partner = matched[socket.id];
        console.log("matched " + socket.id + " to "+ partner);
        if(partner != -1 && partner != -2){
          database.get_messages(partner).then(rows => {
            console.log(rows[0]);
            for(index in rows){
              console.log(rows[index].content);
              socket.emit('chat message', rows[index].content);
            }
          });
        }
      });
  });

  // received chat message from user
  socket.on('chat message', function(msg){
    partner = matched[socket.id];
    database.add_message(socket.id,msg);
    // send message to other user in human mode
    if(mode[socket.id] == 1){
      if(partner != -2){
        socket.to(partner).emit('chat message', msg);
      }
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
    partner = matched[socket.id];
    if(Number(val) == mode[socket.id]){
      bool = 1;
    }else{
      bool = 0;
    }
    if(mode[socket.id] == 1){
      if(partner != -2){
        if(bool == 1){
          socket.to(partner).emit('decision', 'Oh no. Your opponent found out that you are a human.');
        }else{
          socket.to(partner).emit('decision', 'Congratulations! You tricked your opponent into thinking that you are a bot.');
        }
      }
    }
    socket.emit('mode bool', bool.toString());

  });
  // user confirmed result
  socket.on('leave',() => {
    partner = matched[socket.id];
    database.delete_chat(socket.id, String(partner));
    delete(matched[socket.id]);
    if(available_rooms.includes(socket.id)){
      available_rooms.splice(available_rooms.indexOf(socket.id),1);
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
