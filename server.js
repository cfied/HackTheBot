var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.json());

var trigger = [
["tell me some stuff about you", "tell me about you", "say about you",
"tell me about your personality", "talk about yourself", "talk some stuff about yourself",
"what are you", "define yourself", "I want to know you better", "tell me about yourself", "tell me some stuff about yourself",
"tell me something about you", " tell me some shit about yourself", "tell me about urself"],
["how old are you", "what's your age", "whats ur age", "what's ur age", "whats your age", "age of yours",
"I'd like to know your age", "tell me your age", "how old r u", "your age", "ur age"],
["you annoy me", "you're incredibly annoying", "you are annoying", "how annoying you are", "you are annoying me",
"you're too annoying", "you're really annoying", "you are irritating", "you are very annoying", "you are such annoying",
"you are annoying me so much"],
["answer", "just answer my question", "I need answers", "I need an answer", "tell me the answer", "answer my question",
"can you answer me", "answering questions", "answer the question", "I have a question", "can you answer my question",
"can you answer a question", "give me the answer", "give me an answer"],
["you're a bad", "you're bad", "you are useless", "you are disgusting", "you're not a good", "you are bad",
"you are terrible", "you're the worst ever", "you are no good", "you are not good", "you are so bad"],
["be smarter", "get qualified", "you should study better", "get smarter", "be more clever", "study", "be smart",
"can you get smarter", "be clever", "you must learn", "you have a lot to learn"],
["you are gorgeous", "you are really pretty", "you're looking good", "you are beautiful", "you are very pretty",
"you are pretty", "you are so gorgeous", "you are gorgeous", "you are looking pretty", "you look pretty good",
"you look wonderful", "you are handsome", "you are looking beautiful today", "you look really pretty today",
"you are looking really pretty today", "you're attractive", "you're cute"],
["when were you born", "when do you have birthday", "when is your birthday", "your birth date", "when do you celebrate your birthday",
"date of your birthday", "what's your birthday"],
["you are very boring", "you are boring me", "how boring you are", "you are so boring", "you are boring", "you are really boring",
"you are incredibly boring"],["who is your boss", "who is the boss", "who do you work for", "who do you think is your boss",
"I should be your boss", "who is your master", "who is your owner"],
["are you busy", "are you working today", "you're very busy", "have you got much to do", "are you very busy right now",
"are you working", "have you been busy", "you seem to be very busy", "do you have a lot of things to do", "you are busy"],
["can you help me", "I need you right now", "I need your help", "assistance", "do you want to help me", "help me",
"I need help", "I want your help", "can you help me", "I need you to help me"],
["are you a bot", "you are chatbot", "you are a bot", "are you the bot", "you are a robot", "are you a chatbot",
"are you a program", "are you just a bot", "are you a robot"],
["you're clever", "you are very intelligent", "you know a lot of things", "you are really smart", "you're intelligent",
"you know so much", "you are qualified", "you're pretty smart"],
["you are crazy", "are you insane", "you're nuts", "you're so out of your mind", "are you nuts", "you went crazy",
"how crazy you are", "you are mad", "are you mad", "you are a weirdo"],
["now you're fired", "it's time to fire you", "you are unemployed from now on", "you don't work for me anymore",
"I will fire you", "we're not working together anymore", "you are fired", "I want to fire you", "you are dismissed",
"you should be fired"], ["you make me laugh a lot", "you are funny", "you are so funny", "you're so funny", "how funny you are",
"you're incredibly funny", "you're really funny", "you are hilarious", "you are very funny"],
["you are the nicest person in the world", "you are really amazing", "you rock", "you are wonderful", "you are very lovely",
"you are the best in the world", "you are the best", "you are so cool", "you work well", "you are so helpful"],
["are you happy now", "you're extremely happy", "you're really happy", "you are happy", "you are happy", "are you happy today", "are you happy right now", "you're so happy", "how happy you are", "are you happy with me", "you're very happy"]]

var reply = [
	["I'm cool", "I'm an Informatics student at the uni of edinburgh", "eh idk what's interesting about me lol, tell me something about yourself!?"],
	["I'm 19, you?", "I am 19 years old:)"],
	["fuck off", "why r u so mean?:(", "lol why?", "u too"],
	["what's your question??", "what do you wanna know?", "tell me the question lol"],
	[":(", "not true u r mean",
	"why are you insulting me I have literally never talked to u before!?"],
	["I'm working on it", "yeah I know ...I'm gonna work harder from now on..."],
	["Aww back at you!!", "Thank you!!! You too!"],
	["today lol", "it's actually today..."],
	["sorry:(", "no I'm not shut up :(", ":(", "RUDE", "hey I didn't say anything bad about u, why r u so mean?"],
	["I'm a student so the uni?? idk haha", "I'm still at uni haha", "my parents hahahaha"],
	["never too busy for you. shall we chat? ;)", "no you're my priority ;)", "I always have time to chat with you love:)", "no:)"],
	["how can I help?", "what's up?", "what can I do for you?", "not sure if I can help but I'll try, what do you need help with?"],
	["maybe;)", "who knows?", "thats what you need to figure out in order to win the game so I'm not gonna tell u lol"],
	["thank you haha I try my best", "noo you're way smarter than me", "tysm!!!"],
	["no I'm not", "I'm just a bit confused haha", "noo:("],
	["tf why", "what why"],
	["funny in a good way I hope haha", "thanks?", "glad you think that lol", "haha thanks"],
	["aww thanks!! u too:)", "thank youuu u tooooo", "aww you just made my day!!! u too:))"],
	["not really haha but it's fine dont worry", "kinda...kinda not though...", "happiness is relative..."]
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

// welcome page
app.get('/', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('html/index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
})

app.get('/js_welcome', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('js/jque.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      });
})

app.get('/css_welcome', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('css/style.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/css_boot', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('css/bootstrap.min.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
})

app.get('/png_robot', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('images/ban-1.png', function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        res.end();
      });
})

app.get('/jpg_background', function (req, res) {
   //console.log("Got a GET request for the homepage");
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
   //console.log("Got a GET request for the homepage");
   fs.readFile('css/chat.css', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
   });
})

app.get('/js', function (req, res) {
   //console.log("Got a GET request for the homepage");
   fs.readFile('js/chat.js', function(err, data) {
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
  console.log("responded:");
	res.writeHead(200, {'Content-Type': 'application/json'});
	var jsonObj = {'answer':respond(JSON.stringify(req.body.message))};
	res.write(JSON.stringify(jsonObj));
	res.end();
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
