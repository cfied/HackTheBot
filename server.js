const bot = require('./bot');
/* TO-DO:

  save which user sent message (reloading cause a switch of the side,
  messages are kept for next turn)
  figure out why callback error only occurs remotely
  design decision, two js files for chat seems redundant

*/

// human or bot
var mode = 0
var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var messages = [];

console.log(messages);

app.use(express.json());


io.on('connection', function(socket){
  console.log('user connected');
  for(var i = 0; i < messages.length; i++){
    socket.emit('chat message', messages[i]);
    console.log(messages[i]);
  }
  socket.on('chat message', function(msg){
		console.log("Socket message: " + msg);
    messages.push(msg);
    console.log(messages.toString())
    if(mode == 1){
		  socket.broadcast.emit('chat message', msg);
    }
  });
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
     file = 'js/chat.js'
     mode = 0
   }else{
     file = 'js/chat_human.js'
     mode = 1
   }
   fs.readFile(file, function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      });
})

app.get('/welcome', function (req, res){
  console.log("Yay, send myself a request");
  res.send("Lovely to see you");
})

//figure out if to send as string or create json file
app.post('/message', function(req, res){
  console.log("This actually happens")
	console.log((JSON.stringify(req.body.message)));
	if(JSON.stringify(req.body.message)==="h"){
		console.log("They are the same");
	}
	res.writeHead(200, {'Content-Type': 'application/json'});
	var jsonObj = {'answer':bot.respond(JSON.stringify(req.body.message))};
	res.write(JSON.stringify(jsonObj));
	res.end();
})

http.listen(3000, function () {
   console.log("Server online")
})
