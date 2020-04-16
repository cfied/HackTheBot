var bot = require('./bot');
var database = require('./database');
var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
app.use(express.json());

// returns room number and assigns partners if possible
// room -1 : chatbot room -2 : awaiting connection
async function assign_room_number(id){
  var partner;
  rand = Math.random();
  if(rand < 0.5){
    await database.add_user(id,"-1");
    available = "-1"
    return available;
  }else{
    return await database.assign_available_user(id);
  }
}

// when user connects, assign a room number and display messages
io.on('connection', function(socket){
  var partner;
  console.log('user connected');

  socket.on('request room number', () => {
      assign_room_number(socket.id).then((available) => {
        partner = available;
        console.log("matched " + socket.id + " to "+ partner);
        if(Number(partner) != -1 && Number(partner) != 0){
          database.get_messages(partner).then(rows => {
            for(index in rows){
              socket.emit('chat message', rows[index].content);
            }
          });
        }
      });
  });

  // received chat message from user
  socket.on('chat message', function(msg){
    database.get_partner(socket.id).then(partner => {
      database.add_message(socket.id,msg);
      if(Number(partner) == -1){
        // send bot response
        response = bot.respond(msg)
        setTimeout(function(){
            socket.emit('chat message',response);
        },response.length*300);
      }else{
        // send message to other user in human mode
        if(Number(partner) != 0){
          socket.to(partner).emit('chat message', msg);
        }
      }
    });
  });

  // user took a guess
  socket.on('check mode', function(val){
    database.get_partner(socket.id).then(partner => {
      var mode = Number(partner) >= 0 ? 0 : -1;
      bool = val == mode ? 1 : 0;
      if(Number(partner) != -1 && Number(partner) != 0){
        if(bool == 1){
          socket.to(partner).emit('decision', 'Oh no. Your opponent found out that you are a human.');
        }else{
          socket.to(partner).emit('decision', 'Congratulations! You tricked your opponent into thinking that you are a bot.');
        }
      }
      socket.emit('mode bool', bool.toString());
    });
  });

  // user confirmed result
  socket.on('leave',() => {
    database.get_partner(socket.id).then(partner => {
      database.delete_chat(socket.id, String(partner));
    });
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
