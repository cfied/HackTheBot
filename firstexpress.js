var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.json());

var trigger = [
	["hi","hey","hello"],
	["how are you", "how is life", "how are things"],
	["what are you doing", "what is going on"],
	["how old are you"],
	["who are you", "are you human", "are you bot", "are you human or bot"],
	["who created you", "who made you"],
	["your name please",  "your name", "may i know your name", "what is your name"],
	["i love you"],
	["happy", "good"],
	["bad", "bored", "tired"],
	["help me", "tell me story", "tell me joke"],
	["ah", "yes", "ok", "okay", "nice", "thanks", "thank you"],
	["bye", "good bye", "goodbye", "see you later"]
];
var reply = [
	["Hi","Hey","Hello"],
	["Fine", "Pretty well", "Fantastic"],
	["Nothing much", "About to go to sleep", "Can you guest?", "I don't know actually"],
	["I am 1 day old"],
	["I am just a bot", "I am a bot. What are you?"],
	["Kani Veri", "My God"],
	["I am nameless", "I don't have a name"],
	["I love you too", "Me too"],
	["Have you ever felt bad?", "Glad to hear it"],
	["Why?", "Why? You shouldn't!", "Try watching TV"],
	["I will", "What about?"],
	["Tell me a story", "Tell me a joke", "Tell me about yourself", "You are welcome"],
	["Bye", "Goodbye", "See you later"]
];
var alternative = ["Haha...", "Eh..."];


function respond(input){
	console.log(input);
  var text = (input.toLowerCase()).replace(/[^\w\s\d]/gi, ""); //remove all chars except words, space and
  text = text.replace(/ a /g, " ").replace(/i feel /g, "").replace(/whats/g, "what is").replace(/please /g, "").replace(/ please/g, "");
  if(compare(trigger, reply, text)){
    var response = compare(trigger, reply, text);
  } else {
    var response = alternative[Math.floor(Math.random()*alternative.length)];
  }
  return response;
}

function compare(arr, array, string){
	var item;
	for(var x=0; x<arr.length; x++){
		for(var y=0; y<array.length; y++){
			if(arr[x][y] == string){
				items = array[x];
				item =  items[Math.floor(Math.random()*items.length)];
			}
		}
	}
	return item;
}


// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   fs.readFile('chathtml.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
})

app.get('/css', function (req, res) {
   console.log("Got a GET request for the homepage");
   fs.readFile('chatcss.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/js', function (req, res) {
   console.log("Got a GET request for the homepage");
   fs.readFile('chatjs.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/js'});
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
  console.log("responded:");
//	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(respond(JSON.stringify(req.body.message)));
	res.end();
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
